"use client";

import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

export default function AuthNavigation() {
  const { user, logout, isLoading } = useAuth();

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
        <span className="text-gray-700">Welcome, {user.name || user.email}!</span>
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
      <Link
        href="/login"
        className="text-blue-600 hover:underline px-3 py-2"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Register
      </Link>
    </div>
  );
}
