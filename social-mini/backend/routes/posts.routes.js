import { Router } from 'express';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import { requireAuth } from '../middleware/auth.js';
import { sanitize } from '../utils/validators.js';

const router = Router();

// Create post
router.post('/', requireAuth, async (req, res) => {
  const text = sanitize((req.body.text || '').slice(0, 500));
  const imageUrl = (req.body.imageUrl || '').trim();
  if (!text && !imageUrl) return res.status(400).json({ message: 'Content required' });
  const post = await Post.create({ author: req.user.id, text, imageUrl });
  res.status(201).json(post);
});

// Feed (latest)
router.get('/feed', requireAuth, async (req, res) => {
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('author', 'username name avatarUrl');
  res.json(posts);
});

// Like / Unlike
router.post('/:postId/like', requireAuth, async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  const has = post.likes.some((id) => String(id) === req.user.id);
  if (has) {
    post.likes = post.likes.filter((id) => String(id) !== req.user.id);
  } else {
    post.likes.push(req.user.id);
  }
  await post.save();
  res.json({ liked: !has, likesCount: post.likes.length });
});

// List comments for a post
router.get('/:postId/comments', async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .sort({ createdAt: 1 })
    .populate('author', 'username name avatarUrl');
  res.json(comments);
});

// Add comment
router.post('/:postId/comments', requireAuth, async (req, res) => {
  const text = sanitize((req.body.text || '').slice(0, 300));
  if (!text) return res.status(400).json({ message: 'Comment required' });
  const comment = await Comment.create({ author: req.user.id, post: req.params.postId, text });
  res.status(201).json(comment);
});

// Get single post
router.get('/:postId', async (req, res) => {
  const post = await Post.findById(req.params.postId)
    .populate('author', 'username name avatarUrl');
  if (!post) return res.status(404).json({ message: 'Not found' });
  res.json(post);
});

// Delete post (author only)
router.delete('/:postId', requireAuth, async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ message: 'Not found' });
  if (String(post.author) !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
  await post.deleteOne();
  res.json({ ok: true });
});

export default router;
