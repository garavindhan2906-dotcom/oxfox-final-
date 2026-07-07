import { Request, Response } from 'express';
import { z } from 'zod';
import * as categoriesService from './categories.service';

export async function listCategoriesHandler(_req: Request, res: Response) {
  const categories = await categoriesService.listCategories(false);
  res.json({ categories });
}

export async function listCategoriesAdminHandler(_req: Request, res: Response) {
  const categories = await categoriesService.listCategories(true);
  res.json({ categories });
}

export async function getCategoryHandler(req: Request, res: Response) {
  const category = await categoriesService.getCategoryBySlug(req.params.slug);
  res.json({ category });
}

export async function getSubcategoryHandler(req: Request, res: Response) {
  const subcategory = await categoriesService.getSubcategoryBySlug(req.params.slug, req.params.subSlug);
  res.json({ subcategory });
}

const createCategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  bannerImage: z.string().optional(),
  emoji: z.string().optional(),
  sortOrder: z.number().optional(),
});

export async function createCategoryHandler(req: Request, res: Response) {
  const data = createCategorySchema.parse(req.body);
  const result = await categoriesService.createCategory(data);
  res.status(201).json(result);
}

const updateCategorySchema = createCategorySchema.partial().extend({ isActive: z.boolean().optional() });

export async function updateCategoryHandler(req: Request, res: Response) {
  const data = updateCategorySchema.parse(req.body);
  await categoriesService.updateCategory(Number(req.params.id), data);
  res.json({ success: true });
}

export async function deleteCategoryHandler(req: Request, res: Response) {
  await categoriesService.deleteCategory(Number(req.params.id));
  res.json({ success: true });
}

export async function setCategoryBannerHandler(req: Request, res: Response) {
  const file = req.file;
  const url = typeof req.body.url === 'string' && req.body.url.trim() ? req.body.url.trim() : undefined;
  const result = await categoriesService.setCategoryBanner(Number(req.params.id), { file, url });
  res.json(result);
}

const createSubcategorySchema = z.object({ name: z.string().min(1), sortOrder: z.number().optional() });

export async function createSubcategoryHandler(req: Request, res: Response) {
  const data = createSubcategorySchema.parse(req.body);
  const result = await categoriesService.createSubcategory(Number(req.params.id), data.name, data.sortOrder);
  res.status(201).json(result);
}

const updateSubcategorySchema = z.object({
  name: z.string().min(1).optional(),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional(),
});

export async function updateSubcategoryHandler(req: Request, res: Response) {
  const data = updateSubcategorySchema.parse(req.body);
  await categoriesService.updateSubcategory(Number(req.params.id), data);
  res.json({ success: true });
}

export async function deleteSubcategoryHandler(req: Request, res: Response) {
  await categoriesService.deleteSubcategory(Number(req.params.id));
  res.json({ success: true });
}
