import { PrismaClient } from '@prisma/client';
import { parseFeatures, calculateJaccardSimilarity } from '../utils/similarity';

const prisma = new PrismaClient();

export const InteractionType = {
    LIKE: 'LIKE',
    DISLIKE: 'DISLIKE',
    WANT: 'WANT',
    NOT_WANT: 'NOT_WANT',
    SKIPPED: 'SKIPPED'
} as const;

interface RecommendationResult {
    tmdbId: number;
    title: string;
    overview: string | null;
    poster_path: string | null;
    score?: number;
    mediaType?: 'MOVIE' | 'TV';
}

// Cleanup expired skipped items (> 30 days)
const cleanExpiredSkips = async (userId: number) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await prisma.userInteraction.deleteMany({
        where: {
            userId,
            type: InteractionType.SKIPPED,
            createdAt: {
                lt: thirtyDaysAgo
            }
        }
    });
};

export const getDiscoveryRecommendations = async (userId: number): Promise<RecommendationResult[]> => {
    await cleanExpiredSkips(userId);

    // 1. Get all interactions to exclude
    const allInteractions = await prisma.userInteraction.findMany({
        where: { userId },
        select: { tmdbId: true, mediaType: true, type: true }
    });

    const interactedSet = new Set(allInteractions.map(i => `${i.mediaType}:${i.tmdbId}`));

    // 2. Build User Profile from POSITIVE interactions
    const positiveInteractions = allInteractions.filter(i =>
        i.type === InteractionType.LIKE || i.type === InteractionType.WANT
    );

    // To build profile, we need genres of these items. 
    // This requires fetching them.
    // Optimization: We could store features in UserInteraction, but for now we fetch.
    const movieIds = positiveInteractions.filter(i => i.mediaType === 'MOVIE').map(i => i.tmdbId);
    const tvIds = positiveInteractions.filter(i => i.mediaType === 'TV').map(i => i.tmdbId);

    const positiveMovies = await prisma.movie.findMany({ where: { id: { in: movieIds } } });
    const positiveTV = await prisma.tVShow.findMany({ where: { id: { in: tvIds } } }); // tVShow based on schema

    const userFeatures = new Set<string>();
    positiveMovies.forEach(m => parseFeatures(m.genres).forEach(f => userFeatures.add(f)));
    positiveTV.forEach(t => parseFeatures(t.genres).forEach(f => userFeatures.add(f)));

    // 3. Fetch Candidates (Exclude interacted)
    // We fetch a large pool to score. In production, use DB filtering or TitleScore.
    // Here we do real-time scoring as requested.
    const allMovies = await prisma.movie.findMany();
    const allTV = await prisma.tVShow.findMany();

    const candidates = [];

    // Score Movies
    for (const m of allMovies) {
        if (interactedSet.has(`MOVIE:${m.id}`)) continue;

        let score = 0;
        if (userFeatures.size > 0) {
            const features = parseFeatures(m.genres);
            score = calculateJaccardSimilarity(userFeatures, features);
            // Mix in popularity slightly to break ties? Or strict jaccard?
            // User said "calculate score", let's assume strict Jaccard primarily.
        } else {
            // Cold start: Popularity
            score = m.popularity;
        }
        candidates.push({ ...m, mediaType: 'MOVIE' as const, score });
    }

    // Score TV
    for (const t of allTV) {
        if (interactedSet.has(`TV:${t.id}`)) continue;

        let score = 0;
        if (userFeatures.size > 0) {
            const features = parseFeatures(t.genres);
            score = calculateJaccardSimilarity(userFeatures, features);
        } else {
            score = t.popularity;
        }
        candidates.push({
            title: t.title,
            overview: t.overview,
            poster_path: t.poster_path,
            id: t.id,
            mediaType: 'TV' as const,
            score
        });
    }

    // 4. Sort and Pick Top 5 of each
    const movieCandidates = candidates.filter(c => c.mediaType === 'MOVIE').sort((a, b) => b.score - a.score);
    const tvCandidates = candidates.filter(c => c.mediaType === 'TV').sort((a, b) => b.score - a.score);

    const topMovies = movieCandidates.slice(0, 5);
    const topTV = tvCandidates.slice(0, 5);

    // 5. Randomize List
    const combined = [...topMovies, ...topTV];

    // Fisher-Yates Shuffle
    for (let i = combined.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [combined[i], combined[j]] = [combined[j], combined[i]];
    }

    return combined.map(c => ({
        tmdbId: c.id,
        title: c.title,
        overview: c.overview,
        poster_path: c.poster_path,
        score: c.score,
        mediaType: c.mediaType
    }));
};

export const getUserRecommendations = async (userId: number): Promise<RecommendationResult[]> => {
    // Keep using TitleScore for "Personal" (fast access) or whatever previous logic?
    // User complaint was about discovery.
    // "when getuserrecommendations this will pull up the top 50 highest score"
    // So this function logic remains: retrieve from TitleScore table.

    const scores = await prisma.titleScore.findMany({
        where: { userId },
        orderBy: { score: 'desc' },
        take: 50
    });

    const results: RecommendationResult[] = [];
    for (const item of scores) {
        if (item.mediaType === 'MOVIE') {
            const m = await prisma.movie.findUnique({ where: { id: item.tmdbId } });
            if (m) results.push({ ...m, tmdbId: m.id, score: item.score, mediaType: 'MOVIE' });
        } else {
            const t = await prisma.tVShow.findUnique({ where: { id: item.tmdbId } });
            if (t) results.push({ title: t.title, overview: t.overview, poster_path: t.poster_path, tmdbId: t.id, score: item.score, mediaType: 'TV' });
        }
    }
    return results;
};
