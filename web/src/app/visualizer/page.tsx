"use client";

import React, { useEffect, useRef, useState } from "react";
import Card from "@/components/Card";

// Helper types to avoid `any` while supporting vendor-prefixed fullscreen APIs
type PrefixedDocument = Document & {
  webkitFullscreenElement?: Element | null;
  mozFullScreenElement?: Element | null;
  msFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
  mozCancelFullScreen?: () => Promise<void> | void;
  msExitFullscreen?: () => Promise<void> | void;
};

type PrefixedElement = Element & {
  webkitRequestFullscreen?: () => Promise<void> | void;
  msRequestFullscreen?: () => Promise<void> | void;
};

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
      const doc = document as PrefixedDocument;
      const fs = !!(
        document.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      setIsFullscreen(fs);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onChange();
      }
    };

    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener(
      "webkitfullscreenchange",
      onChange as EventListener
    );
    document.addEventListener("mozfullscreenchange", onChange as EventListener);
    document.addEventListener("MSFullscreenChange", onChange as EventListener);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        onChange as EventListener
      );
      document.removeEventListener(
        "mozfullscreenchange",
        onChange as EventListener
      );
      document.removeEventListener(
        "MSFullscreenChange",
        onChange as EventListener
      );
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const enterFullscreen = async () => {
    const el = (containerRef.current ?? document.documentElement) as
      | PrefixedElement
      | Element;
    if (
      "requestFullscreen" in el &&
      typeof (el as Element).requestFullscreen === "function"
    ) {
      await (el as Element).requestFullscreen();
    } else if ((el as PrefixedElement).webkitRequestFullscreen) {
      await (el as PrefixedElement).webkitRequestFullscreen!();
    } else if ((el as PrefixedElement).msRequestFullscreen) {
      await (el as PrefixedElement).msRequestFullscreen!();
    }
  };

  const exitFullscreen = async () => {
    const doc = document as PrefixedDocument;
    if (
      "exitFullscreen" in document &&
      typeof document.exitFullscreen === "function"
    ) {
      await document.exitFullscreen();
    } else if (doc.webkitExitFullscreen) {
      await doc.webkitExitFullscreen!();
    } else if (doc.msExitFullscreen) {
      await doc.msExitFullscreen!();
    }
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
