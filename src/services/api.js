import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sparkbook_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sparkbook_token');
      localStorage.removeItem('sparkbook_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  verifyToken: () => api.post('/auth/verify'),
};

// Users API
export const usersAPI = {
  getUsers: (search = '') => api.get(`/users?search=${search}`),
  getUserById: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  followUser: (id) => api.post(`/users/${id}/follow`),
};

// Posts API
export const postsAPI = {
  getPosts: (page = 1, limit = 10) => api.get(`/posts?page=${page}&limit=${limit}`),
  getUserPosts: (userId, page = 1, limit = 12) => api.get(`/posts/user/${userId}?page=${page}&limit=${limit}`),
  createPost: (postData) => api.post('/posts', postData),
  likePost: (id) => api.post(`/posts/${id}/like`),
  addComment: (id, content) => api.post(`/posts/${id}/comment`, { content }),
  deletePost: (id) => api.delete(`/posts/${id}`),
};

// Messages API
export const messagesAPI = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (userId, page = 1, limit = 50) => api.get(`/messages/${userId}?page=${page}&limit=${limit}`),
  sendMessage: (data) => api.post('/messages', data),
  markAsRead: (userId) => api.put(`/messages/${userId}/read`),
};

export default api;