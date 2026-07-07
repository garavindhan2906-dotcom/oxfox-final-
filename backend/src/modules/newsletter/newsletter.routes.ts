import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../../config/db';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAdmin } from '../../middleware/auth';
import { rateLimit } from '../../middleware/rateLimit';

export const newsletterRouter = Router();

const signupSchema = z.object({
  email: z.string().email(),
  phone: z.string().max(15).optional(),
  source: z.string().max(50).optional(),
});

newsletterRouter.post(
  '/',
  rateLimit('newsletter-signup', 10, 10 * 60 * 1000),
  asyncHandler(async (req, res) => {
    const data = signupSchema.parse(req.body);
    await pool.query(
      `INSERT INTO newsletter_signups (email, phone, source) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE phone = COALESCE(VALUES(phone), phone)`,
      [data.email, data.phone ?? null, data.source ?? 'homepage_banner']
    );
    // Discount is honored manually by admin during order follow-up (no live payment gateway yet).
    res.status(201).json({ success: true, message: "You're on the list! Use your first order to claim 10% off." });
  })
);

newsletterRouter.get(
  '/admin/all',
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query<any[]>('SELECT * FROM newsletter_signups ORDER BY created_at DESC');
    res.json({ signups: rows });
  })
);
