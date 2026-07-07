import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAdmin } from '../../middleware/auth';
import { rateLimit } from '../../middleware/rateLimit';
import { requestOtpHandler, verifyOtpHandler, logoutHandler, meHandler } from './auth.controller';

export const authRouter = Router();

authRouter.post('/otp/request', rateLimit('otp-request', 5, 10 * 60 * 1000), asyncHandler(requestOtpHandler));
authRouter.post('/otp/verify', rateLimit('otp-verify', 10, 10 * 60 * 1000), asyncHandler(verifyOtpHandler));
authRouter.post('/logout', asyncHandler(logoutHandler));
authRouter.get('/me', requireAdmin, asyncHandler(meHandler));
