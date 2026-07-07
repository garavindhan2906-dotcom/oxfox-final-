import { pool } from '../config/db';
import { createProduct } from '../modules/products/products.service';

/**
 * Per the client's original spec, every item listed under a category heading
 * (e.g. "Alphabet Molds" under "Chocolates") is a product, not a sub-taxonomy label.
 * These names match the subcategories seeded in seed.ts, so each product is linked
 * to the subcategory of the same name for filtering.
 */
const CATEGORY_PRODUCTS: Record<string, string[]> = {
  'Candles/Resin/Soap': [
    'Festive/Holiday Molds',
    'Flower Molds',
    'Teddy Bear Molds',
    'Birds & Animal Molds',
    'Foliage Molds',
    'Ornamental Patterns Molds',
    'Taper Candle Molds',
    'Pillar Candle Molds',
    'Alphabet Molds',
    'Number Molds',
  ],
  'Concrete/Jesmonite/Eco Resin': [
    'Festive/Holiday Molds',
    'Candle Jar Molds',
    'Candle Holder Molds',
    'Bowl Molds',
    'Tray Molds',
    'Plant Pots Molds',
    'Incense Holder Molds',
    'Diffuser Molds',
    'Ornamental Novelty Molds',
    'Coaster Molds',
    'Lamp Base Molds',
    'Clock Molds',
    'Tealight Holder Molds',
    'All Concrete/Jesmonite Molds',
    'Office Accessory Molds',
    'Vase Molds',
    'Rangoli Pattern Molds',
  ],
  Chocolates: [
    'Festive/Holiday Molds',
    'Flower Molds',
    'Teddy Bear Molds',
    'Birds & Animal Molds',
    'Foliage Molds',
    'Ornamental Patterns Molds',
    'Slab Molds',
    'Alphabet Molds',
    'Number Molds',
  ],
  'Festive/Holiday': [
    "Makar Sankranti/Lohri",
    'Valentines Day',
    'Holi',
    'Ramadan',
    "Mother's Day",
    'Rakhi',
    "Father's Day",
    "Teacher's Day",
    'Ganesh Chaturthi',
    'Diwali',
    'Christmas',
    "New Year's Day",
  ],
};

async function seedProducts() {
  let created = 0;
  let skipped = 0;

  for (const [categoryName, productNames] of Object.entries(CATEGORY_PRODUCTS)) {
    const [categoryRows] = await pool.query<any[]>('SELECT id FROM categories WHERE name = ?', [categoryName]);
    if (categoryRows.length === 0) {
      console.warn(`Category "${categoryName}" not found — run "npm run seed" first. Skipping.`);
      continue;
    }
    const categoryId = categoryRows[0].id;

    for (const productName of productNames) {
      const [existing] = await pool.query<any[]>('SELECT id FROM products WHERE name = ? AND category_id = ?', [
        productName,
        categoryId,
      ]);
      if (existing.length > 0) {
        skipped += 1;
        continue;
      }

      const [subRows] = await pool.query<any[]>(
        'SELECT id FROM subcategories WHERE category_id = ? AND name = ?',
        [categoryId, productName]
      );
      const subcategoryId = subRows.length > 0 ? subRows[0].id : null;

      await createProduct({
        categoryId,
        subcategoryId,
        name: productName,
        price: null,
        isNew: true,
        isActive: true,
      });
      created += 1;
    }
  }

  console.log(`Seed products complete: ${created} created, ${skipped} already existed.`);
  await pool.end();
}

seedProducts().catch((err) => {
  console.error('Seed products failed:', err);
  process.exit(1);
});
