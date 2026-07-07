import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAdmin } from '../../middleware/auth';
import { contentImageUpload } from '../../uploads/multerConfig';
import * as controller from './categories.controller';

export const categoriesRouter = Router();

categoriesRouter.get('/', asyncHandler(controller.listCategoriesHandler));
categoriesRouter.get('/admin/all', requireAdmin, asyncHandler(controller.listCategoriesAdminHandler));
categoriesRouter.get('/:slug', asyncHandler(controller.getCategoryHandler));
categoriesRouter.get('/:slug/subcategories/:subSlug', asyncHandler(controller.getSubcategoryHandler));

categoriesRouter.post('/', requireAdmin, asyncHandler(controller.createCategoryHandler));
categoriesRouter.put('/:id', requireAdmin, asyncHandler(controller.updateCategoryHandler));
categoriesRouter.delete('/:id', requireAdmin, asyncHandler(controller.deleteCategoryHandler));

categoriesRouter.put(
  '/:id/banner',
  requireAdmin,
  contentImageUpload.single('image'),
  asyncHandler(controller.setCategoryBannerHandler)
);

categoriesRouter.post('/:id/subcategories', requireAdmin, asyncHandler(controller.createSubcategoryHandler));

export const subcategoriesRouter = Router();
subcategoriesRouter.put('/:id', requireAdmin, asyncHandler(controller.updateSubcategoryHandler));
subcategoriesRouter.delete('/:id', requireAdmin, asyncHandler(controller.deleteSubcategoryHandler));
