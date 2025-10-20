"use client";

import { useEffect, useState } from "react";
import { pb } from "../../lib/pocketbaseClient";
import { config } from "../../lib/config";

interface HelpRequest {
  id: string;
  title: string;
  description: string;
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching from ${config.collections.requests} collection...`);
        
        // Get all records from the requests collection
        const records = await pb.collection(config.collections.requests).getFullList<HelpRequest>(200);
        console.log("Successfully fetched requests:", records);
        setRequests(records);
      } catch (error: unknown) {
        console.error("PocketBase error:", error);
        
        if (error instanceof Error) {
          if (error.message.includes("superuser")) {
            setError("Collection access restricted. Please set API rules to allow public access in PocketBase admin.");
          } else if (error.message.includes("authorization")) {
            setError("Authentication required. Please configure collection API rules for public access.");
          } else {
            setError(`Error: ${error.message}`);
          }
        } else {
          setError("Unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Requests</h1>
      
      {loading && <p>Loading requests...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-semibold">Configuration Issue:</p>
          <p>{error}</p>
          <p className="mt-2 text-sm">
            Go to <a href={config.pocketbase.adminUrl} className="underline" target="_blank" rel="noopener noreferrer">
              PocketBase Admin
            </a> → Collections → {config.collections.requests} → API Rules and set List/Search rule to empty string (&quot;&quot;) for public access.
          </p>
        </div>
      )}
      
      {!loading && !error && requests.length === 0 && (
        <p className="text-gray-500">No requests yet.</p>
      )}
      
      {!loading && !error && requests.length > 0 && (
        <ul className="space-y-4">
          {requests.map((request) => (
            <li key={request.id} className="p-4 border rounded-md bg-gray-50">
              <h2 className="font-semibold text-lg">{request.title}</h2>
              <p className="text-gray-700 mt-2">{request.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
