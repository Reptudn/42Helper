"use client";

import React, { useState, useEffect } from "react";
import { PostType, PostSubtype, ProjectType, PostItem } from "../types/posts";
import { useAuth } from "../contexts/AuthContext";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPost: (post: PostItem) => void;
}

export default function CreatePostModal({
  isOpen,
  onClose,
  onAddPost,
}: CreatePostModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [postType, setPostType] = useState<PostType>("request");
  const [subtype, setSubtype] = useState<PostSubtype>("i need help with");
  const [project, setProject] = useState<ProjectType>("libft");
  const { user } = useAuth();

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) return;
    if (!user || !user.id) {
      console.error("User must be logged in to create posts");
      return;
    }

    const item: PostItem = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      type: postType,
      subtype: subtype,
      project: project,
      createdAt: new Date().toISOString(),
      user: user.name || user.email || "Anonymous", // Simple text username
    };

    onAddPost(item);

    // Reset form
    setTitle("");
    setDescription("");
    setPostType("request");
    setSubtype("i need help with");
    setProject("libft");
    onClose();
  };

  return (
    <>
      {/* Modal backdrop and content */}
      <div className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div className="modal-box w-11/12 max-w-2xl bg-black border-2 border-blue-500/30 shadow-2xl shadow-blue-500/20">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-blue-500/30">
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="font-bold text-2xl bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                Create New Post
              </h3>
            </div>
            <button
              className="btn btn-sm btn-circle btn-ghost text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          <div className="space-y-5">
            {/* Post Type Selection */}
            <div>
              <label className="label">
                <span className="label-text text-white font-medium flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Post Type
                </span>
              </label>
              <select
                value={postType}
                onChange={(e) => {
                  const newType = e.target.value as PostType;
                  setPostType(newType);
                  // Auto-set appropriate subtype based on main type
                  if (newType === "offer") {
                    setSubtype("i can help with");
                  } else {
                    setSubtype("i need help with");
                  }
                }}
                className="select select-bordered w-full bg-neutral-900 border-neutral-700 text-white focus:border-blue-500/50 focus:outline-none transition-all"
              >
                <option value="request">Request</option>
                <option value="offer">Offer</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="label">
                <span className="label-text text-white font-medium flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-cyan-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Title
                </span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-bordered w-full bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-cyan-500/50 focus:outline-none transition-all"
                placeholder="Enter title..."
              />
            </div>

            {/* Subtype Selection */}
            <div>
              <label className="label">
                <span className="label-text text-white font-medium flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-purple-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Category
                </span>
              </label>
              <select
                value={subtype}
                onChange={(e) => setSubtype(e.target.value as PostSubtype)}
                className="select select-bordered w-full bg-neutral-900 border-neutral-700 text-white focus:border-purple-500/50 focus:outline-none transition-all"
              >
                {postType === "offer" ? (
                  <>
                    <option value="i can help with">I can help with</option>
                    <option value="i can do a test eval for">
                      I can do a test eval for
                    </option>
                  </>
                ) : (
                  <>
                    <option value="i need help with">I need help with</option>
                    <option value="i need a test evaluation for">
                      I need a test evaluation for
                    </option>
                  </>
                )}
              </select>
            </div>

            {/* Project Selection */}
            <div>
              <label className="label">
                <span className="label-text text-white font-medium flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                  Project
                </span>
              </label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value as ProjectType)}
                className="select select-bordered w-full bg-neutral-900 border-neutral-700 text-white focus:border-green-500/50 focus:outline-none transition-all"
              >
                <option value="libft">libft</option>
                <option value="ft_printf">ft_printf</option>
                <option value="get_next_line">get_next_line</option>
                <option value="born2beroot">born2beroot</option>
                <option value="so_long">so_long</option>
                <option value="pipex">pipex</option>
                <option value="push_swap">push_swap</option>
                <option value="minishell">minishell</option>
                <option value="philosophers">philosophers</option>
                <option value="cub3d">cub3d</option>
                <option value="cpp">CPP modules</option>
                <option value="webserv">webserv</option>
                <option value="inception">inception</option>
                <option value="other">Other</option>
                <option value="fun">Fun :D</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="label">
                <span className="label-text text-white font-medium flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Description
                </span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea textarea-bordered w-full bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-yellow-500/50 focus:outline-none transition-all"
                placeholder="Enter description..."
                rows={4}
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-action mt-8 pt-4 border-t border-neutral-800">
            <button
              className="btn btn-ghost border border-neutral-700 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition-all"
              onClick={onClose}
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Cancel
            </button>
            <button
              className="btn btn-primary border border-blue-500/50 hover:scale-105 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:hover:scale-100"
              onClick={handleSubmit}
              disabled={!title.trim() || !description.trim()}
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Create Post
            </button>
          </div>
        </div>
        <div
          className="modal-backdrop bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        ></div>
      </div>
    </>
  );
}
