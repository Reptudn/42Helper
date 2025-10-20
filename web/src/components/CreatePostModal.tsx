"use client";

import React, { useState, useEffect } from "react";

type PostType = "offer" | "request";

type PostSubtype =
  | "help with project"
  | "need help with project" 
  | "test evaluation"
  | "can do test evaluation";

type PostItem = {
  id: string;
  title: string;
  description: string;
  type: PostType;
  subtype: PostSubtype;
  createdAt: string;
};

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
  const [subtype, setSubtype] = useState<PostSubtype>("need help with project");

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
      createdAt: new Date().toISOString(),
    };
    
    onAddPost(item);
    
    // Reset form
    setTitle("");
    setDescription("");
    setPostType("request");
    setSubtype("need help with project");
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
                    setSubtype("help with project");
                  } else {
                    setSubtype("need help with project");
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
                placeholder="Short title"
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
                    <option value="help with project">Help with project</option>
                    <option value="can do test evaluation">Can do test evaluation</option>
                  </>
                ) : (
                  <>
                    <option value="need help with project">Need help with project</option>
                    <option value="test evaluation">Need test evaluation</option>
                  </>
                )}
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
                placeholder="Describe what you need or can offer"
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
