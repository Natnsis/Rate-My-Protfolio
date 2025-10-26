import express from 'express';
import { fetchComment, sendComment } from '../controllers/comment.controller';
const router = express.Router();

router.get('/comments/:id', fetchComment);
router.post('/comments/:id', sendComment);

export default router;
