import { Router } from 'express';
import { login, getProfile } from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/jwt.middleware';

const router = Router();

// Public route
router.post('/login', login);

// Protected route
router.get('/profile', authenticateToken, getProfile);

export default router;
