import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../../config/db';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAdmin } from '../../middleware/auth';
import { rateLimit } from '../../middleware/rateLimit';

export const bulkOrdersRouter = Router();

const inquirySchema = z.object({
  name: z.string().min(1).max(150),
  companyName: z.string().max(150).optional(),
  phone: z.string().min(10).max(15),
  email: z.string().email().optional(),
  categoryInterest: z.string().max(150).optional(),
  estimatedQty: z.string().max(50).optional(),
  message: z.string().max(2000).optional(),
});

bulkOrdersRouter.post(
  '/',
  rateLimit('bulk-order-inquiry', 10, 10 * 60 * 1000),
  asyncHandler(async (req, res) => {
    const data = inquirySchema.parse(req.body);
    await pool.query(
      `INSERT INTO bulk_order_inquiries (name, company_name, phone, email, category_interest, estimated_qty, message)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.companyName ?? null,
        data.phone,
        data.email ?? null,
        data.categoryInterest ?? null,
        data.estimatedQty ?? null,
        data.message ?? null,
      ]
    );
    res.status(201).json({ success: true });
  })
);

bulkOrdersRouter.get(
  '/admin/all',
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query<any[]>('SELECT * FROM bulk_order_inquiries ORDER BY created_at DESC');
    res.json({ inquiries: rows });
  })
);

const statusSchema = z.object({ status: z.enum(['new', 'contacted', 'closed']) });

bulkOrdersRouter.patch(
  '/admin/:id/status',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { status } = statusSchema.parse(req.body);
    await pool.query('UPDATE bulk_order_inquiries SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true });
  })
);
