import { Router } from 'express';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Get own profile
router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash');
  res.json(user);
});

// Get public profile by username
router.get('/:username', async (req, res) => {
  const user = await User.findOne({ username: req.params.username })
    .select('-passwordHash')
    .populate('followers', 'username')
    .populate('following', 'username');
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json(user);
});

// Follow / Unfollow
router.post('/:username/follow', requireAuth, async (req, res) => {
  const target = await User.findOne({ username: req.params.username });
  if (!target) return res.status(404).json({ message: 'User not found' });
  if (String(target._id) === req.user.id) return res.status(400).json({ message: 'Cannot follow yourself' });

  const me = await User.findById(req.user.id);
  const already = me.following.some((id) => String(id) === String(target._id));

  if (already) {
    me.following = me.following.filter((id) => String(id) !== String(target._id));
    target.followers = target.followers.filter((id) => String(id) !== String(me._id));
  } else {
    me.following.push(target._id);
    target.followers.push(me._id);
  }

  await me.save();
  await target.save();
  res.json({ following: !already });
});

export default router;
