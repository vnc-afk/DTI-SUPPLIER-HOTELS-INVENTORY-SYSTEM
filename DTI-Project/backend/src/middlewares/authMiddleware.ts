import { Request, Response, NextFunction } from 'express';
import { extractToken, verifyToken, JWTPayload } from '../utils/auth';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Middleware to verify JWT token and populate req.user
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = extractToken(req.headers.authorization);

  if (!token) {
    res.status(401).json({ error: 'Unauthorized: Missing token' });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
    return;
  }

  req.user = payload;
  next();
}

/**
 * Middleware to check if user has required roles
 */
export function roleMiddleware(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      return;
    }

    next();
  };
}
