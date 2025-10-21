"use client";

import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
  redirectOnLogin?: boolean; // new prop to control redirect behavior
}

export default function ProtectedRoute({
  children,
  fallbackPath = "/",
  redirectOnLogin = true, // default to true for backward compatibility
}: ProtectedRouteProps) {
  const { user, isLoading, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and no user is authenticated, redirect only if enabled
    if (!isLoading && !user && redirectOnLogin) {
      router.push(fallbackPath);
    }
  }, [user, isLoading, router, fallbackPath, redirectOnLogin]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex-1 w-full bg-black flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="loading loading-spinner loading-lg text-blue-400"></span>
          <span className="text-neutral-400 text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  // If no user, don't render anything (redirect is happening)
  if (!user) {
    return (
      <div className="flex-1 w-full bg-black flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 mx-auto mb-6 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent mb-3">
            Access Denied
          </h2>
          <p className="text-neutral-400 mb-6 text-lg">
            You need to be logged in to access this page.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => login()}
              className="btn btn-primary border border-blue-500/50 hover:scale-105 transition-all shadow-lg shadow-blue-500/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Login with 42
            </button>
            <button
              onClick={() => router.push("/")}
              className="btn btn-ghost border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}
