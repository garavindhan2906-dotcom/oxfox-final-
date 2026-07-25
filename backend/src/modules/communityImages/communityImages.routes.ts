import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../../config/db';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAdmin } from '../../middleware/auth';
import { contentImageUpload, publicPathFor, deleteUploadedFile } from '../../uploads/multerConfig';
import { ApiError } from '../../middleware/errorHandler';

export const communityImagesRouter = Router();

communityImagesRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query<any[]>(
      'SELECT * FROM community_images ORDER BY sort_order ASC, created_at DESC'
    );
    res.json({ images: rows });
  })
);

communityImagesRouter.get(
  '/admin/all',
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query<any[]>(
      'SELECT * FROM community_images ORDER BY sort_order ASC, created_at DESC'
    );
    res.json({ images: rows });
  })
);

communityImagesRouter.post(
  '/admin',
  requireAdmin,
  contentImageUpload.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, 'An image is required.');
    const caption = req.body.caption ?? null;
    const imageUrl = publicPathFor(req.file.path);
    const [result] = await pool.query<any>(
      'INSERT INTO community_images (image_url, caption, sort_order) VALUES (?, ?, 0)',
      [imageUrl, caption]
    );
    res.status(201).json({ id: result.insertId });
  })
);

communityImagesRouter.patch(
  '/admin/:id/order',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { sortOrder } = z.object({ sortOrder: z.number().int() }).parse(req.body);
    await pool.query('UPDATE community_images SET sort_order = ? WHERE id = ?', [sortOrder, req.params.id]);
    res.json({ success: true });
  })
);

communityImagesRouter.delete(
  '/admin/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query<any[]>('SELECT image_url FROM community_images WHERE id = ?', [req.params.id]);
    if (rows.length > 0) deleteUploadedFile(rows[0].image_url);
    await pool.query('DELETE FROM community_images WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  })
);
