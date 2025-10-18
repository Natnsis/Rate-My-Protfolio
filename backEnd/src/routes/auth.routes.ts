import { Router } from 'express';
import multer from 'multer';
import { login, register } from '../controllers/auth.controller';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();
router.post('/register', upload.single('image'), register);
router.post('/login', login);

export default router;
