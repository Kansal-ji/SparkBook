import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('sparkbook_token');
      if (!token) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          loading: false,
        });
        return;
      }

      const response = await authAPI.getCurrentUser();
      setAuthState({
        user: response.data,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('sparkbook_token');
      localStorage.removeItem('sparkbook_user');
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('sparkbook_token', token);
      localStorage.setItem('sparkbook_user', JSON.stringify(user));
      
      setAuthState({
        user,
        isAuthenticated: true,
        loading: false,
      });
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.register({ username, email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('sparkbook_token', token);
      localStorage.setItem('sparkbook_user', JSON.stringify(user));
      
      setAuthState({
        user,
        isAuthenticated: true,
        loading: false,
      });
      
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('sparkbook_token');
    localStorage.removeItem('sparkbook_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      const response = await authAPI.getCurrentUser();
      const updatedUser = response.data;
      
      localStorage.setItem('sparkbook_user', JSON.stringify(updatedUser));
      setAuthState({
        ...authState,
        user: updatedUser,
      });
    } catch (error) {
      console.error('Update user failed:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};