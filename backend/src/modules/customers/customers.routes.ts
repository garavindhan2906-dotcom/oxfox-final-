import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAdmin } from '../../middleware/auth';
import { listCustomersHandler } from './customers.controller';

export const customersRouter = Router();

customersRouter.get('/admin/all', requireAdmin, asyncHandler(listCustomersHandler));
