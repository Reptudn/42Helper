"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/Card";
import { pb } from "@/lib/pocketbaseClient";
import { config } from "@/lib/config";

type PBItem = {
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
              expand: "userId"
            })
            .catch(() => []),
          pb
            .collection(config.collections.offers)
            .getFullList<PBItem>(200, { 
              signal: controller.signal,
              expand: "userId"
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

  const combined = [
    ...offers.map((o) => ({ ...o, _kind: "offer" })),
    ...requests.map((r) => ({ ...r, _kind: "request" })),
  ];

  return (
    <div className="flex-1">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-white">Live Board</h1>
        <p className="text-neutral-400 mt-2">
          All requests and offers (full info). Data comes from PocketBase when
          available, otherwise local data.
        </p>
      </div>

        {loading && <div className="text-neutral-400">Loading...</div>}
        {error && <div className="text-error">{error}</div>}

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {combined.map((item) => (
            <div key={item.id} className="w-full">
              <Card
                title={item.title ?? item.collection ?? item._kind}
                description={item.description ?? ""}
                category={item.category ?? item._kind ?? ""}
                project={item.project ?? "other"}
                userImageUrl={
                  item.expand?.userId?.login 
                    ? `https://cdn.intra.42.fr/users/${item.expand.userId.login}.jpg`
                    : item.userImageUrl ?? item.avatar ?? item.imageUrl ?? undefined
                }
                intraName={
                  item.expand?.userId?.login ?? item.intraName ?? item.owner ?? item.user ?? undefined
                }
              />
              <div className="mt-2 text-sm text-neutral-400">
                <div>Type: {item._kind}</div>
                {item.created && (
                  <div>Created: {new Date(item.created).toLocaleString()}</div>
                )}
              </div>
            </div>
          ))}
        </section>
    </div>
  );
}
