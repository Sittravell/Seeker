import express from 'express';
import { ingestContent, calculateScores } from '../services/scheduler';

const router = express.Router();

// Trigger Ingestion (Manual Sync)
router.post('/sync', async (req, res) => {
    try {
        console.log("Admin Sync Triggered");

        // Run in background so we don't timeout the request? 
        // Or await if user wants to know when done? 
        // Given it's 50 pages, it might take time. Let's await for now but beware of timeout.
        // Actually, let's just trigger and return 202 Accepted.
        ingestContent().then(() => {
            console.log("Ingestion finished via Admin Trigger");
            return calculateScores();
        }).then(() => {
            console.log("Scoring finished via Admin Trigger");
        });

        res.status(202).json({ message: 'Sync started in background.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to start sync' });
    }
});

export default router;
