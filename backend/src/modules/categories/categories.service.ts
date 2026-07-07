import { pool } from '../../config/db';
import { slugify } from '../../utils/slugify';
import { ApiError } from '../../middleware/errorHandler';
import { deleteUploadedFile, publicPathFor } from '../../uploads/multerConfig';

export async function listCategories(includeInactive = false) {
  const where = includeInactive ? '' : 'WHERE c.is_active = TRUE';
  const productActiveClause = includeInactive ? '' : 'AND p.is_active = TRUE';
  const [categories] = await pool.query<any[]>(
    `SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id ${productActiveClause}) AS product_count
     FROM categories c ${where}
     ORDER BY c.sort_order ASC, c.name ASC`
  );

  const [subcategories] = await pool.query<any[]>(
    `SELECT * FROM subcategories ${includeInactive ? '' : 'WHERE is_active = TRUE'} ORDER BY sort_order ASC, name ASC`
  );

  return categories.map((cat) => ({
    ...cat,
    subcategories: subcategories.filter((sub) => sub.category_id === cat.id),
  }));
}

export async function getCategoryBySlug(slug: string) {
  const [rows] = await pool.query<any[]>('SELECT * FROM categories WHERE slug = ? AND is_active = TRUE', [slug]);
  if (rows.length === 0) throw new ApiError(404, 'Category not found');

  const [subcategories] = await pool.query<any[]>(
    'SELECT * FROM subcategories WHERE category_id = ? AND is_active = TRUE ORDER BY sort_order ASC',
    [rows[0].id]
  );

  return { ...rows[0], subcategories };
}

export async function getSubcategoryBySlug(categorySlug: string, subSlug: string) {
  const category = await getCategoryBySlug(categorySlug);
  const [rows] = await pool.query<any[]>(
    'SELECT * FROM subcategories WHERE category_id = ? AND slug = ? AND is_active = TRUE',
    [category.id, subSlug]
  );
  if (rows.length === 0) throw new ApiError(404, 'Subcategory not found');
  return { ...rows[0], category };
}

export async function createCategory(data: {
  name: string;
  description?: string;
  bannerImage?: string;
  emoji?: string;
  sortOrder?: number;
}) {
  const slug = slugify(data.name);
  const [result] = await pool.query<any>(
    'INSERT INTO categories (name, slug, description, banner_image, emoji, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
    [data.name, slug, data.description ?? null, data.bannerImage ?? null, data.emoji ?? null, data.sortOrder ?? 0]
  );
  return { id: result.insertId, slug };
}

export async function updateCategory(
  id: number,
  data: Partial<{
    name: string;
    description: string;
    bannerImage: string;
    emoji: string;
    sortOrder: number;
    isActive: boolean;
  }>
) {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.name !== undefined) {
    fields.push('name = ?', 'slug = ?');
    values.push(data.name, slugify(data.name));
  }
  if (data.description !== undefined) {
    fields.push('description = ?');
    values.push(data.description);
  }
  if (data.bannerImage !== undefined) {
    fields.push('banner_image = ?');
    values.push(data.bannerImage);
  }
  if (data.emoji !== undefined) {
    fields.push('emoji = ?');
    values.push(data.emoji);
  }
  if (data.sortOrder !== undefined) {
    fields.push('sort_order = ?');
    values.push(data.sortOrder);
  }
  if (data.isActive !== undefined) {
    fields.push('is_active = ?');
    values.push(data.isActive);
  }

  if (fields.length === 0) return;

  values.push(id);
  await pool.query(`UPDATE categories SET ${fields.join(', ')} WHERE id = ?`, values);
}

export async function setCategoryBanner(id: number, source: { file?: Express.Multer.File; url?: string }) {
  if (!source.file && !source.url) {
    throw new ApiError(400, 'Provide either an image file or an image URL.');
  }

  const [rows] = await pool.query<any[]>('SELECT banner_image FROM categories WHERE id = ?', [id]);
  if (rows.length === 0) throw new ApiError(404, 'Category not found');

  const previousBanner = rows[0].banner_image as string | null;
  const bannerImage = source.file ? publicPathFor(source.file.path) : (source.url as string);

  await pool.query('UPDATE categories SET banner_image = ? WHERE id = ?', [bannerImage, id]);

  if (previousBanner && previousBanner.startsWith('/uploads/')) {
    deleteUploadedFile(previousBanner);
  }

  return { bannerImage };
}

export async function deleteCategory(id: number) {
  const [productRows] = await pool.query<any[]>('SELECT COUNT(*) as count FROM products WHERE category_id = ?', [
    id,
  ]);
  if (productRows[0].count > 0) {
    throw new ApiError(400, 'Cannot delete a category that still has products. Move or delete its products first.');
  }
  await pool.query('DELETE FROM categories WHERE id = ?', [id]);
}

export async function createSubcategory(categoryId: number, name: string, sortOrder = 0) {
  const slug = slugify(name);
  const [result] = await pool.query<any>(
    'INSERT INTO subcategories (category_id, name, slug, sort_order) VALUES (?, ?, ?, ?)',
    [categoryId, name, slug, sortOrder]
  );
  return { id: result.insertId, slug };
}

export async function updateSubcategory(
  id: number,
  data: Partial<{ name: string; sortOrder: number; isActive: boolean }>
) {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.name !== undefined) {
    fields.push('name = ?', 'slug = ?');
    values.push(data.name, slugify(data.name));
  }
  if (data.sortOrder !== undefined) {
    fields.push('sort_order = ?');
    values.push(data.sortOrder);
  }
  if (data.isActive !== undefined) {
    fields.push('is_active = ?');
    values.push(data.isActive);
  }

  if (fields.length === 0) return;

  values.push(id);
  await pool.query(`UPDATE subcategories SET ${fields.join(', ')} WHERE id = ?`, values);
}

export async function deleteSubcategory(id: number) {
  await pool.query('UPDATE products SET subcategory_id = NULL WHERE subcategory_id = ?', [id]);
  await pool.query('DELETE FROM subcategories WHERE id = ?', [id]);
}
