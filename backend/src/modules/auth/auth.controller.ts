import { Request, Response } from 'express';
import { z } from 'zod';
import { requestOtp, verifyOtp } from './auth.service';
import { env } from '../../config/env';

const phoneSchema = z.object({ phone: z.string().min(10).max(15) });
const verifySchema = z.object({ phone: z.string().min(10).max(15), code: z.string().min(4).max(10) });

const COOKIE_NAME = 'oxfox_admin_token';
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export async function requestOtpHandler(req: Request, res: Response) {
  const { phone } = phoneSchema.parse(req.body);
  await requestOtp(phone);
  res.json({ success: true, message: 'OTP sent.' });
}

export async function verifyOtpHandler(req: Request, res: Response) {
  const { phone, code } = verifySchema.parse(req.body);
  const token = await verifyOtp(phone, code);

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE_MS,
  });
  res.json({ success: true, token });
}

export async function logoutHandler(_req: Request, res: Response) {
  res.clearCookie(COOKIE_NAME);
  res.json({ success: true });
}

export async function meHandler(req: Request, res: Response) {
  res.json({ admin: req.admin });
}
