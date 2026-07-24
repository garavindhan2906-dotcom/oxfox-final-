import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../../config/db';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAdmin } from '../../middleware/auth';
import { contentImageUpload, publicPathFor, deleteUploadedFile } from '../../uploads/multerConfig';

export const shippingRouter = Router();

// Public: get text info + all images
shippingRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const [info] = await pool.query<any[]>('SELECT * FROM shipping_info WHERE id = 1');
    const [images] = await pool.query<any[]>('SELECT * FROM shipping_images ORDER BY sort_order ASC, created_at ASC');
    res.json({ shipping: info[0] ?? null, images });
  })
);

const textSchema = z.object({
  title: z.string().max(200).optional(),
  description: z.string().optional(),
});

shippingRouter.put(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const data = textSchema.parse(req.body);
    await pool.query(
      'UPDATE shipping_info SET title = ?, description = ? WHERE id = 1',
      [data.title ?? null, data.description ?? null]
    );
    res.json({ success: true });
  })
);

// Upload multiple images
shippingRouter.post(
  '/images',
  requireAdmin,
  contentImageUpload.array('images', 20),
  asyncHandler(async (req, res) => {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) throw new Error('No images uploaded');
    const ids: number[] = [];
    for (const file of files) {
      const imageUrl = publicPathFor(file.path);
      const [result] = await pool.query<any>(
        'INSERT INTO shipping_images (image_url) VALUES (?)',
        [imageUrl]
      );
      ids.push(result.insertId);
    }
    res.json({ success: true, count: ids.length });
  })
);

// Delete a single shipping image
shippingRouter.delete(
  '/images/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query<any[]>('SELECT image_url FROM shipping_images WHERE id = ?', [req.params.id]);
    if (rows.length > 0) deleteUploadedFile(rows[0].image_url);
    await pool.query('DELETE FROM shipping_images WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  })
);
