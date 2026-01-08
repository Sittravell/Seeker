import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        userId: number;
    };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.sendStatus(401);
        return
    }

    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err: any, user: any) => {
        if (err) {
            console.error('JWT Verification Error:', err.message);
            res.sendStatus(403);
            return;
        }
        req.user = user as { userId: number };
        next();
    });
};
