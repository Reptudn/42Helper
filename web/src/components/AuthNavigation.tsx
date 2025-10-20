"use client";

import Image from "next/image";
import { useAuth } from "../contexts/AuthContext";

export default function AuthNavigation() {
  const { user, logout, login, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex space-x-4">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        {user.image && (
          <Image 
            src={user.image} 
            alt="Profile" 
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
        <div className="text-sm">
          <div className="text-gray-700 font-medium">
            {user.name || user.login || user.email}
          </div>
          {user.campus && (
            <div className="text-gray-500 text-xs">
              {user.campus} {user.level && `• Level ${user.level.toFixed(2)}`}
            </div>
          )}
        </div>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex space-x-4">
      <button
        onClick={login}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Login with 42
      </button>
    </div>
  );
}
