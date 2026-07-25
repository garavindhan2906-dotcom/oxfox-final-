import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { UPLOADS_ROOT } from './uploads/multerConfig';

import { authRouter } from './modules/auth/auth.routes';
import { categoriesRouter, subcategoriesRouter } from './modules/categories/categories.routes';
import { productsRouter } from './modules/products/products.routes';
import { searchRouter } from './modules/search/search.routes';
import { commentsRouter } from './modules/comments/comments.routes';
import { bulkOrdersRouter } from './modules/bulkOrders/bulkOrders.routes';
import { customOrdersRouter } from './modules/customOrders/customOrders.routes';
import { newsletterRouter } from './modules/newsletter/newsletter.routes';
import { communityRouter } from './modules/community/community.routes';
import { faqRouter } from './modules/faq/faq.routes';
import { analyticsRouter } from './modules/analytics/analytics.routes';
import { ordersRouter } from './modules/orders/orders.routes';
import { customersRouter } from './modules/customers/customers.routes';
import { shippingRouter } from './modules/shipping/shipping.routes';
import { communityImagesRouter } from './modules/communityImages/communityImages.routes';
import { heroImagesRouter } from './modules/heroImages/heroImages.routes';

export const app = express();

app.use(cors({ origin: env.frontendOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(UPLOADS_ROOT));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/subcategories', subcategoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/search', searchRouter);
app.use('/api', commentsRouter);
app.use('/api/bulk-orders', bulkOrdersRouter);
app.use('/api/custom-orders', customOrdersRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/community', communityRouter);
app.use('/api/faq', faqRouter);
app.use('/api', analyticsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/customers', customersRouter);
app.use('/api/shipping', shippingRouter);
app.use('/api/community-images', communityImagesRouter);
app.use('/api/hero-images', heroImagesRouter);

app.use(errorHandler);
