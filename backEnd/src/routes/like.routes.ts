import express from 'express';
import { likePost, unlikePost } from '../controllers/like.controller';

const router = express.Router();

router.post('/likes/:id', likePost);
router.delete('/likes/:id', unlikePost);

export default router;
