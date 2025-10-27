import express from 'express';
import { likePost, likes, unlikePost } from '../controllers/like.controller';

const router = express.Router();

router.get('/likes', likes);
router.post('/likes/:id', likePost);
router.delete('/likes/:id', unlikePost);

export default router;
