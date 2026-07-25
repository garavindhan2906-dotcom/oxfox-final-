import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../../config/db';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAdmin } from '../../middleware/auth';

export const analyticsRouter = Router();

const PAGE_TYPES = [
  'homepage',
  'category',
  'subcategory',
  'product',
  'custom_order',
  'community',
  'shipping',
  'faq',
  'bulk_orders',
  'other',
] as const;

const visitSchema = z.object({ pageType: z.enum(PAGE_TYPES) });

analyticsRouter.post(
  '/visits',
  asyncHandler(async (req, res) => {
    const { pageType } = visitSchema.parse(req.body);
    await pool.query(
      `INSERT INTO page_visits (visit_date, page_type, visit_count)
       VALUES (CURDATE(), ?, 1)
       ON DUPLICATE KEY UPDATE visit_count = visit_count + 1`,
      [pageType]
    );
    res.status(204).end();
  })
);

const PAGE_TYPE_LABELS: Record<string, string> = {
  homepage: 'Homepage Visits',
  category: 'Category Views',
  subcategory: 'Subcategory Views',
  product: 'Product Views',
  custom_order: 'Custom Order Views',
  community: 'Community Views',
  faq: 'FAQ Views',
  bulk_orders: 'Bulk Order Views',
  other: 'Other Visits',
};

analyticsRouter.get(
  '/admin/analytics/calendar',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const year = Number(req.query.year) || new Date().getFullYear();
    const month = Number(req.query.month) || new Date().getMonth() + 1; // 1-12

    const firstDay = `${year}-${String(month).padStart(2, '0')}-01`;
    const daysInMonth = new Date(year, month, 0).getDate();
    const lastDay = `${year}-${String(month).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

    const [rows] = await pool.query<any[]>(
      'SELECT visit_date, page_type, visit_count FROM page_visits WHERE visit_date BETWEEN ? AND ?',
      [firstDay, lastDay]
    );

    const byDate: Record<string, { pageType: string; label: string; count: number }[]> = {};
    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      byDate[dateKey] = [];
    }

    for (const row of rows) {
      const dateKey = String(row.visit_date).slice(0, 10);
      if (!byDate[dateKey]) byDate[dateKey] = [];
      byDate[dateKey].push({
        pageType: row.page_type,
        label: PAGE_TYPE_LABELS[row.page_type] ?? row.page_type,
        count: row.visit_count,
      });
    }

    const days = Object.entries(byDate).map(([date, entries]) => ({
      date,
      entries,
      total: entries.reduce((sum, e) => sum + e.count, 0),
    }));

    res.json({ year, month, days });
  })
);
