import { Request, Response } from 'express';
import { z } from 'zod';
import * as service from './productImages.service';
import { ApiError } from '../../middleware/errorHandler';

export async function uploadImagesHandler(req: Request, res: Response) {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) {
    throw new ApiError(400, 'No images were uploaded.');
  }
  const images = await service.addImages(Number(req.params.id), files);
  res.status(201).json({ images });
}

export async function deleteImageHandler(req: Request, res: Response) {
  await service.deleteImage(Number(req.params.id), Number(req.params.imageId));
  res.json({ success: true });
}

export async function setPrimaryHandler(req: Request, res: Response) {
  await service.setPrimaryImage(Number(req.params.id), Number(req.params.imageId));
  res.json({ success: true });
}

const reorderSchema = z.object({ order: z.array(z.number()) });

export async function reorderHandler(req: Request, res: Response) {
  const { order } = reorderSchema.parse(req.body);
  await service.reorderImages(Number(req.params.id), order);
  res.json({ success: true });
}

export async function setSlotHandler(req: Request, res: Response) {
  const slotIndex = Number(req.params.slotIndex);
  const file = req.file;
  const url = typeof req.body.url === 'string' && req.body.url.trim() ? req.body.url.trim() : undefined;

  const image = await service.setSlotImage(Number(req.params.id), slotIndex, { file, url });
  res.json({ image });
}

export async function clearSlotHandler(req: Request, res: Response) {
  await service.clearSlot(Number(req.params.id), Number(req.params.slotIndex));
  res.json({ success: true });
}
