import express from 'express';
import { authenticateToken, AuthRequest } from '../middlewares/authMiddleware';
import { getDiscoveryRecommendations, getUserRecommendations } from '../services/engine';

const router = express.Router();

// Get Discovery Recommendations (Uninteracted only)
router.get('/discovery', authenticateToken, async (req, res) => {
    try {
        console.log(req)
        const userId = (req as AuthRequest).user!.userId;
        const results = await getDiscoveryRecommendations(userId);
        res.json({ results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Discovery recommendation failed' });
    }
});

// Get Personal Recommendations (Watchlist + Mix)
router.get('/personal', authenticateToken, async (req, res) => {
    try {
        const userId = (req as AuthRequest).user!.userId;
        const results = await getUserRecommendations(userId);
        res.json({ results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Personal recommendation failed' });
    }
});

export default router;
