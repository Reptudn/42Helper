"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/Card";
import { pb } from "@/lib/pocketbaseClient";
import { config } from "@/lib/config";
import Link from "next/link";

export type PBItem = {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  project?: string;
  userId?: string;
  tags?: string[];
  created?: string;
  collection?: string;
  userImageUrl?: string;
  avatar?: string;
  imageUrl?: string;
  intraName?: string;
  owner?: string;
  user?: string;
  expand?: {
    userId?: {
      id: string;
      login: string;
      image?: string;
      [key: string]: unknown;
    };
  };
} & Record<string, unknown>;

export default function Home() {
  const [requests, setRequests] = useState<PBItem[]>([]);
  const [offers, setOffers] = useState<PBItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const showAmount = 6;

  useEffect(() => {
    const controller = new AbortController();

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        // Try PocketBase first with expanded user data
        const [reqs, offs] = await Promise.all([
          pb
            .collection(config.collections.requests)
            .getFullList<PBItem>(200, {
              signal: controller.signal,
              expand: "userId",
            })
            .catch(() => []),
          pb
            .collection(config.collections.offers)
            .getFullList<PBItem>(200, {
              signal: controller.signal,
              expand: "userId",
            })
            .catch(() => []),
        ]);

        // If PocketBase returned data, use it; otherwise fall back to localStorage
        if (reqs && reqs.length > 0) setRequests(reqs as PBItem[]);
        else {
          const raw = localStorage.getItem("my_requests_v1");
          if (raw) setRequests(JSON.parse(raw));
        }

        if (offs && offs.length > 0) setOffers(offs as PBItem[]);
        else {
          const raw = localStorage.getItem("my_offers_v1");
          if (raw) setOffers(JSON.parse(raw));
        }
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Unknown error fetching items");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchAll();
    return () => controller.abort();
  }, []);

  return (
    <div className="flex-1 w-full bg-black overflow-hidden flex flex-col">
      {/* Hero Section - Compact */}
      <div className="relative py-8 px-8 text-center border-b border-neutral-800 shrink-0">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          Welcome to 42 Helper
        </h1>
        <p className="text-sm text-neutral-400 mb-4">
          Connect with 42 students - get help or offer it
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/my-posts"
            className="btn btn-primary btn-sm shadow-xl hover:scale-105 transition-all border border-cyan-500/30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create Post
          </Link>
          <Link
            href="/visualizer"
            className="btn btn-outline btn-sm shadow-xl hover:scale-105 transition-all border border-purple-500/50 hover:bg-purple-500/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            Visualizer
          </Link>
        </div>
      </div>

      {loading && (
        <div className="flex-1 flex justify-center items-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}
      {error && (
        <div className="alert alert-error max-w-2xl mx-auto m-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {!loading && (
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Requests */}
          <div className="w-1/2 flex flex-col border-r border-neutral-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-cyan-500/30 bg-black">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-cyan-400"
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
                    <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      Recent Requests
                    </h2>
                    <p className="text-xs text-neutral-400">Need help</p>
                  </div>
                </div>
                <Link
                  href="/requests"
                  className="btn btn-outline btn-xs border-cyan-500/50 hover:bg-cyan-500/10"
                >
                  View All
                </Link>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {requests.length > 0 ? (
                  requests.slice(0, showAmount).map((item) => (
                    <div key={item.id} className="w-full">
                      <Card
                        title={item.title ?? "Unknown Title"}
                        description={item.description ?? ""}
                        category={item.category ?? "Unknown Category"}
                        project={item.project ?? "other"}
                        userImageUrl={
                          item.expand?.userId?.login
                            ? `https://cdn.intra.42.fr/users/${item.expand.userId.login}.jpg`
                            : item.userImageUrl ?? item.avatar ?? item.imageUrl
                        }
                        intraName={
                          item.expand?.userId?.login ??
                          item.intraName ??
                          item.owner ??
                          item.user ??
                          "anonymous"
                        }
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-neutral-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto mb-3 opacity-50"
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
                    <p className="text-sm">No requests available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Offers */}
          <div className="w-1/2 flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-purple-500/30 bg-black">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                  </svg>
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                      Recent Offers
                    </h2>
                    <p className="text-xs text-neutral-400">Can help</p>
                  </div>
                </div>
                <Link
                  href="/offers"
                  className="btn btn-outline btn-xs border-purple-500/50 hover:bg-purple-500/10"
                >
                  View All
                </Link>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {offers.length > 0 ? (
                  offers.slice(0, showAmount).map((item) => (
                    <div key={item.id} className="w-full">
                      <Card
                        title={item.title ?? "Unknown Title"}
                        description={item.description ?? ""}
                        category={item.category ?? "Unknown Category"}
                        project={item.project ?? "other"}
                        userImageUrl={
                          item.expand?.userId?.login
                            ? `https://cdn.intra.42.fr/users/${item.expand.userId.login}.jpg`
                            : item.userImageUrl ?? item.avatar ?? item.imageUrl
                        }
                        intraName={
                          item.expand?.userId?.login ??
                          item.intraName ??
                          item.owner ??
                          item.user ??
                          "anonymous"
                        }
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-neutral-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto mb-3 opacity-50"
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
                    <p className="text-sm">No offers available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
