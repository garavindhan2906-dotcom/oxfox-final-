import { Request, Response } from 'express';
import { pool } from '../../config/db';

function csvEscape(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function exportProductsCsvHandler(_req: Request, res: Response) {
  const [rows] = await pool.query<any[]>(
    `SELECT p.id, p.name, c.name AS category, sc.name AS subcategory, p.material, p.filter_tag,
            p.price, p.mrp, p.badge, p.emoji_icon, p.is_new, p.is_active, p.in_stock, p.stock_qty,
            p.created_at
     FROM products p
     JOIN categories c ON c.id = p.category_id
     LEFT JOIN subcategories sc ON sc.id = p.subcategory_id
     ORDER BY p.created_at DESC`
  );

  const header = [
    'ID',
    'Name',
    'Category',
    'Subcategory',
    'Material',
    'Filter Tag',
    'Price',
    'MRP',
    'Badge',
    'Emoji',
    'Is New',
    'Is Active',
    'In Stock',
    'Stock Qty',
    'Created At',
  ];

  const lines = [header.join(',')];
  for (const row of rows) {
    lines.push(
      [
        row.id,
        row.name,
        row.category,
        row.subcategory ?? '',
        row.material ?? '',
        row.filter_tag ?? '',
        row.price ?? '',
        row.mrp ?? '',
        row.badge,
        row.emoji_icon ?? '',
        row.is_new ? 'yes' : 'no',
        row.is_active ? 'yes' : 'no',
        row.in_stock ? 'yes' : 'no',
        row.stock_qty ?? '',
        row.created_at,
      ]
        .map(csvEscape)
        .join(',')
    );
  }

  const csv = lines.join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="oxfox-products-${Date.now()}.csv"`);
  res.send(csv);
}
