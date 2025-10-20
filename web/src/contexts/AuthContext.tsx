"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSession, signIn, signOut, SessionProvider } from "next-auth/react";

interface User {
  id?: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  login?: string;
  campus?: string;
  level?: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthContextProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  const user = session?.user ? {
    id: session.user.email || undefined, // Using email as ID since 42 API doesn't provide a simple ID
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
    login: session.user.login,
    campus: session.user.campus,
    level: session.user.level,
  } : null;

  const login = () => {
    signIn("42-school");
  };

  const logout = () => {
    signOut();
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
