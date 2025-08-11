import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export type JwtUser = { id: number; role: 'user' | 'admin'; email: string };

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export function signToken(user: JwtUser) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}

export function authMiddleware(req: Request & { user?: JwtUser }, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtUser;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

export function adminOnly(req: Request & { user?: JwtUser }, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  next();
}
