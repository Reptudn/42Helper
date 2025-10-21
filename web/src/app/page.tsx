"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/Card";
import { pb } from "@/lib/pocketbaseClient";
import { config } from "@/lib/config";
import Link from "next/link";

type PBItem = {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  project?: string;
  tags?: string[];
  created?: string;
  collection?: string;
  userImageUrl?: string;
  avatar?: string;
  imageUrl?: string;
  intraName?: string;
  owner?: string;
  user?: string;
} & Record<string, unknown>;

export default function Home() {
  const [requests, setRequests] = useState<PBItem[]>([]);
  const [offers, setOffers] = useState<PBItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const showAmount = 3;

  useEffect(() => {
    const controller = new AbortController();

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        // Try PocketBase first
        const [reqs, offs] = await Promise.all([
          pb
            .collection(config.collections.requests)
            .getFullList<PBItem>(showAmount, { signal: controller.signal })
            .catch(() => []),
          pb
            .collection(config.collections.offers)
            .getFullList<PBItem>(showAmount, { signal: controller.signal })
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
    <div className="flex-1">
      <div className="m-6">
        <h1 className="text-4xl font-bold text-white">Welcome to 42 Helper</h1>
        <h3 className="text-xl text-white">
          A platform that connects 42 students who need help with those eager to
          offer it.
        </h3>
      </div>
      <hr />
      {loading && <div className="text-neutral-400">Loading...</div>}
      {error && <div className="text-error">{error}</div>}

      <h2 className="text-xl text-white mt-6">
        Requests ("I need help with...")
      </h2>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {requests.length > 0 ? (
          requests.map((item) => (
            <div key={item.id} className="w-full">
              <Card
                title={item.title ?? "Unknown Title"}
                description={item.description ?? ""}
                category={item.category ?? "Unknown Category"}
                project={item.project ?? "other"}
                userImageUrl={
                  item.userImageUrl ??
                  item.avatar ??
                  item.imageUrl ??
                  "https://via.placeholder.com/150"
                }
                intraName={
                  item.intraName ?? item.owner ?? item.user ?? "anonymous"
                }
              />
              <div className="mt-2 text-sm text-neutral-400">
                {item.created && (
                  <div>Created: {new Date(item.created).toLocaleString()}</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-neutral-400">
            No requests available at the moment.
          </div>
        )}
        <Link
          href="/requests"
          className="w-full h-full border border-white/20 rounded-md p-2 flex items-center justify-center btn btn-ghost btn-sm rounded-md text-neutral-300 hover:bg-neutral-800/40 hover:text-white transition"
        >
          See more Requests
        </Link>
      </section>

      <h2 className="text-xl text-white">Offers ("I can help with...")</h2>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {offers.length > 0 ? (
          offers.map((item) => (
            <div key={item.id} className="w-full">
              <Card
                title={item.title ?? "Unknown Title"}
                description={item.description ?? ""}
                category={item.category ?? "Unknown Category"}
                project={item.project ?? "other"}
                userImageUrl={
                  item.userImageUrl ??
                  item.avatar ??
                  item.imageUrl ??
                  "https://via.placeholder.com/150"
                }
                intraName={
                  item.intraName ?? item.owner ?? item.user ?? "anonymous"
                }
              />
              <div className="mt-2 text-sm text-neutral-400">
                {item.created && (
                  <div>Created: {new Date(item.created).toLocaleString()}</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-neutral-400">
            No offers available at the moment.
          </div>
        )}
        <Link
          href="/offers"
          className="w-full h-full border border-white/20 rounded-md p-2 flex items-center justify-center btn btn-ghost btn-sm rounded-md text-neutral-300 hover:bg-neutral-800/40 hover:text-white transition"
        >
          See more Offers
        </Link>
      </section>
    </div>
  );
}
