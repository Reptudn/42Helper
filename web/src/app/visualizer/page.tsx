"use client";

import React, { useEffect, useRef, useState } from "react";
import Card from "@/components/Card";

const SAMPLE = Array.from({ length: 12 }).map((_, i) => ({
  id: `s${i}`,
  title: `Project ${i + 1}`,
  description: `Short description for project ${i + 1}`,
  tags: ["help", "cpp", "review"].slice(0, (i % 3) + 1),
  userImageUrl: "https://via.placeholder.com/150",
  intraName: `user${i + 1}`,
}));

export default function VisualizerPage() {
  const [items] = useState(SAMPLE);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => {
      const fs = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(fs);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onChange();
      }
    };

    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange as any);
    document.addEventListener("mozfullscreenchange", onChange as any);
    document.addEventListener("MSFullscreenChange", onChange as any);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange as any);
      document.removeEventListener("mozfullscreenchange", onChange as any);
      document.removeEventListener("MSFullscreenChange", onChange as any);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const enterFullscreen = async () => {
    const el = containerRef.current ?? document.documentElement;
    if (el.requestFullscreen) await el.requestFullscreen();
    else if ((el as any).webkitRequestFullscreen)
      await (el as any).webkitRequestFullscreen();
    else if ((el as any).msRequestFullscreen)
      await (el as any).msRequestFullscreen();
  };

  const exitFullscreen = async () => {
    if (document.exitFullscreen) await document.exitFullscreen();
    else if ((document as any).webkitExitFullscreen)
      await (document as any).webkitExitFullscreen();
    else if ((document as any).msExitFullscreen)
      await (document as any).msExitFullscreen();
  };

  return (
    <div
      className="min-h-screen p-6 bg-neutral-900 text-white"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Visualizer</h1>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-primary"
            onClick={() =>
              isFullscreen ? exitFullscreen() : enterFullscreen()
            }
          >
            {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((it) => (
          <Card
            key={it.id}
            projectTitle={it.title}
            description={it.description}
            tags={it.tags}
            userImageUrl={it.userImageUrl}
            intraName={it.intraName}
          />
        ))}
      </div>
    </div>
  );
}
