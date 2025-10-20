"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { pb } from "../lib/pocketbaseClient";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: { email: string; password: string; passwordConfirm: string; name: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        if (pb.authStore.isValid) {
          const authData = pb.authStore.model;
          if (authData) {
            setUser({
              id: authData.id,
              email: authData.email,
              name: authData.name,
            });
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        pb.authStore.clear();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const unsubscribe = pb.authStore.onChange((token, model) => {
      if (model) {
        setUser({
          id: model.id,
          email: model.email,
          name: model.name,
        });
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    const authData = await pb.collection("users").authWithPassword(email, password);
    setUser({
      id: authData.record.id,
      email: authData.record.email,
      name: authData.record.name,
    });
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
  };

  const register = async (data: { email: string; password: string; passwordConfirm: string; name: string }) => {
    await pb.collection("users").create(data);
    // Auto-login after registration
    await login(data.email, data.password);
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
