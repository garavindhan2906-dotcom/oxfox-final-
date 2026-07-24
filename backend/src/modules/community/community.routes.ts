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

// Single upload (kept for backwards compat)
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

// Bulk upload — POST /api/community/admin/bulk (multipart images[])
communityRouter.post(
  '/admin/bulk',
  requireAdmin,
  contentImageUpload.array('images', 20),
  asyncHandler(async (req, res) => {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) throw new ApiError(400, 'At least one image is required.');
    const ids: number[] = [];
    for (const file of files) {
      const imagePath = publicPathFor(file.path);
      const [result] = await pool.query<any>(
        'INSERT INTO community_posts (image_path, sort_order) VALUES (?, 0)',
        [imagePath]
      );
      ids.push(result.insertId);
    }
    res.status(201).json({ count: ids.length, ids });
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
