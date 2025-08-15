export interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  profilePicture?: string;
  followers: string[];
  following: string[];
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userProfilePicture?: string;
  imageUrl: string;
  caption: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}