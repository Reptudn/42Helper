"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, login, isLoading } = useAuth();

  useEffect(() => {
    // Redirect to home if already authenticated
    if (user && !isLoading) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  const handleLogin = () => {
    login();
  };

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
        <div className="text-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
        <div className="text-center">
          <div className="text-green-600">Already logged in. Redirecting...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Login to 42 Helper</h1>
      
      <div className="text-center space-y-4">
        <p className="text-gray-600 mb-6">
          Sign in with your 42 School account to access the platform.
        </p>
        
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        >
          Sign in with 42 School
        </button>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>
            By signing in, you agree to connect your 42 School account with this platform.
            Your profile information will be used to help match requests and offers.
          </p>
        </div>
      </div>
    </div>
  );
}
