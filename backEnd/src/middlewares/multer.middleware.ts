import { Request } from 'express';
import multer from 'multer';
import streamifier from 'streamifier';

// Store file in memory (no disk writes)
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (_req: Request, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Convert Buffer → Readable Stream (for Cloudinary)
export const bufferToStream = (buffer: Buffer) => {
  return streamifier.createReadStream(buffer);
};
