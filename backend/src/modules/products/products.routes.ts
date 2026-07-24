import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { requireAdmin } from '../../middleware/auth';
import { productImageUpload, productVideoUpload, MAX_IMAGES_PER_PRODUCT } from '../../uploads/multerConfig';
import * as controller from './products.controller';
import * as imagesController from '../productImages/productImages.controller';
import { exportProductsCsvHandler } from './products.export';

export const productsRouter = Router();

productsRouter.get('/', asyncHandler(controller.listProductsHandler));
productsRouter.get('/admin/all', requireAdmin, asyncHandler(controller.listProductsAdminHandler));
productsRouter.get('/admin/export', requireAdmin, asyncHandler(exportProductsCsvHandler));
productsRouter.get('/admin/:id', requireAdmin, asyncHandler(controller.getProductAdminHandler));
productsRouter.get('/:slug', asyncHandler(controller.getProductHandler));

productsRouter.post('/', requireAdmin, asyncHandler(controller.createProductHandler));
productsRouter.put('/:id', requireAdmin, asyncHandler(controller.updateProductHandler));
productsRouter.patch('/:id/active', requireAdmin, asyncHandler(controller.setActiveHandler));
productsRouter.delete('/:id', requireAdmin, asyncHandler(controller.deleteProductHandler));

productsRouter.put('/:id/discount-tiers', requireAdmin, asyncHandler(controller.replaceDiscountTiersHandler));

productsRouter.post(
  '/:id/images',
  requireAdmin,
  productImageUpload.array('images', MAX_IMAGES_PER_PRODUCT),
  asyncHandler(imagesController.uploadImagesHandler)
);
productsRouter.delete('/:id/images/:imageId', requireAdmin, asyncHandler(imagesController.deleteImageHandler));
productsRouter.patch(
  '/:id/images/:imageId/primary',
  requireAdmin,
  asyncHandler(imagesController.setPrimaryHandler)
);
productsRouter.patch('/:id/images/reorder', requireAdmin, asyncHandler(imagesController.reorderHandler));

productsRouter.put(
  '/:id/images/slot/:slotIndex',
  requireAdmin,
  productImageUpload.single('image'),
  asyncHandler(imagesController.setSlotHandler)
);
productsRouter.delete('/:id/images/slot/:slotIndex', requireAdmin, asyncHandler(imagesController.clearSlotHandler));

productsRouter.post(
  '/:id/video',
  requireAdmin,
  productVideoUpload.single('video'),
  asyncHandler(controller.uploadVideoHandler)
);
productsRouter.delete('/:id/video', requireAdmin, asyncHandler(controller.deleteVideoHandler));
