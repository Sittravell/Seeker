import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') }); // src/scripts/seed.ts -> ../../..
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const TMDB_TOKEN = process.env.VITE_TMDB_API_READ_ACCESS_TOKEN;

if (!TMDB_TOKEN) {
    console.error("Missing VITE_TMDB_API_READ_ACCESS_TOKEN");
    process.exit(1);
}

const tmdb = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        'Content-Type': 'application/json',
    },
});

async function seed() {
    try {
        console.log("Starting seed...");
        const moviesToSave = [];

        // Fetch 5 pages of popular movies
        for (let page = 1; page <= 5; page++) {
            console.log(`Fetching page ${page}...`);
            const res = await tmdb.get('/movie/popular', { params: { page } });
            const results = res.data.results;

            for (const m of results) {
                // Fetch details for extra fields if needed, 
                // but for now we just map standard fields
                // We need genres as string for our simple schema
                // But popular list gives genre_ids. 
                // We'll simplisticly store genre_ids or just empty string for now,
                // OR fetch genres list once and map.
                // For speed, let's just store IDs or empty.
                moviesToSave.push({
                    id: m.id, // Use TMDB ID as ID
                    title: m.title,
                    overview: m.overview,
                    poster_path: m.poster_path,
                    popularity: m.popularity,
                    vote_average: m.vote_average,
                    release_date: m.release_date,
                    // Basic placeholder for these since lists don't have them full
                    genres: m.genre_ids ? m.genre_ids.join(',') : '',
                    keywords: '',
                    final_score: m.vote_average // Initial score
                });
            }
        }

        console.log(`Saving ${moviesToSave.length} movies...`);
        for (const movie of moviesToSave) {
            await prisma.movie.upsert({
                where: { id: movie.id },
                update: movie,
                create: movie
            });
        }
        console.log("Seed complete!");
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
