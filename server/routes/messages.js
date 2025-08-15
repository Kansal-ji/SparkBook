import express from 'express';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get conversations for current user
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all unique conversation partners
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { receiver: userId }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', userId] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiver', userId] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'participant'
        }
      },
      {
        $unwind: '$participant'
      },
      {
        $project: {
          participant: {
            _id: '$participant._id',
            username: '$participant.username',
            profilePicture: '$participant.profilePicture',
            lastActive: '$participant.lastActive'
          },
          lastMessage: '$lastMessage',
          unreadCount: '$unreadCount'
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages between two users
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.params.userId;
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    // Verify other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId }
      ]
    })
    .populate('sender', 'username profilePicture')
    .populate('receiver', 'username profilePicture')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    // Mark messages as read
    await Message.updateMany(
      {
        sender: otherUserId,
        receiver: currentUserId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    const messagesResponse = messages.reverse().map(message => ({
      id: message._id,
      senderId: message.sender._id,
      receiverId: message.receiver._id,
      content: message.content,
      messageType: message.messageType,
      isRead: message.isRead,
      createdAt: message.createdAt
    }));

    res.json(messagesResponse);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { receiverId, content, messageType = 'text' } = req.body;
    const senderId = req.user._id;

    if (!receiverId || !content) {
      return res.status(400).json({ message: 'Receiver and content are required' });
    }

    if (senderId.toString() === receiverId) {
      return res.status(400).json({ message: 'Cannot send message to yourself' });
    }

    // Verify receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
      messageType
    });

    await message.save();
    await message.populate('sender', 'username profilePicture');
    await message.populate('receiver', 'username profilePicture');

    const messageResponse = {
      id: message._id,
      senderId: message.sender._id,
      receiverId: message.receiver._id,
      content: message.content,
      messageType: message.messageType,
      isRead: message.isRead,
      createdAt: message.createdAt
    };

    res.status(201).json(messageResponse);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark messages as read
router.put('/:userId/read', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.params.userId;

    await Message.updateMany(
      {
        sender: otherUserId,
        receiver: currentUserId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark messages read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;