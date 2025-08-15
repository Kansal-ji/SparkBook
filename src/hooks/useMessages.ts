import { useState, useEffect } from 'react';
import { messagesAPI } from '../services/api';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: 'text' | 'image' | 'video';
  isRead: boolean;
  createdAt: string;
}

interface Conversation {
  _id: string;
  participant: {
    _id: string;
    username: string;
    profilePicture: string;
    lastActive: string;
  };
  lastMessage: Message;
  unreadCount: number;
}

export const useMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await messagesAPI.getConversations();
      setConversations(response.data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (userId: string) => {
    try {
      const response = await messagesAPI.getMessages(userId);
      setMessages(prev => ({
        ...prev,
        [userId]: response.data
      }));
      return response.data;
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    }
  };

  const sendMessage = async (receiverId: string, content: string, messageType: string = 'text') => {
    try {
      const response = await messagesAPI.sendMessage({
        receiverId,
        content,
        messageType
      });
      
      const newMessage = response.data;
      
      // Update messages
      setMessages(prev => ({
        ...prev,
        [receiverId]: [...(prev[receiverId] || []), newMessage]
      }));

      // Update conversations
      await loadConversations();
      
      return newMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const markAsRead = async (userId: string) => {
    try {
      await messagesAPI.markAsRead(userId);
      
      // Update local state
      setMessages(prev => ({
        ...prev,
        [userId]: prev[userId]?.map(msg => ({ ...msg, isRead: true })) || []
      }));
      
      setConversations(prev =>
        prev.map(conv =>
          conv.participant._id === userId
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  return {
    conversations,
    messages,
    loading,
    loadConversations,
    loadMessages,
    sendMessage,
    markAsRead,
  };
};