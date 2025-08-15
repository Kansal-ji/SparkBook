import { useState, useEffect } from 'react';
import { User } from '../types';
import { usersAPI } from '../services/api';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const followUser = async (currentUserId: string, targetUserId: string) => {
    try {
      await usersAPI.followUser(targetUserId);
      
      // Update local state
      setUsers(prevUsers =>
        prevUsers.map(user => {
          if (user.id === currentUserId) {
            const isFollowing = user.following.includes(targetUserId);
            return {
              ...user,
              following: isFollowing 
                ? user.following.filter(id => id !== targetUserId)
                : [...user.following, targetUserId]
            };
          }
          if (user.id === targetUserId) {
            const isFollower = user.followers.includes(currentUserId);
            return {
              ...user,
              followers: isFollower 
                ? user.followers.filter(id => id !== currentUserId)
                : [...user.followers, currentUserId]
            };
          }
          return user;
        })
      );
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const searchUsers = async (query: string) => {
    try {
      if (!query.trim()) return [];
      const response = await usersAPI.getUsers(query);
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  };

  const getUserById = async (userId: string) => {
    try {
      const response = await usersAPI.getUserById(userId);
      return response.data;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  };

  return {
    users,
    loading,
    followUser,
    searchUsers,
    getUserById,
    refreshUsers: loadUsers,
  };
};