import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../../config/db';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAdmin } from '../../middleware/auth';
import { contentImageUpload, publicPathFor, deleteUploadedFile } from '../../uploads/multerConfig';
import { ApiError } from '../../middleware/errorHandler';

export const communityRouter = Router();

communityRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query<any[]>(
      'SELECT * FROM community_posts WHERE is_active = TRUE ORDER BY sort_order ASC, created_at DESC'
    );
    res.json({ posts: rows });
  })
);

const postSchema = z.object({
  title: z.string().max(200).optional(),
  caption: z.string().optional(),
  customerName: z.string().max(150).optional(),
  sortOrder: z.coerce.number().optional(),
});

communityRouter.post(
  '/admin',
  requireAdmin,
  contentImageUpload.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, 'An image is required.');
    const data = postSchema.parse(req.body);
    const imagePath = publicPathFor(req.file.path);

    const [result] = await pool.query<any>(
      'INSERT INTO community_posts (title, image_path, caption, customer_name, sort_order) VALUES (?, ?, ?, ?, ?)',
      [data.title ?? null, imagePath, data.caption ?? null, data.customerName ?? null, data.sortOrder ?? 0]
    );
    res.status(201).json({ id: result.insertId });
  })
);

communityRouter.get(
  '/admin/all',
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query<any[]>('SELECT * FROM community_posts ORDER BY sort_order ASC, created_at DESC');
    res.json({ posts: rows });
  })
);

communityRouter.delete(
  '/admin/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query<any[]>('SELECT image_path FROM community_posts WHERE id = ?', [req.params.id]);
    if (rows.length > 0) deleteUploadedFile(rows[0].image_path);
    await pool.query('DELETE FROM community_posts WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  })
);
