"use client";

import { useEffect, useState } from "react";
import { pb } from "../../lib/pocketbaseClient";
import { config } from "../../lib/config";
import Card from "../../components/Card";

interface HelpPost {
  id: string;
  title: string;
  description: string;
  category: string;
  project: string;
  user: string; // Simple text field
  created: string;
  updated: string;
}

export default function OfferHelpPage() {
  const [posts, setPosts] = useState<HelpPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create an AbortController to handle cleanup
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching from ${config.collections.offers} collection...`);

        // Add a small delay to prevent rapid requests
        await new Promise((resolve) => setTimeout(resolve, 100));

        const records = await pb
          .collection(config.collections.offers)
          .getFullList<HelpPost>(200, {
            // Pass the abort signal to cancel the request if component unmounts
            signal: controller.signal,
          });

        console.log("Successfully fetched records:", records);
        setPosts(records);
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
      <div className="mb-8 pb-4 border-b border-purple-500/30">
        <div className="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-purple-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
          </svg>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              All Offers
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Students ready to help
            </p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <span className="loading loading-spinner loading-lg text-purple-400"></span>
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
              className="underline text-purple-400 hover:text-purple-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              PocketBase Admin
            </a>{" "}
            → Collections → {config.collections.offers} → API Rules and set
            List/Search rule to empty string (&quot;&quot;) for public access.
          </p>
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto mb-4 opacity-50 text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <p className="text-neutral-400 text-lg">No offers yet.</p>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="transform transition-all hover:scale-105"
            >
              <Card
                title={post.title}
                description={post.description}
                category={post.category}
                project={post.project}
                intraName={post.user}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
