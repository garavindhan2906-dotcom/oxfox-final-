import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAdmin } from '../../middleware/auth';
import { rateLimit } from '../../middleware/rateLimit';
import * as service from './orders.service';

export const ordersRouter = Router();

const checkoutSchema = z.object({
  customerName: z.string().min(1).max(150),
  customerPhone: z.string().min(10).max(15),
  customerEmail: z.string().email().optional(),
  shippingAddress: z.string().min(1),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({ productId: z.number(), quantity: z.number().min(1) })).min(1),
});

ordersRouter.post(
  '/',
  rateLimit('create-order', 10, 10 * 60 * 1000),
  asyncHandler(async (req, res) => {
    const data = checkoutSchema.parse(req.body);
    const result = await service.createOrder(data);
    res.status(201).json(result);
  })
);

ordersRouter.get(
  '/:orderNumber',
  asyncHandler(async (req, res) => {
    const order = await service.getOrderByNumberPublic(req.params.orderNumber);
    res.json({ order });
  })
);

ordersRouter.get(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { status, page, limit } = req.query;
    const result = await service.listOrdersAdmin(
      typeof status === 'string' ? status : undefined,
      page ? Number(page) : undefined,
      limit ? Number(limit) : undefined
    );
    res.json(result);
  })
);

ordersRouter.get(
  '/admin/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const order = await service.getOrderAdmin(Number(req.params.id));
    res.json({ order });
  })
);

const statusSchema = z.object({
  status: z.enum(['pending_payment', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  paymentMethod: z.enum(['cod', 'upi', 'bank_transfer', 'unassigned']).optional(),
  adminNotes: z.string().optional(),
});

ordersRouter.patch(
  '/:id/status',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const data = statusSchema.parse(req.body);
    await service.updateOrderStatus(Number(req.params.id), data);
    res.json({ success: true });
  })
);
