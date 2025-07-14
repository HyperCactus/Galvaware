import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../services/api';

interface AuthContextType {
  token: string | null;
  user: { id: number; username: string; email: string } | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<{ id: number; username: string; email: string } | null>(null);

  const isAuthenticated = !!token;

  useEffect(() => {
    if (token) {
      // In a real application, you would decode the token or fetch user info from an API
      // For now, we'll rely on the login function to set the user data.
      // If the token is already present on page load, we might need a separate API call
      // to fetch user details based on the token.
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (username: string, password: string) => {
    const response = await apiLogin(username, password);
    setToken(response.token);
    localStorage.setItem('token', response.token);
    setUser({ id: response.user_id, username: response.username, email: response.email });
  };

  const register = async (username: string, email: string, password: string) => {
    await apiRegister(username, email, password);
    // After successful registration, you might want to automatically log them in
    // or redirect to the login page. For now, we'll just let the LoginPage handle redirection.
  };

  const logout = () => {
    if (token) {
      apiLogout(token); // Invalidate token on backend
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};