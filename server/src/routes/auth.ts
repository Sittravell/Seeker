import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

router.post('/register', async (req, res) => {
    const { email, password, username } = req.body;

    if (!username || !email || !password) {
        res.status(400).json({ error: 'Username, email, and password are required' });
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`
            },
        });
        res.status(201).json({ message: 'User created' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'User already exists or invalid data' });
    }
});

router.post('/login', async (req, res) => {
    const { identifier, password } = req.body; // identifier can be email or username
    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier }
                ]
            }
        });

        if (!user) {
            res.status(400).json({ error: 'User not found' });
            return;
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            res.status(400).json({ error: 'Invalid password' });
            return;
        }

        const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, userId: user.id, username: user.username, profilePicture: user.profilePicture });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

export default router;
