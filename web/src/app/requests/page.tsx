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
  user: string; // Simple text field
  created: string;
  updated: string;
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
        console.log(
          `Fetching from ${config.collections.requests} collection...`
        );

        // Add a small delay to prevent rapid requests
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Get all records from the requests collection
        const records = await pb
          .collection(config.collections.requests)
          .getFullList<HelpRequest>(200, {
            // Pass the abort signal to cancel the request if component unmounts
            signal: controller.signal,
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
            setError(
              "Request was auto-cancelled. This usually happens due to rapid re-requests. Trying again..."
            );
            // Retry after a delay
            setTimeout(() => {
              if (!controller.signal.aborted) {
                fetchData();
              }
            }, 1000);
            return;
          } else if (error.message.includes("superuser")) {
            setError(
              "Collection access restricted. Please set API rules to allow public access in PocketBase admin."
            );
          } else if (error.message.includes("authorization")) {
            setError(
              "Authentication required. Please configure collection API rules for public access."
            );
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
    <div className="flex-1 w-full bg-black p-8">
      {/* Header with gradient */}
      <div className="mb-8 pb-4 border-b border-cyan-500/30">
        <div className="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-cyan-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              All Requests
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Students looking for help
            </p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <span className="loading loading-spinner loading-lg text-cyan-400"></span>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-600/50 text-red-300 px-6 py-4 rounded-lg mb-6">
          <p className="font-semibold text-red-400">Configuration Issue:</p>
          <p className="mt-2">{error}</p>
          <p className="mt-3 text-sm">
            Go to{" "}
            <a
              href={config.pocketbase.adminUrl}
              className="underline text-cyan-400 hover:text-cyan-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              PocketBase Admin
            </a>{" "}
            → Collections → {config.collections.requests} → API Rules and set
            List/Search rule to empty string (&quot;&quot;) for public access.
          </p>
        </div>
      )}
      {!loading && !error && requests.length === 0 && (
        <div className="text-center py-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto mb-4 opacity-50 text-cyan-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-neutral-400 text-lg">No requests yet.</p>
        </div>
      )}

      {!loading && !error && requests.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {requests.map((request) => (
            <div
              key={request.id}
              className="transform transition-all hover:scale-105"
            >
              <Card
                title={request.title}
                description={request.description}
                category={request.category}
                project={request.project}
                intraName={request.user}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
