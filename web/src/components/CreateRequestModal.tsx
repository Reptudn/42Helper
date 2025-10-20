"use client";

import React, { useState } from "react";

type RequestType =
  | "i can help with"
  | "i need help with"
  | "i need a test evaluation for"
  | "i can do a test eval for";

type RequestItem = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  type: RequestType;
  createdAt: string;
};

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRequest: (request: RequestItem) => void;
}

export default function CreateRequestModal({
  isOpen,
  onClose,
  onAddRequest,
}: CreateRequestModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [typeValue, setTypeValue] = useState<RequestType>("i need help with");

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (!tags.includes(t)) setTags((s) => [...s, t]);
    setTagInput("");
  };

  const removeTag = (t: string) => setTags((s) => s.filter((x) => x !== t));

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) return;
    
    const item: RequestItem = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      tags,
      type: typeValue,
      createdAt: new Date().toISOString(),
    };
    
    onAddRequest(item);
    
    // Reset form
    setTitle("");
    setDescription("");
    setTags([]);
    setTagInput("");
    setTypeValue("i need help with");
    onClose();
  };

  return (
    <>
      {/* Modal backdrop and content */}
      <div className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div className="modal-box w-11/12 max-w-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-white">Create New Request</h3>
            <button
              className="btn btn-sm btn-circle btn-ghost text-white"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Type Selection */}
            <div>
              <label className="label">
                <span className="label-text text-white">Type</span>
              </label>
              <select
                value={typeValue}
                onChange={(e) => setTypeValue(e.target.value as RequestType)}
                className="select select-bordered w-full bg-neutral-800 text-white"
              >
                <option>i can help with</option>
                <option>i need help with</option>
                <option>i need a test evaluation for</option>
                <option>i can do a test eval for</option>
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

            {/* Tags */}
            <div>
              <label className="label">
                <span className="label-text text-white">Tags</span>
              </label>
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  className="input input-bordered flex-1 bg-neutral-800 text-white"
                  placeholder="Press Enter to add tag"
                />
                <button
                  className="btn btn-primary"
                  onClick={addTag}
                  type="button"
                >
                  Add
                </button>
              </div>

              {/* Display Tags */}
              {tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <button
                      key={t}
                      className="badge badge-outline badge-lg hover:badge-error"
                      onClick={() => removeTag(t)}
                      type="button"
                    >
                      {t} ×
                    </button>
                  ))}
                </div>
              )}
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
              Create Request
            </button>
          </div>
        </div>
        <div className="modal-backdrop" onClick={onClose}></div>
      </div>
    </>
  );
}
