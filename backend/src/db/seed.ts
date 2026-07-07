import { pool } from '../config/db';
import { slugify } from '../utils/slugify';
import { env } from '../config/env';

interface CategorySeed {
  name: string;
  description: string;
  subcategories: string[];
}

const CATEGORIES: CategorySeed[] = [
  {
    name: 'Candles/Resin/Soap',
    description: 'Silicone molds for candles, resin art, and soap making.',
    subcategories: [
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
  },
  {
    name: 'Concrete/Jesmonite/Eco Resin',
    description: 'Silicone molds for concrete, jesmonite, and eco resin home decor.',
    subcategories: [
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
  },
  {
    name: 'Chocolates',
    description: 'Silicone molds for artisan chocolate making.',
    subcategories: [
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
  },
  {
    name: 'Festive/Holiday',
    description: 'Silicone molds for every festival and holiday occasion.',
    subcategories: [
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
  },
];

const FAQ_SEED = [
  {
    question: 'What material are OXFOX molds made from?',
    answer:
      'All our molds are hand-poured using premium, food-grade silicone, suitable for chocolates, candles, soaps, resin, and concrete/jesmonite work.',
  },
  {
    question: 'Can I request a fully custom mold design?',
    answer:
      "Yes. Share your shape, size, and material on our Custom Order page — upload a sketch or reference photo, or just describe it, and our team will 3D-model, prototype, and hand-pour it for you.",
  },
  {
    question: 'Do you ship across India?',
    answer: 'Yes, we ship pan-India. Orders are securely packed after quality inspection before dispatch.',
  },
];

async function seed() {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query('INSERT IGNORE INTO admin_users (phone, name) VALUES (?, ?)', [
      env.adminPhone,
      'Admin',
    ]);

    for (let i = 0; i < CATEGORIES.length; i++) {
      const cat = CATEGORIES[i];
      const slug = slugify(cat.name);

      const [existingRows] = await conn.query<any[]>('SELECT id FROM categories WHERE slug = ?', [slug]);
      let categoryId: number;

      if (existingRows.length > 0) {
        categoryId = existingRows[0].id;
      } else {
        const [result] = await conn.query<any>(
          'INSERT INTO categories (name, slug, description, sort_order) VALUES (?, ?, ?, ?)',
          [cat.name, slug, cat.description, i]
        );
        categoryId = result.insertId;
      }

      for (let j = 0; j < cat.subcategories.length; j++) {
        const subName = cat.subcategories[j];
        const subSlug = slugify(subName);
        await conn.query(
          `INSERT INTO subcategories (category_id, name, slug, sort_order)
           VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE name = VALUES(name), sort_order = VALUES(sort_order)`,
          [categoryId, subName, subSlug, j]
        );
      }
    }

    for (let i = 0; i < FAQ_SEED.length; i++) {
      const item = FAQ_SEED[i];
      const [rows] = await conn.query<any[]>('SELECT id FROM faq_items WHERE question = ?', [item.question]);
      if (rows.length === 0) {
        await conn.query('INSERT INTO faq_items (question, answer, sort_order) VALUES (?, ?, ?)', [
          item.question,
          item.answer,
          i,
        ]);
      }
    }

    await conn.commit();
    console.log('Seed complete: categories, subcategories, admin user, FAQ items.');
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
