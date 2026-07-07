import { pool } from '../../config/db';
import { ApiError } from '../../middleware/errorHandler';
import { MAX_IMAGES_PER_PRODUCT, publicPathFor, deleteUploadedFile } from '../../uploads/multerConfig';

export async function addImages(productId: number, files: Express.Multer.File[]) {
  const [countRows] = await pool.query<any[]>(
    'SELECT COUNT(*) as count FROM product_images WHERE product_id = ?',
    [productId]
  );
  const existingCount = countRows[0].count;

  if (existingCount + files.length > MAX_IMAGES_PER_PRODUCT) {
    files.forEach((f) => deleteUploadedFile(publicPathFor(f.path)));
    throw new ApiError(
      400,
      `This product already has ${existingCount} image(s). You can add at most ${MAX_IMAGES_PER_PRODUCT - existingCount} more.`
    );
  }

  const [maxSortRows] = await pool.query<any[]>(
    'SELECT COALESCE(MAX(sort_order), -1) as maxSort FROM product_images WHERE product_id = ?',
    [productId]
  );
  let nextSort = maxSortRows[0].maxSort + 1;

  const isFirstBatch = existingCount === 0;

  const inserted = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const relativePath = publicPathFor(file.path);
    const isPrimary = isFirstBatch && i === 0;
    const [result] = await pool.query<any>(
      'INSERT INTO product_images (product_id, file_path, file_size, sort_order, is_primary) VALUES (?, ?, ?, ?, ?)',
      [productId, relativePath, file.size, nextSort, isPrimary]
    );
    inserted.push({ id: result.insertId, filePath: relativePath, sortOrder: nextSort, isPrimary });
    nextSort += 1;
  }

  return inserted;
}

export async function deleteImage(productId: number, imageId: number) {
  const [rows] = await pool.query<any[]>('SELECT file_path FROM product_images WHERE id = ? AND product_id = ?', [
    imageId,
    productId,
  ]);
  if (rows.length === 0) throw new ApiError(404, 'Image not found');

  await pool.query('DELETE FROM product_images WHERE id = ?', [imageId]);
  deleteUploadedFile(rows[0].file_path);
}

export async function setPrimaryImage(productId: number, imageId: number) {
  await pool.query('UPDATE product_images SET is_primary = FALSE WHERE product_id = ?', [productId]);
  await pool.query('UPDATE product_images SET is_primary = TRUE WHERE id = ? AND product_id = ?', [
    imageId,
    productId,
  ]);
}

export async function reorderImages(productId: number, orderedImageIds: number[]) {
  for (let i = 0; i < orderedImageIds.length; i++) {
    await pool.query('UPDATE product_images SET sort_order = ? WHERE id = ? AND product_id = ?', [
      i,
      orderedImageIds[i],
      productId,
    ]);
  }
}

/** Fixed-slot model (0-based, 0..MAX_IMAGES_PER_PRODUCT-1) used by the admin "Image 1..6" form.
 * Replaces whatever currently occupies that slot with either an uploaded file or a pasted URL. */
export async function setSlotImage(
  productId: number,
  slotIndex: number,
  source: { file?: Express.Multer.File; url?: string }
) {
  if (slotIndex < 0 || slotIndex >= MAX_IMAGES_PER_PRODUCT) {
    throw new ApiError(400, `Image slot must be between 1 and ${MAX_IMAGES_PER_PRODUCT}.`);
  }
  if (!source.file && !source.url) {
    throw new ApiError(400, 'Provide either an image file or an image URL.');
  }

  const [existingRows] = await pool.query<any[]>(
    'SELECT id, file_path FROM product_images WHERE product_id = ? AND sort_order = ?',
    [productId, slotIndex]
  );
  if (existingRows.length > 0) {
    await pool.query('DELETE FROM product_images WHERE id = ?', [existingRows[0].id]);
    deleteUploadedFile(existingRows[0].file_path);
  }

  const filePath = source.file ? publicPathFor(source.file.path) : (source.url as string);
  const fileSize = source.file ? source.file.size : 0;
  const isPrimary = slotIndex === 0;

  const [result] = await pool.query<any>(
    'INSERT INTO product_images (product_id, file_path, file_size, sort_order, is_primary) VALUES (?, ?, ?, ?, ?)',
    [productId, filePath, fileSize, slotIndex, isPrimary]
  );

  return { id: result.insertId, filePath, sortOrder: slotIndex, isPrimary };
}

export async function clearSlot(productId: number, slotIndex: number) {
  const [rows] = await pool.query<any[]>('SELECT id, file_path FROM product_images WHERE product_id = ? AND sort_order = ?', [
    productId,
    slotIndex,
  ]);
  if (rows.length === 0) return;
  await pool.query('DELETE FROM product_images WHERE id = ?', [rows[0].id]);
  deleteUploadedFile(rows[0].file_path);
}
