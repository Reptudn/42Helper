"use client";

import React, { useState, useEffect } from "react";
import { PostType, PostSubtype, ProjectType, PostItem } from "../types/posts";

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
    
    const item: PostItem = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      type: postType,
      subtype: subtype,
      project: project,
      createdAt: new Date().toISOString(),
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
        <div className="modal-box w-11/12 max-w-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-white">Create New Post</h3>
            <button
              className="btn btn-sm btn-circle btn-ghost text-white"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Post Type Selection */}
            <div>
              <label className="label">
                <span className="label-text text-white">Post Type</span>
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
                className="select select-bordered w-full bg-neutral-800 text-white"
              >
                <option value="request">Request</option>
                <option value="offer">Offer</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="label">
                <span className="label-text text-white">Title</span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-bordered w-full bg-neutral-800 text-white"
                placeholder="Enter title..."
              />
            </div>

            {/* Subtype Selection */}
            <div>
              <label className="label">
                <span className="label-text text-white">Category</span>
              </label>
              <select
                value={subtype}
                onChange={(e) => setSubtype(e.target.value as PostSubtype)}
                className="select select-bordered w-full bg-neutral-800 text-white"
              >
                {postType === "offer" ? (
                  <>
                    <option value="i can help with">I can help with</option>
                    <option value="i can do a test eval for">I can do a test eval for</option>
                  </>
                ) : (
                  <>
                    <option value="i need help with">I need help with</option>
                    <option value="i need a test evaluation for">I need a test evaluation for</option>
                  </>
                )}
              </select>
            </div>

            {/* Project Selection */}
            <div>
              <label className="label">
                <span className="label-text text-white">Project</span>
              </label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value as ProjectType)}
                className="select select-bordered w-full bg-neutral-800 text-white"
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
                <span className="label-text text-white">Description</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea textarea-bordered w-full bg-neutral-800 text-white"
                placeholder="Enter description..."
                rows={4}
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-action">
            <button
              className="btn btn-error"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="btn btn-success"
              onClick={handleSubmit}
              disabled={!title.trim() || !description.trim()}
              type="button"
            >
              Create Post
            </button>
          </div>
        </div>
        <div className="modal-backdrop" onClick={onClose}></div>
      </div>
    </>
  );
}
