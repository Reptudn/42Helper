"use client";

import React, { useEffect, useState, useCallback } from "react";
import CreatePostModal from "../../components/CreatePostModal";
import ProtectedRoute from "../../components/ProtectedRoute";
import { PostItem, PostSubtype, ProjectType } from "../../types/posts";
import { pb } from "../../lib/pocketbaseClient";
import { config } from "../../lib/config";
import { useAuth } from "../../contexts/AuthContext";

// Database record type (matches your PocketBase structure)
interface DBPost {
  id: string;
  title: string;
  description: string;
  category: string;
  project: string;
  created: string;
  updated: string;
}

export default function MyPostsPage() {
  const [items, setItems] = useState<PostItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Convert database record to PostItem
  const dbPostToPostItem = (
    dbPost: DBPost,
    type: "offer" | "request"
  ): PostItem => ({
    id: dbPost.id,
    title: dbPost.title,
    description: dbPost.description,
    type: type,
    subtype: dbPost.category as PostSubtype, // Map category to subtype
    project: dbPost.project as ProjectType,
    createdAt: dbPost.created,
  });

  // Convert PostItem to database record
  const postItemToDBPost = (postItem: PostItem) => ({
    title: postItem.title,
    description: postItem.description,
    category: postItem.subtype,
    project: postItem.project,
  });

  // Fetch all user posts from both collections
  const fetchMyPosts = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch from both collections in parallel
      const [offers, requests] = await Promise.all([
        pb
          .collection(config.collections.offers)
          .getFullList<DBPost>(200)
          .catch(() => []),
        pb
          .collection(config.collections.requests)
          .getFullList<DBPost>(200)
          .catch(() => []),
      ]);

      // Convert to PostItems and combine
      const offerItems = offers.map((post) => dbPostToPostItem(post, "offer"));
      const requestItems = requests.map((post) =>
        dbPostToPostItem(post, "request")
      );

      // Sort by creation date (newest first)
      const allItems = [...offerItems, ...requestItems].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setItems(allItems);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load posts on component mount
  useEffect(() => {
    fetchMyPosts();
  }, [fetchMyPosts]);

  const addPost = async (newPost: PostItem) => {
    if (!user) {
      setError("You must be logged in to create posts");
      return;
    }

    try {
      setError(null);

      // Determine which collection to use based on post type
      const collection =
        newPost.type === "offer"
          ? config.collections.offers
          : config.collections.requests;

      // Create the post in PocketBase
      const dbData = postItemToDBPost(newPost);
      const createdPost = await pb
        .collection(collection)
        .create<DBPost>(dbData);

      // Convert back to PostItem and add to local state
      const createdPostItem = dbPostToPostItem(createdPost, newPost.type);
      setItems((prevItems) => [createdPostItem, ...prevItems]);

      console.log(`Successfully created ${newPost.type} post:`, createdPost);
    } catch (err) {
      console.error("Failed to create post:", err);
      setError(err instanceof Error ? err.message : "Failed to create post");
    }
  };

  const removePost = async (id: string) => {
    if (!user) {
      setError("You must be logged in to delete posts");
      return;
    }

    try {
      setError(null);

      // Find the post to determine which collection it belongs to
      const post = items.find((item) => item.id === id);
      if (!post) return;

      const collection =
        post.type === "offer"
          ? config.collections.offers
          : config.collections.requests;

      // Delete from PocketBase
      await pb.collection(collection).delete(id);

      // Remove from local state
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));

      console.log(`Successfully deleted ${post.type} post:`, id);
    } catch (err) {
      console.error("Failed to delete post:", err);
      setError(err instanceof Error ? err.message : "Failed to delete post");
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex-1 w-full bg-black p-8">
        {/* Header with gradient */}
        <div className="mb-8 pb-4 border-b border-blue-500/30">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                  My Posts
                </h1>
                <p className="text-sm text-neutral-400 mt-1">
                  Manage your requests and offers
                </p>
              </div>
            </div>
            <button
              className="btn btn-primary btn-lg border border-blue-500/50 hover:scale-105 transition-all shadow-lg shadow-blue-500/20"
              onClick={() => setIsModalOpen(true)}
              title="Create new post"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Post
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-600/50 text-red-300 px-6 py-4 rounded-lg mb-6">
            <p className="font-semibold text-red-400">Error:</p>
            <p className="mt-2">{error}</p>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-4">
          {loading && (
            <div className="flex justify-center items-center py-20">
              <span className="loading loading-spinner loading-lg text-blue-400"></span>
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="text-center py-20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto mb-4 opacity-50 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-neutral-400 text-lg mb-6">No posts yet</p>
              <button
                className="btn btn-primary border border-blue-500/50 hover:scale-105 transition-all"
                onClick={() => setIsModalOpen(true)}
              >
                Create your first post
              </button>
            </div>
          )}

          {!loading &&
            items.map((it) => (
              <div
                key={it.id}
                className="card bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-neutral-800 hover:border-neutral-600 transition-all hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span
                        className={`badge ${
                          it.type === "offer"
                            ? "badge-success border-purple-500/50 bg-purple-500/20 text-purple-300"
                            : "badge-info border-cyan-500/50 bg-cyan-500/20 text-cyan-300"
                        }`}
                      >
                        {it.type}
                      </span>
                      <span className="badge badge-outline border-neutral-600 text-neutral-300 text-xs">
                        {it.subtype}
                      </span>
                      <span className="badge badge-outline border-blue-500/50 text-blue-300 text-xs">
                        {it.project}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {new Date(it.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">
                      {it.title}
                    </h3>

                    <p className="text-neutral-300">{it.description}</p>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button className="btn btn-sm btn-ghost border border-neutral-700 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400 transition-all">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      className="btn btn-sm btn-error border border-red-500/50 bg-red-500/20 hover:bg-red-500/30 transition-all"
                      onClick={() => removePost(it.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Create Post Modal */}
        <CreatePostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddPost={addPost}
        />
      </div>
    </ProtectedRoute>
  );
}
