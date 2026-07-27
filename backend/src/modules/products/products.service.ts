import { pool } from '../../config/db';
import { slugify } from '../../utils/slugify';
import { ApiError } from '../../middleware/errorHandler';

export interface ProductFilters {
  categorySlug?: string;
  subcategorySlug?: string;
  sort?: 'new' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
  onlyActive?: boolean;
}

export async function listProducts(filters: ProductFilters) {
  const page = filters.page ?? 1;
  const limit = Math.min(filters.limit ?? 24, 100);
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters.onlyActive !== false) {
    conditions.push('p.is_active = TRUE');
  }
  if (filters.categorySlug) {
    conditions.push('c.slug = ?');
    params.push(filters.categorySlug);
  }
  if (filters.subcategorySlug) {
    conditions.push('sc.slug = ?');
    params.push(filters.subcategorySlug);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  let orderClause = 'ORDER BY p.created_at DESC';
  if (filters.sort === 'price_asc') orderClause = 'ORDER BY p.price ASC';
  if (filters.sort === 'price_desc') orderClause = 'ORDER BY p.price DESC';
  if (filters.sort === 'new') orderClause = 'ORDER BY p.is_new DESC, p.created_at DESC';

  const [rows] = await pool.query<any[]>(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug,
            sc.name AS subcategory_name, sc.slug AS subcategory_slug,
            (SELECT file_path FROM product_images pi WHERE pi.product_id = p.id
              ORDER BY pi.is_primary DESC, pi.sort_order ASC LIMIT 1) AS primary_image
     FROM products p
     JOIN categories c ON c.id = p.category_id
     LEFT JOIN subcategories sc ON sc.id = p.subcategory_id
     ${whereClause}
     ${orderClause}
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [countRows] = await pool.query<any[]>(
    `SELECT COUNT(*) as total
     FROM products p
     JOIN categories c ON c.id = p.category_id
     LEFT JOIN subcategories sc ON sc.id = p.subcategory_id
     ${whereClause}`,
    params
  );

  return { products: rows, total: countRows[0].total, page, limit };
}

export async function getProductBySlug(slug: string) {
  const [rows] = await pool.query<any[]>(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug,
            sc.name AS subcategory_name, sc.slug AS subcategory_slug
     FROM products p
     JOIN categories c ON c.id = p.category_id
     LEFT JOIN subcategories sc ON sc.id = p.subcategory_id
     WHERE p.slug = ? AND p.is_active = TRUE`,
    [slug]
  );
  if (rows.length === 0) throw new ApiError(404, 'Product not found');

  const [images] = await pool.query<any[]>(
    'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC',
    [rows[0].id]
  );
  const [discountTiers] = await pool.query<any[]>(
    'SELECT id, min_qty, discount_percent FROM product_discount_tiers WHERE product_id = ? ORDER BY sort_order ASC',
    [rows[0].id]
  );

  return { ...rows[0], images, discountTiers };
}

export async function getProductByIdForAdmin(id: number) {
  const [rows] = await pool.query<any[]>('SELECT * FROM products WHERE id = ?', [id]);
  if (rows.length === 0) throw new ApiError(404, 'Product not found');

  const [images] = await pool.query<any[]>(
    'SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC',
    [id]
  );
  const [discountTiers] = await pool.query<any[]>(
    'SELECT id, min_qty, discount_percent FROM product_discount_tiers WHERE product_id = ? ORDER BY sort_order ASC',
    [id]
  );
  const [catRows] = await pool.query<any[]>(
    'SELECT category_id FROM product_categories WHERE product_id = ?',
    [id]
  );
  const categoryIds = catRows.length > 0
    ? catRows.map((r: any) => r.category_id)
    : [rows[0].category_id];

  return { ...rows[0], categoryIds, images, discountTiers };
}

export interface DiscountTierInput {
  minQty: number;
  discountPercent: number;
}

export async function replaceDiscountTiers(productId: number, tiers: DiscountTierInput[]) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM product_discount_tiers WHERE product_id = ?', [productId]);
    for (let i = 0; i < tiers.length; i++) {
      await conn.query(
        'INSERT INTO product_discount_tiers (product_id, min_qty, discount_percent, sort_order) VALUES (?, ?, ?, ?)',
        [productId, tiers[i].minQty, tiers[i].discountPercent, i]
      );
    }
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export type ProductBadge = 'none' | 'new' | 'bestseller' | 'sale' | 'limited';

export interface ProductInput {
  categoryId: number;
  categoryIds?: number[];
  subcategoryId?: number | null;
  name: string;
  description?: string;
  material?: string;
  dimensions?: string;
  price?: number | null;
  mrp?: number | null;
  badge?: ProductBadge;
  filterTag?: string | null;
  emojiIcon?: string | null;
  isNew?: boolean;
  isActive?: boolean;
  inStock?: boolean;
  stockQty?: number | null;
  metaTitle?: string;
  metaDescription?: string;
}

async function generateUniqueSlug(name: string, excludeId?: number): Promise<string> {
  const base = slugify(name);
  let candidate = base;
  let suffix = 1;

  while (true) {
    const [rows] = await pool.query<any[]>(
      excludeId ? 'SELECT id FROM products WHERE slug = ? AND id != ?' : 'SELECT id FROM products WHERE slug = ?',
      excludeId ? [candidate, excludeId] : [candidate]
    );
    if (rows.length === 0) return candidate;
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
}

export async function createProduct(data: ProductInput) {
  const slug = await generateUniqueSlug(data.name);
  const [result] = await pool.query<any>(
    `INSERT INTO products
      (category_id, subcategory_id, name, slug, description, material, dimensions, price, mrp,
       badge, filter_tag, emoji_icon, is_new, is_active, in_stock, stock_qty, meta_title, meta_description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.categoryId,
      data.subcategoryId ?? null,
      data.name,
      slug,
      data.description ?? null,
      data.material ?? 'Food-grade Silicone',
      data.dimensions ?? null,
      data.price ?? null,
      data.mrp ?? null,
      data.badge ?? 'none',
      data.filterTag ?? null,
      data.emojiIcon ?? null,
      data.isNew ?? true,
      data.isActive ?? true,
      data.inStock ?? true,
      data.stockQty ?? null,
      data.metaTitle ?? null,
      data.metaDescription ?? null,
    ]
  );
  const productId = result.insertId;
  const idsToLink = data.categoryIds && data.categoryIds.length > 0 ? data.categoryIds : [data.categoryId];
  for (const catId of idsToLink) {
    await pool.query(
      'INSERT IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)',
      [productId, catId]
    );
  }
  return { id: productId, slug };
}

export async function updateProduct(id: number, data: Partial<ProductInput>) {
  const fields: string[] = [];
  const values: unknown[] = [];

  const columnMap: Record<string, string> = {
    categoryId: 'category_id',
    subcategoryId: 'subcategory_id',
    description: 'description',
    material: 'material',
    dimensions: 'dimensions',
    price: 'price',
    mrp: 'mrp',
    badge: 'badge',
    filterTag: 'filter_tag',
    emojiIcon: 'emoji_icon',
    isNew: 'is_new',
    isActive: 'is_active',
    inStock: 'in_stock',
    stockQty: 'stock_qty',
    metaTitle: 'meta_title',
    metaDescription: 'meta_description',
  };

  if (data.name !== undefined) {
    fields.push('name = ?', 'slug = ?');
    values.push(data.name, await generateUniqueSlug(data.name, id));
  }

  for (const [key, column] of Object.entries(columnMap)) {
    const value = (data as Record<string, unknown>)[key];
    if (value !== undefined) {
      fields.push(`${column} = ?`);
      values.push(value);
    }
  }

  if (fields.length > 0) {
    values.push(id);
    await pool.query(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);
  }

  if (data.categoryIds && data.categoryIds.length > 0) {
    await pool.query('DELETE FROM product_categories WHERE product_id = ?', [id]);
    for (const catId of data.categoryIds) {
      await pool.query(
        'INSERT IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)',
        [id, catId]
      );
    }
  }
}

export async function setProductActive(id: number, isActive: boolean) {
  await pool.query('UPDATE products SET is_active = ? WHERE id = ?', [isActive, id]);
}

export async function deleteProduct(id: number): Promise<string[]> {
  const [images] = await pool.query<any[]>('SELECT file_path FROM product_images WHERE product_id = ?', [id]);
  await pool.query('DELETE FROM products WHERE id = ?', [id]);
  return images.map((img) => img.file_path);
}

export async function uploadProductVideo(id: number, videoUrl: string) {
  const [rows] = await pool.query<any[]>('SELECT video_url FROM products WHERE id = ?', [id]);
  if (rows.length === 0) throw new ApiError(404, 'Product not found');
  const oldUrl: string | null = rows[0].video_url;
  await pool.query('UPDATE products SET video_url = ? WHERE id = ?', [videoUrl, id]);
  return { oldUrl };
}

export async function deleteProductVideo(id: number) {
  const [rows] = await pool.query<any[]>('SELECT video_url FROM products WHERE id = ?', [id]);
  if (rows.length === 0) throw new ApiError(404, 'Product not found');
  const oldUrl: string | null = rows[0].video_url;
  if (!oldUrl) throw new ApiError(404, 'No video to delete');
  await pool.query('UPDATE products SET video_url = NULL WHERE id = ?', [id]);
  return { oldUrl };
}

export async function listProductsAdmin(page = 1, limit = 50) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query<any[]>(
    `SELECT p.*, c.name AS category_name
     FROM products p JOIN categories c ON c.id = p.category_id
     ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  const [countRows] = await pool.query<any[]>('SELECT COUNT(*) as total FROM products');
  return { products: rows, total: countRows[0].total, page, limit };
}
