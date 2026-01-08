
import path from 'path';
import dotenv from 'dotenv';
// Load env relative to this script
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { calculateScores } from '../services/scheduler';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const run = async () => {
    console.log("Running Scoring Script...");
    await calculateScores();
    console.log("Scoring Script Completed.");
    await prisma.$disconnect();
};

run();
