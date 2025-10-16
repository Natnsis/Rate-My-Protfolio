import { Router } from 'express';
import { uploadImage } from '../controllers/file.controller';
import { upload } from '../middlewares/multer.middleware';

const router = Router();

// POST /api/upload → single image upload
router.post('/upload', upload.single('image'), uploadImage);

export default router;
