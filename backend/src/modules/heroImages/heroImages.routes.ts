import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../../config/db';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAdmin } from '../../middleware/auth';
import { contentImageUpload, publicPathFor, deleteUploadedFile } from '../../uploads/multerConfig';
import { ApiError } from '../../middleware/errorHandler';

export const heroImagesRouter = Router();

heroImagesRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query<any[]>(
      'SELECT * FROM hero_images ORDER BY sort_order ASC, created_at ASC'
    );
    res.json({ images: rows });
  })
);

heroImagesRouter.get(
  '/admin/all',
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query<any[]>(
      'SELECT * FROM hero_images ORDER BY sort_order ASC, created_at ASC'
    );
    res.json({ images: rows });
  })
);

heroImagesRouter.post(
  '/admin',
  requireAdmin,
  contentImageUpload.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, 'An image is required.');
    const imageUrl = publicPathFor(req.file.path);
    const [result] = await pool.query<any>(
      'INSERT INTO hero_images (image_url, sort_order) VALUES (?, 0)',
      [imageUrl]
    );
    res.status(201).json({ id: result.insertId });
  })
);

heroImagesRouter.patch(
  '/admin/:id/order',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { sortOrder } = z.object({ sortOrder: z.number().int() }).parse(req.body);
    await pool.query('UPDATE hero_images SET sort_order = ? WHERE id = ?', [sortOrder, req.params.id]);
    res.json({ success: true });
  })
);

heroImagesRouter.delete(
  '/admin/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query<any[]>('SELECT image_url FROM hero_images WHERE id = ?', [req.params.id]);
    if (rows.length > 0) deleteUploadedFile(rows[0].image_url);
    await pool.query('DELETE FROM hero_images WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  })
);
