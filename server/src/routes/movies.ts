import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();
const prisma = new PrismaClient();

// Get all movies (Paginated)
router.get('/', async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    try {
        const movies = await prisma.movie.findMany({
            skip,
            take: limit,
            orderBy: { popularity: 'desc' }
        });
        const total = await prisma.movie.count();
        res.json({
            page,
            total_results: total,
            total_pages: Math.ceil(total / limit),
            results: movies
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});

// Add a movie (Protected, maybe admin only in future)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const movie = await prisma.movie.create({
            data: req.body
        });
        res.status(201).json(movie);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create movie' });
    }
});

export default router;
