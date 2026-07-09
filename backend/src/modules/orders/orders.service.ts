import { pool } from '../../config/db';
import { ApiError } from '../../middleware/errorHandler';

export interface CheckoutInput {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  city?: string;
  state?: string;
  pincode?: string;
  notes?: string;
  items: { productId: number; quantity: number }[];
}

function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `OXFOX-${year}-${random}`;
}

export async function createOrder(input: CheckoutInput) {
  if (input.items.length === 0) {
    throw new ApiError(400, 'Your cart is empty.');
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    let subtotal = 0;
    const lineItems: { productId: number; name: string; unitPrice: number; quantity: number; lineTotal: number }[] =
      [];

    for (const item of input.items) {
      const [rows] = await conn.query<any[]>(
        'SELECT id, name, price FROM products WHERE id = ? AND is_active = TRUE',
        [item.productId]
      );
      if (rows.length === 0) {
        throw new ApiError(400, `Product ${item.productId} is no longer available.`);
      }
      const product = rows[0];
      const basePrice = Number(product.price ?? 0);

      const [tierRows] = await conn.query<any[]>(
        `SELECT discount_percent FROM product_discount_tiers
         WHERE product_id = ? AND min_qty <= ? ORDER BY min_qty DESC LIMIT 1`,
        [item.productId, item.quantity]
      );
      const discountPercent = tierRows.length > 0 ? Number(tierRows[0].discount_percent) : 0;
      const unitPrice = Math.round(basePrice * (1 - discountPercent / 100) * 100) / 100;

      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;
      lineItems.push({ productId: product.id, name: product.name, unitPrice, quantity: item.quantity, lineTotal });
    }

    let orderNumber = generateOrderNumber();
    for (let attempt = 0; attempt < 5; attempt++) {
      const [existing] = await conn.query<any[]>('SELECT id FROM orders WHERE order_number = ?', [orderNumber]);
      if (existing.length === 0) break;
      orderNumber = generateOrderNumber();
    }

    const [orderResult] = await conn.query<any>(
      `INSERT INTO orders
        (order_number, customer_name, customer_phone, customer_email, shipping_address, city, state, pincode, notes, subtotal)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderNumber,
        input.customerName,
        input.customerPhone,
        input.customerEmail ?? null,
        input.shippingAddress,
        input.city ?? null,
        input.state ?? null,
        input.pincode ?? null,
        input.notes ?? null,
        subtotal,
      ]
    );
    const orderId = orderResult.insertId;

    for (const item of lineItems) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, line_total) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, item.productId, item.name, item.unitPrice, item.quantity, item.lineTotal]
      );
    }

    await conn.commit();
    return { orderId, orderNumber, subtotal };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function getOrderByNumberPublic(orderNumber: string) {
  const [rows] = await pool.query<any[]>('SELECT * FROM orders WHERE order_number = ?', [orderNumber]);
  if (rows.length === 0) throw new ApiError(404, 'Order not found');

  const [items] = await pool.query<any[]>('SELECT * FROM order_items WHERE order_id = ?', [rows[0].id]);

  const order = rows[0];
  return {
    orderNumber: order.order_number,
    status: order.status,
    subtotal: order.subtotal,
    createdAt: order.created_at,
    items,
  };
}

export async function listOrdersAdmin(status?: string, page = 1, limit = 50) {
  const offset = (page - 1) * limit;
  const conditions = status ? 'WHERE status = ?' : '';
  const params = status ? [status, limit, offset] : [limit, offset];
  const [rows] = await pool.query<any[]>(
    `SELECT * FROM orders ${conditions} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    params
  );
  const [countRows] = await pool.query<any[]>(
    `SELECT COUNT(*) as total FROM orders ${conditions}`,
    status ? [status] : []
  );
  return { orders: rows, total: countRows[0].total, page, limit };
}

export async function getOrderAdmin(id: number) {
  const [rows] = await pool.query<any[]>('SELECT * FROM orders WHERE id = ?', [id]);
  if (rows.length === 0) throw new ApiError(404, 'Order not found');
  const [items] = await pool.query<any[]>('SELECT * FROM order_items WHERE order_id = ?', [id]);
  return { ...rows[0], items };
}

export async function updateOrderStatus(
  id: number,
  data: { status?: string; paymentMethod?: string; adminNotes?: string }
) {
  const fields: string[] = [];
  const values: unknown[] = [];
  if (data.status) {
    fields.push('status = ?');
    values.push(data.status);
  }
  if (data.paymentMethod) {
    fields.push('payment_method = ?');
    values.push(data.paymentMethod);
  }
  if (data.adminNotes !== undefined) {
    fields.push('admin_notes = ?');
    values.push(data.adminNotes);
  }
  if (fields.length === 0) return;
  values.push(id);
  await pool.query(`UPDATE orders SET ${fields.join(', ')} WHERE id = ?`, values);
}
