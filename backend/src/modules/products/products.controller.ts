import { Request, Response } from 'express';
import { z } from 'zod';
import * as productsService from './products.service';

export async function listProductsHandler(req: Request, res: Response) {
  const { category, subcategory, sort, page, limit } = req.query;
  const result = await productsService.listProducts({
    categorySlug: typeof category === 'string' ? category : undefined,
    subcategorySlug: typeof subcategory === 'string' ? subcategory : undefined,
    sort: sort as 'new' | 'price_asc' | 'price_desc' | undefined,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });
  res.json(result);
}

export async function listProductsAdminHandler(req: Request, res: Response) {
  const { page, limit } = req.query;
  const result = await productsService.listProductsAdmin(page ? Number(page) : undefined, limit ? Number(limit) : undefined);
  res.json(result);
}

export async function getProductHandler(req: Request, res: Response) {
  const product = await productsService.getProductBySlug(req.params.slug);
  res.json({ product });
}

export async function getProductAdminHandler(req: Request, res: Response) {
  const product = await productsService.getProductByIdForAdmin(Number(req.params.id));
  res.json({ product });
}

const productSchema = z.object({
  categoryId: z.number(),
  subcategoryId: z.number().nullable().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  material: z.string().optional(),
  dimensions: z.string().optional(),
  price: z.number().nullable().optional(),
  mrp: z.number().nullable().optional(),
  badge: z.enum(['none', 'new', 'bestseller', 'sale', 'limited']).optional(),
  filterTag: z.string().nullable().optional(),
  emojiIcon: z.string().nullable().optional(),
  isNew: z.boolean().optional(),
  isActive: z.boolean().optional(),
  inStock: z.boolean().optional(),
  stockQty: z.number().nullable().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export async function createProductHandler(req: Request, res: Response) {
  const data = productSchema.parse(req.body);
  const result = await productsService.createProduct(data);
  res.status(201).json(result);
}

export async function updateProductHandler(req: Request, res: Response) {
  const data = productSchema.partial().parse(req.body);
  await productsService.updateProduct(Number(req.params.id), data);
  res.json({ success: true });
}

export async function setActiveHandler(req: Request, res: Response) {
  const { isActive } = z.object({ isActive: z.boolean() }).parse(req.body);
  await productsService.setProductActive(Number(req.params.id), isActive);
  res.json({ success: true });
}

export async function deleteProductHandler(req: Request, res: Response) {
  const { deleteUploadedFile } = await import('../../uploads/multerConfig');
  const filePaths = await productsService.deleteProduct(Number(req.params.id));
  filePaths.forEach(deleteUploadedFile);
  res.json({ success: true });
}

const discountTiersSchema = z.object({
  tiers: z.array(z.object({ minQty: z.number().min(1), discountPercent: z.number().min(0).max(100) })),
});

export async function replaceDiscountTiersHandler(req: Request, res: Response) {
  const { tiers } = discountTiersSchema.parse(req.body);
  await productsService.replaceDiscountTiers(Number(req.params.id), tiers);
  res.json({ success: true });
}
