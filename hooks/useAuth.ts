"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { apiService } from "@/services/api";

interface User {
  userId: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  getUsers: () => Promise<User[]>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useAuthProvider() {
  const [user, setUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshAuth = async () => {
    try {
      const response = await apiService.verifyAuth();
      console.log(response);
      setUser(response.data);
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        await refreshAuth;
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const userData = await apiService.login({ email, password });

      // Store token

      setUser(userData);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);

      await apiService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  const getUsers = async () => {
    return await apiService.getUsers();
  };

  return {
    user,
    loading,
    error,
    login,
    getCurrentUser,
    logout,
    getUsers,
    refreshAuth,
    isAuthenticated: !!user,
  };
}
export { AuthContext };

// This file is now replaced by the AuthContext
// Import useAuth from "@/contexts/auth-context" instead
