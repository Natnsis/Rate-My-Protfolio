import express from 'express';
import {
  fetchPosts,
  fetchPost,
  deletePost,
  updatePost,
  addPost,
} from '../controllers/posts.controller';
const router = express.Router();

router.get('/posts/:id', fetchPost);
router.get('/posts', fetchPosts);
router.delete('/posts/:id', deletePost);
router.put('/posts/:id', updatePost);
router.post('/posts', addPost);

export default router;
