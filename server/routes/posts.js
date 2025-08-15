import express from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all posts (feed)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ isArchived: false })
      .populate('user', 'username profilePicture')
      .populate('comments.user', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const postsResponse = posts.map(post => ({
      id: post._id,
      userId: post.user._id,
      username: post.user.username,
      userProfilePicture: post.user.profilePicture,
      imageUrl: post.imageUrl,
      caption: post.caption,
      likes: post.likes,
      comments: post.comments.map(comment => ({
        id: comment._id,
        userId: comment.user._id,
        username: comment.user.username,
        content: comment.content,
        createdAt: comment.createdAt
      })),
      createdAt: post.createdAt
    }));

    res.json(postsResponse);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get posts by user
router.get('/user/:userId', optionalAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ user: userId, isArchived: false })
      .populate('user', 'username profilePicture')
      .populate('comments.user', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const postsResponse = posts.map(post => ({
      id: post._id,
      userId: post.user._id,
      username: post.user.username,
      userProfilePicture: post.user.profilePicture,
      imageUrl: post.imageUrl,
      caption: post.caption,
      likes: post.likes,
      comments: post.comments.map(comment => ({
        id: comment._id,
        userId: comment.user._id,
        username: comment.user.username,
        content: comment.content,
        createdAt: comment.createdAt
      })),
      createdAt: post.createdAt
    }));

    res.json(postsResponse);
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create post
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { imageUrl, caption } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    // Extract hashtags from caption
    const hashtags = caption ? caption.match(/#\w+/g)?.map(tag => tag.slice(1)) || [] : [];

    const post = new Post({
      user: req.user._id,
      imageUrl,
      caption: caption || '',
      hashtags
    });

    await post.save();
    await post.populate('user', 'username profilePicture');

    const postResponse = {
      id: post._id,
      userId: post.user._id,
      username: post.user.username,
      userProfilePicture: post.user.profilePicture,
      imageUrl: post.imageUrl,
      caption: post.caption,
      likes: post.likes,
      comments: [],
      createdAt: post.createdAt
    };

    res.status(201).json(postResponse);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/Unlike post
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json({ 
      message: isLiked ? 'Post unliked' : 'Post liked',
      isLiked: !isLiked,
      likesCount: post.likes.length
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment
router.post('/:id/comment', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {
      user: req.user._id,
      content: content.trim()
    };

    post.comments.push(comment);
    await post.save();
    await post.populate('comments.user', 'username');

    const newComment = post.comments[post.comments.length - 1];
    const commentResponse = {
      id: newComment._id,
      userId: newComment.user._id,
      username: newComment.user.username,
      content: newComment.content,
      createdAt: newComment.createdAt
    };

    res.status(201).json(commentResponse);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete post
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(postId);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;