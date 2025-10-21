"use client";

import React, { useEffect, useState } from "react";
import CreatePostModal from "../../components/CreatePostModal";
import { PostItem } from "../../types/posts";

const STORAGE_KEY = "my_posts_v1";

export default function MyPostsPage() {
  const [items, setItems] = useState<PostItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to read posts from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to store posts", e);
    }
  }, [items]);

  const addPost = (newPost: PostItem) => {
    setItems((s) => [newPost, ...s]);
  };

  const removePost = (id: string) =>
    setItems((s) => s.filter((i) => i.id !== id));

  return (
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

      {/* Posts List */}
      <div className="space-y-4">
        {items.length === 0 && (
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

        {items.map((it) => (
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
  );
}
