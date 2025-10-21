"use client";

import { useEffect, useState } from "react";
import { pb } from "../../lib/pocketbaseClient";
import { config } from "../../lib/config";
import Card from "../../components/Card";

interface HelpRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  project: string;
  userId: string;
  created: string;
  updated: string;
  expand?: {
    userId?: {
      id: string;
      login: string;
      image?: string;
      [key: string]: unknown;
    };
  };
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create an AbortController to handle cleanup
    const controller = new AbortController();
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching from ${config.collections.requests} collection...`);
        
        // Add a small delay to prevent rapid requests
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Get all records from the requests collection with expanded user data
        const records = await pb.collection(config.collections.requests).getFullList<HelpRequest>(200, {
          // Pass the abort signal to cancel the request if component unmounts
          signal: controller.signal,
          expand: "userId", // Expand user relationship
        });
        
        console.log("Successfully fetched requests:", records);
        setRequests(records);
      } catch (error: unknown) {
        // Don't show error if request was cancelled due to cleanup
        if (controller.signal.aborted) {
          console.log("Request was cancelled (component unmounted)");
          return;
        }
        
        console.error("PocketBase error:", error);
        
        if (error instanceof Error) {
          if (error.message.includes("autocancelled")) {
            setError("Request was auto-cancelled. This usually happens due to rapid re-requests. Trying again...");
            // Retry after a delay
            setTimeout(() => {
              if (!controller.signal.aborted) {
                fetchData();
              }
            }, 1000);
            return;
          } else if (error.message.includes("superuser")) {
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
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function to cancel the request if component unmounts
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="flex-1">
      <h1 className="text-2xl font-bold mb-4 text-white">Requests</h1>
      
      {loading && <p className="text-neutral-400">Loading requests...</p>}
      
      {error && (
        <div className="bg-red-900/40 border border-red-600 text-red-300 px-4 py-3 rounded mb-4">
          <p className="font-semibold">Configuration Issue:</p>
          <p>{error}</p>
          <p className="mt-2 text-sm">
            Go to <a href={config.pocketbase.adminUrl} className="underline text-red-200 hover:text-red-100" target="_blank" rel="noopener noreferrer">
              PocketBase Admin
            </a> → Collections → {config.collections.requests} → API Rules and set List/Search rule to empty string (&quot;&quot;) for public access.
          </p>
        </div>
      )}
      
      {!loading && !error && requests.length === 0 && (
        <p className="text-neutral-400">No requests yet.</p>
      )}
      
      {!loading && !error && requests.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {requests.map((request) => (
            <Card
              key={request.id}
              title={request.title}
              description={request.description}
              category={request.category}
              project={request.project}
              userImageUrl={request.expand?.userId?.login ? `https://cdn.intra.42.fr/users/${request.expand.userId.login}.jpg` : undefined}
              intraName={request.expand?.userId?.login}
            />
          ))}
        </div>
      )}
    </div>
  );
}
