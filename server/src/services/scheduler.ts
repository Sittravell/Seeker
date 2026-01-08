
import { PrismaClient, User, Movie, TVShow } from '@prisma/client';
import axios from 'axios';
import { parseFeatures, calculateJaccardSimilarity } from '../utils/similarity';

const prisma = new PrismaClient();
const TMDB_TOKEN = process.env.VITE_TMDB_API_READ_ACCESS_TOKEN;

// Reuse shared types locally or extract them (using string literals for simplicity here as we are in backend service)
const InteractionType = {
    LIKE: 'LIKE',
    DISLIKE: 'DISLIKE',
    WANT: 'WANT',
    NOT_WANT: 'NOT_WANT',
    SKIPPED: 'SKIPPED'
};

const tmdb = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        'Content-Type': 'application/json',
    },
});


/* --- INGESTION JOB --- */
export const ingestContent = async () => {
    console.log("Starting Content Ingestion...");

    if (!TMDB_TOKEN) {
        console.error("Missing VITE_TMDB_API_READ_ACCESS_TOKEN");
        return;
    }

    try {
        // 1. Ingest Movies (25 pages -> ~500 items)
        for (let page = 1; page <= 25; page++) {
            try {
                const res = await tmdb.get('/movie/popular', { params: { page } });
                for (const m of res.data.results) {
                    await prisma.movie.upsert({
                        where: { id: m.id },
                        update: {
                            title: m.title,
                            overview: m.overview,
                            poster_path: m.poster_path,
                            popularity: m.popularity,
                            vote_average: m.vote_average,
                            release_date: m.release_date,
                            final_score: m.vote_average,
                            // Ensure genres is string
                            genres: m.genre_ids ? m.genre_ids.join(',') : '',
                            keywords: '' // In real app, would fetch keywords detailed endpoint
                        },
                        create: {
                            id: m.id,
                            title: m.title,
                            overview: m.overview,
                            poster_path: m.poster_path,
                            popularity: m.popularity,
                            vote_average: m.vote_average,
                            release_date: m.release_date,
                            final_score: m.vote_average,
                            genres: m.genre_ids ? m.genre_ids.join(',') : '',
                            keywords: ''
                        }
                    });
                }
                console.log(`Ingested Movies Page ${page}`);
            } catch (err) {
                console.error(`Failed to ingest movies page ${page}`, err);
            }
        }

        // 2. Ingest TV Shows (25 pages -> ~500 items)
        for (let page = 1; page <= 25; page++) {
            try {
                const res = await tmdb.get('/tv/popular', { params: { page } });
                for (const t of res.data.results) {
                    await prisma.tVShow.upsert({
                        where: { id: t.id },
                        update: {
                            title: t.name, // TMDB uses 'name' for TV
                            overview: t.overview,
                            poster_path: t.poster_path,
                            popularity: t.popularity,
                            vote_average: t.vote_average,
                            first_air_date: t.first_air_date,
                            final_score: t.vote_average,
                            genres: t.genre_ids ? t.genre_ids.join(',') : '',
                            keywords: ''
                        },
                        create: {
                            id: t.id,
                            title: t.name,
                            overview: t.overview,
                            poster_path: t.poster_path,
                            popularity: t.popularity,
                            vote_average: t.vote_average,
                            first_air_date: t.first_air_date,
                            final_score: t.vote_average,
                            genres: t.genre_ids ? t.genre_ids.join(',') : '',
                            keywords: ''
                        }
                    });
                }
                console.log(`Ingested TV Page ${page}`);
            } catch (err) {
                console.error(`Failed to ingest TV page ${page}`, err);
            }
        }

        console.log("Ingestion Complete.");
    } catch (e) {
        console.error("Ingestion Fatal Error", e);
    }
};

/* --- SCORING JOB --- */
export const calculateScores = async () => {
    console.log("Starting Score Calculation...");

    const users = await prisma.user.findMany({
        include: { interactions: true }
    });

    const allMovies = await prisma.movie.findMany();
    const allTV = await prisma.tVShow.findMany(); // note prisma capitalization usually tVShow if model is TVShow

    for (const user of users) {
        console.log(`Processing User ${user.id}...`);

        // 1. Build User Profile
        // We only care about positive signals (LIKE, WANT) to build the taste profile
        const positiveInteractions = user.interactions.filter(i =>
            i.type === InteractionType.LIKE || i.type === InteractionType.WANT
        );

        const interactedIds = new Set(user.interactions.map(i => `${i.mediaType}:${i.tmdbId}`));

        const userFeatures = new Set<string>();

        // Naive feature extraction from local DB for positive interactions
        // In a real app we would join tables. Here we have to find the movie/tv in our loaded lists
        // Note: This is O(N^2) effectively if we search array. Ideally we map them.
        const movieMap = new Map(allMovies.map(m => [m.id, m]));
        const tvMap = new Map(allTV.map(t => [t.id, t]));

        positiveInteractions.forEach(i => {
            let genresStr = '';
            if (i.mediaType === 'MOVIE' && movieMap.has(i.tmdbId)) {
                genresStr = movieMap.get(i.tmdbId)!.genres;
            } else if (i.mediaType === 'TV' && tvMap.has(i.tmdbId)) {
                genresStr = tvMap.get(i.tmdbId)!.genres;
            }
            parseFeatures(genresStr).forEach(f => userFeatures.add(f));
        });

        // 2. Score Candidates
        // Loop through everything in DB.
        // If user hasn't interacted, calculate score and save.

        const scoresToUpsert = [];

        // Movies
        for (const movie of allMovies) {
            if (interactedIds.has(`MOVIE:${movie.id}`)) continue; // Skip if interacted

            const movieFeatures = parseFeatures(movie.genres);
            let sim = 0;
            if (userFeatures.size > 0) {
                sim = calculateJaccardSimilarity(userFeatures, movieFeatures);
            } else {
                // Cold start: normalize popularity (rough max 10000)
                sim = Math.min(movie.popularity / 2000, 1.0);
            }

            // Weighted score: 70% similarity, 30% popularity/rating
            // (Simple heuristic)
            const finalScore = (sim * 0.7) + ((movie.vote_average / 10) * 0.3);

            scoresToUpsert.push({
                userId: user.id,
                tmdbId: movie.id,
                mediaType: 'MOVIE',
                score: finalScore
            });
        }

        // TV
        for (const show of allTV) {
            if (interactedIds.has(`TV:${show.id}`)) continue;

            const tvFeatures = parseFeatures(show.genres);
            let sim = 0;
            if (userFeatures.size > 0) {
                sim = calculateJaccardSimilarity(userFeatures, tvFeatures);
            } else {
                sim = Math.min(show.popularity / 2000, 1.0);
            }

            const finalScore = (sim * 0.7) + ((show.vote_average / 10) * 0.3);

            scoresToUpsert.push({
                userId: user.id,
                tmdbId: show.id,
                mediaType: 'TV',
                score: finalScore
            });
        }

        // 3. Batch Save (We iterate one by one or batch if possible)
        // Prisma createMany is not available on SQLite? It IS available in recent versions.
        // But upserting is safer for re-runs. 
        // For performance, we'll delete old scores for this user and bulk create new ones.
        // This effectively "refreshes" the cache.

        await prisma.titleScore.deleteMany({ where: { userId: user.id } });

        // Chunk inserts to avoid SQLite limits
        // Batch insert using transaction for SQLite compatibility
        const CHUNK_SIZE = 50;
        for (let i = 0; i < scoresToUpsert.length; i += CHUNK_SIZE) {
            const chunk = scoresToUpsert.slice(i, i + CHUNK_SIZE);
            await prisma.$transaction(
                chunk.map(data => prisma.titleScore.create({ data }))
            );
        }
    }
    console.log("Score Calculation Complete.");
};
