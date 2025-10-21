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
  userId: string; // User ID relationship
  created: string;
  updated: string;
  // Expanded user data from relationship
  expand?: {
    userId?: {
      id: string;
      login: string;
      image?: string;
      [key: string]: unknown;
    };
  };
}

export default function MyPostsPage() {
  const [items, setItems] = useState<PostItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Convert database record to PostItem
  const dbPostToPostItem = (dbPost: DBPost, type: "offer" | "request"): PostItem => ({
    id: dbPost.id,
    title: dbPost.title,
    description: dbPost.description,
    type: type,
    subtype: dbPost.category as PostSubtype, // Map category to subtype
    project: dbPost.project as ProjectType,
    createdAt: dbPost.created,
    userId: dbPost.userId,
    expand: dbPost.expand, // Include expanded user data
  });

  // Convert PostItem to database record (only the fields we can create)
  const postItemToDBPost = (postItem: PostItem) => ({
    title: postItem.title,
    description: postItem.description,
    category: postItem.subtype,
    project: postItem.project,
    userId: postItem.userId, // This creates the relationship
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

      // Fetch from both collections in parallel, filtering by current user and expanding user data
      const [offers, requests] = await Promise.all([
        pb.collection(config.collections.offers).getFullList<DBPost>(200, {
          filter: `userId = "${user.id}"`,
          expand: "userId" // Expand the user relationship
        }).catch(() => []),
        pb.collection(config.collections.requests).getFullList<DBPost>(200, {
          filter: `userId = "${user.id}"`,
          expand: "userId" // Expand the user relationship
        }).catch(() => []),
      ]);

      // Convert to PostItems and combine
      const offerItems = offers.map(post => dbPostToPostItem(post, "offer"));
      const requestItems = requests.map(post => dbPostToPostItem(post, "request"));
      
      // Sort by creation date (newest first)
      const allItems = [...offerItems, ...requestItems].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
      const collection = newPost.type === "offer" 
        ? config.collections.offers 
        : config.collections.requests;
      
      // Create the post in PocketBase
      const dbData = postItemToDBPost(newPost);
      const createdPost = await pb.collection(collection).create<DBPost>(dbData);
      
      // Convert back to PostItem and add to local state
      const createdPostItem = dbPostToPostItem(createdPost, newPost.type);
      setItems(prevItems => [createdPostItem, ...prevItems]);
      
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
      const post = items.find(item => item.id === id);
      if (!post) return;

      const collection = post.type === "offer" 
        ? config.collections.offers 
        : config.collections.requests;

      // Delete from PocketBase
      await pb.collection(collection).delete(id);
      
      // Remove from local state
      setItems(prevItems => prevItems.filter(item => item.id !== id));
      
      console.log(`Successfully deleted ${post.type} post:`, id);
    } catch (err) {
      console.error("Failed to delete post:", err);
      setError(err instanceof Error ? err.message : "Failed to delete post");
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex-1 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">My Posts</h1>
          <button
            className="btn btn-primary btn-circle btn-lg"
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
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/40 border border-red-600 text-red-300 px-4 py-3 rounded mb-4">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-4">
          {loading && (
            <div className="text-center py-12">
              <div className="text-neutral-400 text-lg">
                Loading your posts...
              </div>
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="text-center py-12">
              <div className="text-neutral-400 text-lg mb-4">
                No posts yet
              </div>
              <button
                className="btn btn-primary"
                onClick={() => setIsModalOpen(true)}
              >
                Create your first post
              </button>
            </div>
          )}

          {!loading && items.map((it) => (
            <div
              key={it.id}
              className="card bg-neutral-900/60 p-6 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`badge ${it.type === 'offer' ? 'badge-success' : 'badge-info'}`}>
                      {it.type}
                    </span>
                    <span className="badge badge-outline text-xs">
                      {it.subtype}
                    </span>
                    <span className="badge badge-secondary text-xs">
                      {it.project}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {new Date(it.createdAt).toLocaleString()}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">
                    {it.title}
                  </h3>
                  
                  <p className="text-neutral-300 mb-4">{it.description}</p>
                </div>

                <div className="flex gap-2 ml-4">
                  <button className="btn btn-sm btn-ghost">
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
                    className="btn btn-sm btn-error"
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
