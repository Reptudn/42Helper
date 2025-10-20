"use client";

import { useEffect, useState } from "react";
import { pb } from "../../lib/pocketbaseClient";

interface HelpPost {
  id: string;
  title: string;
  description: string;
}

export default function OfferHelpPage() {
  const [posts, setPosts] = useState<HelpPost[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get all records from "offers" collection
        const records = await pb.collection("offers").getFullList<HelpPost>(200);
        setPosts(records);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Offer Help</h1>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.id} className="p-4 border rounded-md">
              <h2 className="font-semibold">{post.title}</h2>
              <p className="text-gray-700">{post.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
