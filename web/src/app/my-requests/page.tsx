"use client";

import React, { useEffect, useState } from "react";

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

const STORAGE_KEY = "my_requests_v1";

export default function MyRequestsPage() {
  const [items, setItems] = useState<RequestItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [typeValue, setTypeValue] = useState<RequestType>("i need help with");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to read requests from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to store requests", e);
    }
  }, [items]);

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (!tags.includes(t)) setTags((s) => [...s, t]);
    setTagInput("");
  };

  const removeTag = (t: string) => setTags((s) => s.filter((x) => x !== t));

  const addRequest = () => {
    if (!title.trim() || !description.trim()) return;
    const item: RequestItem = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      tags,
      type: typeValue,
      createdAt: new Date().toISOString(),
    };
    setItems((s) => [item, ...s]);
    setTitle("");
    setDescription("");
    setTags([]);
  };

  const removeRequest = (id: string) =>
    setItems((s) => s.filter((i) => i.id !== id));

  return (
    <div className="flex-1">
      <div className="bg-base-100/10 p-6 rounded-xl border border-neutral-800 shadow-sm">
        <h1 className="text-2xl font-bold mb-4 text-white">My Requests</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="card bg-neutral-900/60 p-4 rounded-lg border border-neutral-800">
              <label className="label">
                <span className="label-text text-white">Type</span>
              </label>
              <select
                value={typeValue}
                onChange={(e) => setTypeValue(e.target.value as RequestType)}
                className="select select-bordered w-full max-w-xs bg-neutral-800 text-white"
              >
                <option>i can help with</option>
                <option>i need help with</option>
                <option>i need a test evaluation for</option>
                <option>i can do a test eval for</option>
              </select>

              <label className="label mt-4">
                <span className="label-text text-white">Title</span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-bordered w-full bg-neutral-800 text-white"
                placeholder="Short title"
              />

              <label className="label mt-4">
                <span className="label-text text-white">Description</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea textarea-bordered w-full bg-neutral-800 text-white"
                placeholder="Describe what you need or can offer"
                rows={4}
              />

              <label className="label mt-4">
                <span className="label-text text-white">Tags</span>
              </label>
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  className="input input-bordered w-full bg-neutral-800 text-white"
                  placeholder="press Enter to add"
                />
                <button
                  className="btn btn-primary"
                  onClick={addTag}
                  type="button"
                >
                  Add
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <button
                    key={t}
                    className="badge badge-outline badge-lg"
                    onClick={() => removeTag(t)}
                    type="button"
                  >
                    {t} ×
                  </button>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <button className="btn btn-success" onClick={addRequest}>
                  Publish Request
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setTitle("");
                    setDescription("");
                    setTags([]);
                    setTagInput("");
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="space-y-4">
              {items.length === 0 && (
                <div className="p-6 text-center text-neutral-400">
                  No requests yet — add one using the form.
                </div>
              )}

              {items.map((it) => (
                <div
                  key={it.id}
                  className="card bg-neutral-900/60 p-4 rounded-lg border border-neutral-800"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm text-neutral-300">{it.type}</div>
                      <h3 className="text-xl font-bold text-white">
                        {it.title}
                      </h3>
                      <p className="text-neutral-300 mt-2">{it.description}</p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {it.tags.map((t) => (
                          <span
                            key={t}
                            className="badge badge-sm badge-outline"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-xs text-neutral-500">
                        {new Date(it.createdAt).toLocaleString()}
                      </div>
                      <div className="flex gap-2">
                        <button className="btn btn-sm btn-ghost">Edit</button>
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => removeRequest(it.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
