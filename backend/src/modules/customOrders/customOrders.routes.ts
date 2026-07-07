import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../../config/db';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAdmin } from '../../middleware/auth';
import { rateLimit } from '../../middleware/rateLimit';
import { referenceImageUpload, publicPathFor } from '../../uploads/multerConfig';

export const customOrdersRouter = Router();

const inquirySchema = z.object({
  name: z.string().min(1).max(150),
  phone: z.string().min(10).max(15),
  email: z.string().email().optional(),
  description: z.string().min(1).max(2000),
});

customOrdersRouter.post(
  '/',
  rateLimit('custom-order-inquiry', 10, 10 * 60 * 1000),
  referenceImageUpload.single('referenceImage'),
  asyncHandler(async (req, res) => {
    const data = inquirySchema.parse(req.body);
    const referenceImage = req.file ? publicPathFor(req.file.path) : null;

    await pool.query(
      'INSERT INTO custom_order_inquiries (name, phone, email, description, reference_image) VALUES (?, ?, ?, ?, ?)',
      [data.name, data.phone, data.email ?? null, data.description, referenceImage]
    );
    res.status(201).json({ success: true });
  })
);

customOrdersRouter.get(
  '/admin/all',
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query<any[]>('SELECT * FROM custom_order_inquiries ORDER BY created_at DESC');
    res.json({ inquiries: rows });
  })
);

const statusSchema = z.object({ status: z.enum(['new', 'in_discussion', 'quoted', 'closed']) });

customOrdersRouter.patch(
  '/admin/:id/status',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { status } = statusSchema.parse(req.body);
    await pool.query('UPDATE custom_order_inquiries SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true });
  })
);
