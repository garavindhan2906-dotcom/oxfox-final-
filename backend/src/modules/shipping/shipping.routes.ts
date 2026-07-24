import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../../config/db';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAdmin } from '../../middleware/auth';
import { contentImageUpload, publicPathFor, deleteUploadedFile } from '../../uploads/multerConfig';

export const shippingRouter = Router();

shippingRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query<any[]>('SELECT * FROM shipping_info WHERE id = 1');
    res.json({ shipping: rows[0] ?? null });
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

shippingRouter.post(
  '/image',
  requireAdmin,
  contentImageUpload.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new Error('No image uploaded');
    const [rows] = await pool.query<any[]>('SELECT image_url FROM shipping_info WHERE id = 1');
    const oldUrl: string | null = rows[0]?.image_url ?? null;
    const imageUrl = publicPathFor(req.file.path);
    await pool.query('UPDATE shipping_info SET image_url = ? WHERE id = 1', [imageUrl]);
    if (oldUrl) deleteUploadedFile(oldUrl);
    res.json({ success: true, imageUrl });
  })
);

shippingRouter.delete(
  '/image',
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query<any[]>('SELECT image_url FROM shipping_info WHERE id = 1');
    const oldUrl: string | null = rows[0]?.image_url ?? null;
    if (oldUrl) deleteUploadedFile(oldUrl);
    await pool.query('UPDATE shipping_info SET image_url = NULL WHERE id = 1');
    res.json({ success: true });
  })
);
