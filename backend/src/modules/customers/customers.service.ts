import { pool } from '../../config/db';

export interface CustomerSummary {
  phone: string;
  name: string;
  email: string | null;
  total_orders: number;
  total_spent: number;
  first_order_at: string;
  last_order_at: string;
}

/** One row per unique phone number, with contact info from their most recent order. */
export async function listCustomers(): Promise<CustomerSummary[]> {
  const [rows] = await pool.query<any[]>(`
    SELECT phone, name, email, total_orders, total_spent, first_order_at, last_order_at
    FROM (
      SELECT
        customer_phone AS phone,
        customer_name AS name,
        customer_email AS email,
        COUNT(*) OVER (PARTITION BY customer_phone) AS total_orders,
        SUM(subtotal) OVER (PARTITION BY customer_phone) AS total_spent,
        MIN(created_at) OVER (PARTITION BY customer_phone) AS first_order_at,
        MAX(created_at) OVER (PARTITION BY customer_phone) AS last_order_at,
        ROW_NUMBER() OVER (PARTITION BY customer_phone ORDER BY created_at DESC, id DESC) AS rn
      FROM orders
    ) ranked
    WHERE rn = 1
    ORDER BY last_order_at DESC
  `);
  return rows as CustomerSummary[];
}
