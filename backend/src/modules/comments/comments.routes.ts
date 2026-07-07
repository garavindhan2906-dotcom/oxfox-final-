import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../../config/db';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAdmin } from '../../middleware/auth';
import { rateLimit } from '../../middleware/rateLimit';
import { ApiError } from '../../middleware/errorHandler';

export const commentsRouter = Router();

commentsRouter.get(
  '/products/:productId/comments',
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query<any[]>(
      'SELECT id, name, rating, comment_text, created_at FROM product_comments WHERE product_id = ? AND is_visible = TRUE ORDER BY created_at DESC',
      [req.params.productId]
    );
    res.json({ comments: rows });
  })
);

const createCommentSchema = z.object({
  name: z.string().min(1).max(100),
  rating: z.number().min(1).max(5).optional(),
  commentText: z.string().min(1).max(2000),
  // honeypot field: real users never fill this in; bots often do
  website: z.string().max(0).optional(),
});

commentsRouter.post(
  '/products/:productId/comments',
  rateLimit('post-comment', 10, 10 * 60 * 1000),
  asyncHandler(async (req, res) => {
    const data = createCommentSchema.parse(req.body);
    if (data.website) {
      // Silently succeed for bots without writing to DB.
      return res.status(201).json({ success: true });
    }

    const [productRows] = await pool.query<any[]>('SELECT id FROM products WHERE id = ?', [req.params.productId]);
    if (productRows.length === 0) throw new ApiError(404, 'Product not found');

    await pool.query(
      'INSERT INTO product_comments (product_id, name, rating, comment_text, ip_address) VALUES (?, ?, ?, ?, ?)',
      [req.params.productId, data.name, data.rating ?? null, data.commentText, req.ip ?? null]
    );
    res.status(201).json({ success: true });
  })
);

commentsRouter.get(
  '/admin/comments',
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query<any[]>(
      `SELECT pc.*, p.name AS product_name, p.slug AS product_slug
       FROM product_comments pc JOIN products p ON p.id = pc.product_id
       ORDER BY pc.created_at DESC`
    );
    res.json({ comments: rows });
  })
);

commentsRouter.delete(
  '/admin/comments/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    await pool.query('DELETE FROM product_comments WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  })
);
