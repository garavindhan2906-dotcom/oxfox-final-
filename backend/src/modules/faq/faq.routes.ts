import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../../config/db';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAdmin } from '../../middleware/auth';

export const faqRouter = Router();

faqRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query<any[]>(
      'SELECT id, question, answer FROM faq_items WHERE is_active = TRUE ORDER BY sort_order ASC'
    );
    res.json({ items: rows });
  })
);

faqRouter.get(
  '/admin/all',
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query<any[]>('SELECT * FROM faq_items ORDER BY sort_order ASC');
    res.json({ items: rows });
  })
);

const faqSchema = z.object({
  question: z.string().min(1).max(300),
  answer: z.string().min(1),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional(),
});

faqRouter.post(
  '/admin',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const data = faqSchema.parse(req.body);
    const [result] = await pool.query<any>(
      'INSERT INTO faq_items (question, answer, sort_order, is_active) VALUES (?, ?, ?, ?)',
      [data.question, data.answer, data.sortOrder ?? 0, data.isActive ?? true]
    );
    res.status(201).json({ id: result.insertId });
  })
);

faqRouter.put(
  '/admin/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const data = faqSchema.partial().parse(req.body);
    const fields: string[] = [];
    const values: unknown[] = [];
    for (const [key, column] of Object.entries({
      question: 'question',
      answer: 'answer',
      sortOrder: 'sort_order',
      isActive: 'is_active',
    })) {
      const value = (data as Record<string, unknown>)[key];
      if (value !== undefined) {
        fields.push(`${column} = ?`);
        values.push(value);
      }
    }
    if (fields.length > 0) {
      values.push(req.params.id);
      await pool.query(`UPDATE faq_items SET ${fields.join(', ')} WHERE id = ?`, values);
    }
    res.json({ success: true });
  })
);

faqRouter.delete(
  '/admin/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    await pool.query('DELETE FROM faq_items WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  })
);
