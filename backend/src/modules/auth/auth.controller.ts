import { Request, Response } from 'express';
import { z } from 'zod';
import { loginAdmin } from './auth.service';
import { env } from '../../config/env';

const COOKIE_NAME = 'oxfox_admin_token';
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const loginSchema = z.object({ username: z.string().min(1), password: z.string().min(1) });

export async function loginHandler(req: Request, res: Response) {
  const { username, password } = loginSchema.parse(req.body);
  const token = await loginAdmin(username, password);

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE_MS,
  });
  res.json({ success: true });
}

export async function logoutHandler(_req: Request, res: Response) {
  res.clearCookie(COOKIE_NAME);
  res.json({ success: true });
}

export async function meHandler(req: Request, res: Response) {
  res.json({ admin: req.admin });
}
