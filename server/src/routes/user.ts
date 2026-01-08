
import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken, AuthRequest } from '../middlewares/authMiddleware';

const router = express.Router();
const prisma = new PrismaClient();

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Error: File upload only supports the following filetypes - " + filetypes));
    }
});

// GET /api/user/profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = (req as AuthRequest).user!.userId;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, username: true, email: true, profilePicture: true, createdAt: true }
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// PUT /api/user/profile
router.put('/profile', authenticateToken, async (req, res) => {
    const userId = (req as AuthRequest).user!.userId;
    const { username } = req.body;

    try {
        // Validation
        if (username) {
            const existing = await prisma.user.findUnique({ where: { username } });
            if (existing && existing.id !== userId) {
                res.status(400).json({ error: 'Username already taken' });
                return;
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { username },
            select: { id: true, username: true, email: true, profilePicture: true }
        });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// POST /api/user/avatar
router.post('/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
    const userId = (req as AuthRequest).user!.userId;

    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }

    try {
        const fileUrl = `/uploads/${req.file.filename}`;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { profilePicture: fileUrl },
            select: { id: true, username: true, email: true, profilePicture: true }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to upload avatar' });
    }
});
// DELETE /api/user/data
router.delete('/data', authenticateToken, async (req, res) => {
    const userId = (req as AuthRequest).user!.userId;

    try {
        // Delete all interactions
        await prisma.userInteraction.deleteMany({
            where: { userId }
        });

        // Delete all scores
        await prisma.titleScore.deleteMany({
            where: { userId }
        });

        res.json({ message: 'User data cleared successfully' });
    } catch (error) {
        console.error("Failed to clear user data", error);
        res.status(500).json({ error: 'Failed to clear user data' });
    }
});

export default router;
