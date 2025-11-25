import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// Configure multer for memory storage (for Cloudinary)
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check file types
  const allowedMimes = {
    image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    video: ['video/mp4', 'video/mpeg', 'video/quicktime'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  };

  if (
    allowedMimes.image.includes(file.mimetype) ||
    allowedMimes.video.includes(file.mimetype) ||
    allowedMimes.document.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only images, videos and PDFs are allowed.`));
  }
};

// Configure multer
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
    files: 5 // Max 5 files at once
  }
});

// Middleware for different upload types
export const uploadMiddleware = {
  // Single file upload
  single: (fieldName: string) => upload.single(fieldName),
  
  // Multiple files upload
  multiple: (fieldName: string, maxCount: number = 5) => upload.array(fieldName, maxCount),
  
  // Mixed files (different fields)
  fields: (fields: multer.Field[]) => upload.fields(fields)
};

// File size formatter
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default uploadMiddleware;