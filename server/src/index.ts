import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import movieRoutes from './routes/movies';
import recommendRoutes from './routes/recommend';
import interactionRoutes from './routes/interactions';
import userRoutes from './routes/user';
import adminRoutes from './routes/admin';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve Uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/recommend', recommendRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('Seeker API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
