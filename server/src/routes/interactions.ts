import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middlewares/authMiddleware';

const router = express.Router();
const prisma = new PrismaClient();

// Add or Update Interaction
router.post('/', authenticateToken, async (req, res) => {
    try {
        const userId = (req as AuthRequest).user!.userId;
        const { tmdbId, type, mediaType = 'MOVIE' } = req.body;

        if (!tmdbId || !type) {
            res.status(400).json({ error: 'tmdbId and type are required' });
            return;
        }

        // Upsert the interaction
        const interaction = await prisma.userInteraction.upsert({
            where: {
                userId_tmdbId_mediaType: {
                    userId,
                    tmdbId,
                    mediaType,
                },
            },
            update: {
                type,
                createdAt: new Date(),
            },
            create: {
                userId,
                tmdbId,
                type,
                mediaType,
            },
        });

        res.json(interaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save interaction' });
    }
});

// Get User Interactions
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = (req as AuthRequest).user!.userId;
        const { tmdbId, mediaType } = req.query;

        const whereClause: any = { userId };

        if (tmdbId) whereClause.tmdbId = Number(tmdbId);
        if (mediaType) whereClause.mediaType = String(mediaType);

        const interactions = await prisma.userInteraction.findMany({
            where: whereClause,
        });
        res.json(interactions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch interactions' });
    }
});

export default router;
