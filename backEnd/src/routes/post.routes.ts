import express from 'express';
import {
  addPost,
  deletePost,
  fetchPost,
  fetchPosts,
  updatePost,
} from '../controllers/posts.controller';
const router = express.Router();

router.get('/posts/:id', fetchPost);
router.get('/posts/', fetchPosts);
router.get('/posts/:id', deletePost);
router.get('/posts/:id', updatePost);
router.get('/posts', addPost);

export default router;
