import express from 'express';
import { fetchComment, sendComment } from '../controllers/comment.controller';
const router = express.Router();

router.get('/comments', fetchComment);
router.post('/comments/:id', sendComment);

export default router;
