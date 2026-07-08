import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAdmin } from '../../middleware/auth';
import { rateLimit } from '../../middleware/rateLimit';
import { loginHandler, logoutHandler, meHandler } from './auth.controller';

export const authRouter = Router();

authRouter.post('/login', rateLimit('admin-login', 10, 10 * 60 * 1000), asyncHandler(loginHandler));
authRouter.post('/logout', asyncHandler(logoutHandler));
authRouter.get('/me', requireAdmin, asyncHandler(meHandler));
