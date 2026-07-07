import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { randomUUID } from 'crypto';
import { ApiError } from '../middleware/errorHandler';

export const UPLOADS_ROOT = path.join(__dirname, '..', '..', 'uploads');
export const MAX_IMAGES_PER_PRODUCT = 6;
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const productId = req.params.id;
    const dir = path.join(UPLOADS_ROOT, 'products', productId);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `${randomUUID()}${ext}`);
  },
});

export const productImageUpload = multer({
  storage,
  limits: {
    fileSize: MAX_IMAGE_SIZE_BYTES,
    files: MAX_IMAGES_PER_PRODUCT,
  },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(new ApiError(400, 'Only JPG, PNG, and WEBP images are allowed. (HEIC/HEIF photos from iPhones need to be converted to JPG first.)'));
      return;
    }
    cb(null, true);
  },
});

const referenceImageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(UPLOADS_ROOT, 'custom-order-refs');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `${randomUUID()}${ext}`);
  },
});

export const referenceImageUpload = multer({
  storage: referenceImageStorage,
  limits: { fileSize: MAX_IMAGE_SIZE_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(new ApiError(400, 'Only JPG, PNG, and WEBP images are allowed. (HEIC/HEIF photos from iPhones need to be converted to JPG first.)'));
      return;
    }
    cb(null, true);
  },
});

const contentImageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(UPLOADS_ROOT, 'content');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `${randomUUID()}${ext}`);
  },
});

/** Used for category banners and community post images (single-file uploads). */
export const contentImageUpload = multer({
  storage: contentImageStorage,
  limits: { fileSize: MAX_IMAGE_SIZE_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(new ApiError(400, 'Only JPG, PNG, and WEBP images are allowed. (HEIC/HEIF photos from iPhones need to be converted to JPG first.)'));
      return;
    }
    cb(null, true);
  },
});

export function publicPathFor(absolutePath: string): string {
  const relative = path.relative(UPLOADS_ROOT, absolutePath).split(path.sep).join('/');
  return `/uploads/${relative}`;
}

export function deleteUploadedFile(publicPath: string) {
  const relative = publicPath.replace(/^\/uploads\//, '');
  const absolute = path.join(UPLOADS_ROOT, relative);
  fs.unlink(absolute, () => {
    // best-effort cleanup; ignore missing file errors
  });
}
