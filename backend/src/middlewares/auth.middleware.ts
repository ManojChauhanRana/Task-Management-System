import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: { userId: number };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyAccessToken(token) as { userId: number };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
