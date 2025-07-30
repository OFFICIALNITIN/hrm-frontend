"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "@/services/api";
import type { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  clearError: () => void;
  getCurrentUser: (id: string) => Promise<User | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshAuth = async () => {
    try {
      const userData = await apiService.verifyAuth();
      setUser(userData);
    } catch (err) {
      setUser(null);
    }
  };

  const getCurrentUser = async (id: string) => {
    try {
      setError(null);
      setLoading(true);
      const response = await apiService.getUser(id);
      return response;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch current user",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication status on mount using server verification
    const checkAuth = async () => {
      try {
        setLoading(true);
        await refreshAuth();
      } catch (err) {
        // Silent fail - user is not authenticated
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
      console.log(userData);
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
      setError(null);
      setLoading(true);

      await apiService.logout();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to logout.");
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    getCurrentUser,
    isAuthenticated: !!user,
    hasRole,
    hasAnyRole,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
