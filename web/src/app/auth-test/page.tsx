"use client";

import { useAuth } from "../../contexts/AuthContext";

export default function AuthTestPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
      
      {user ? (
        <div className="space-y-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ✅ Authentication is working!
          </div>
          
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">User Information:</h2>
            <div className="bg-gray-50 p-4 rounded">
              <pre className="text-sm">{JSON.stringify(user, null, 2)}</pre>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            ❌ Not authenticated
          </div>
          <p className="text-gray-600">
            Please log in to test the authentication system.
          </p>
        </div>
      )}
    </div>
  );
}
