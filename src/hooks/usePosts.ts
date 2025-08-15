import { useState, useEffect } from 'react';
import { Post, Comment } from '../types';
import { postsAPI } from '../services/api';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getPosts();
      setPosts(response.data);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: Omit<Post, 'id' | 'likes' | 'comments' | 'createdAt'>) => {
    try {
      const response = await postsAPI.createPost({
        imageUrl: postData.imageUrl,
        caption: postData.caption,
      });
      
      const newPost = response.data;
      setPosts(prevPosts => [newPost, ...prevPosts]);
      return newPost;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  const toggleLike = async (postId: string, userId: string) => {
    try {
      await postsAPI.likePost(postId);
      
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            const isLiked = post.likes.includes(userId);
            return {
              ...post,
              likes: isLiked 
                ? post.likes.filter(id => id !== userId)
                : [...post.likes, userId]
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const addComment = async (postId: string, commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    try {
      const response = await postsAPI.addComment(postId, commentData.content);
      const newComment = response.data;

      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...post.comments, newComment]
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const getUserPosts = async (userId: string) => {
    try {
      const response = await postsAPI.getUserPosts(userId);
      return response.data;
    } catch (error) {
      console.error('Error getting user posts:', error);
      return [];
    }
  };

  return {
    posts,
    loading,
    createPost,
    toggleLike,
    addComment,
    getUserPosts,
    refreshPosts: loadPosts,
  };
};