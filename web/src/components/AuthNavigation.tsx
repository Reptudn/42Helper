"use client";

import Image from "next/image";
import { useAuth } from "../contexts/AuthContext";

export default function AuthNavigation() {
  const { user, logout, login, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <span className="loading loading-spinner loading-sm text-blue-400"></span>
        <span className="text-neutral-400 text-sm">Loading...</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        {user.image && (
          <Image
            src={user.image}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full border-2 border-blue-500/50 shadow-lg shadow-blue-500/20"
          />
        )}
        <div className="text-sm hidden sm:block">
          <div className="text-white font-medium">
            {user.name || user.login || user.email}
          </div>
          {user.campus && (
            <div className="text-neutral-400 text-xs">
              {user.campus} {user.level && `• Level ${user.level.toFixed(2)}`}
            </div>
          )}
        </div>
        <button
          onClick={logout}
          className="btn btn-sm bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 border-2 border-red-400/50 hover:border-red-400 text-white font-semibold hover:scale-105 transition-all shadow-xl shadow-red-500/50 hover:shadow-red-500/70"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
              clipRule="evenodd"
            />
          </svg>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={login}
        className="btn btn-primary btn-sm border border-blue-500/50 hover:scale-105 transition-all shadow-lg shadow-blue-500/20"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
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
    </div>
  );
}
