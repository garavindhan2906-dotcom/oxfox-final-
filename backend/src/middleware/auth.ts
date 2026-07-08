import { NextFunction, Request, Response } from 'express';
import { verifyAdminToken } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      admin?: { adminId: number; username: string };
    }
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const bearer = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : undefined;
  const token = req.cookies?.oxfox_admin_token ?? bearer;

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    req.admin = verifyAdminToken(token);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
}
