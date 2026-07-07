import { Router } from 'express';
import { pool } from '../../config/db';
import { asyncHandler } from '../../utils/asyncHandler';

export const searchRouter = Router();

searchRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const q = String(req.query.q ?? '').trim();
    if (!q) return res.json({ products: [], categories: [] });

    const [products] = await pool.query<any[]>(
      `SELECT p.id, p.name, p.slug, p.price,
              (SELECT file_path FROM product_images pi WHERE pi.product_id = p.id
                ORDER BY pi.is_primary DESC, pi.sort_order ASC LIMIT 1) AS primary_image
       FROM products p
       WHERE p.is_active = TRUE
         AND (MATCH(p.name, p.description) AGAINST (? IN NATURAL LANGUAGE MODE) OR p.name LIKE ?)
       LIMIT 30`,
      [q, `%${q}%`]
    );

    const [categories] = await pool.query<any[]>(
      `SELECT c.id, c.name, c.slug FROM categories c WHERE c.is_active = TRUE AND c.name LIKE ?
       UNION
       SELECT sc.id, sc.name, sc.slug FROM subcategories sc WHERE sc.is_active = TRUE AND sc.name LIKE ?
       LIMIT 10`,
      [`%${q}%`, `%${q}%`]
    );

    res.json({ products, categories });
  })
);
