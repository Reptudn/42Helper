"use client";

import React, { useEffect, useRef, useState } from "react";
import Card from "@/components/Card";
import { PBItem } from "../page";

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
  category: ["help needed", "offer help", "test evaluation"][i % 3],
  project: ["libft", "ft_printf", "get_next_line", "push_swap", "minishell"][
    i % 5
  ],
  userImageUrl: "https://via.placeholder.com/150",
  intraName: `user${i + 1}`,
}));

export default function VisualizerPage() {
  const [offers] = useState<PBItem[]>(SAMPLE);
  const [requests] = useState<PBItem[]>(SAMPLE);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Auto-scroll refs for requests and offers
  const reqContainerRef = useRef<HTMLDivElement | null>(null);
  const reqInnerRef = useRef<HTMLDivElement | null>(null);
  const offContainerRef = useRef<HTMLDivElement | null>(null);
  const offInnerRef = useRef<HTMLDivElement | null>(null);

  // Auto-hide controls in fullscreen after 3 seconds of inactivity
  useEffect(() => {
    if (!isFullscreen) {
      setShowControls(true);
      return;
    }

    let timeout: NodeJS.Timeout;

    const resetTimeout = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    const onMouseMove = () => resetTimeout();
    const onMouseEnter = () => resetTimeout();

    resetTimeout();
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [isFullscreen]);

  // Auto-scroll effect for requests
  useEffect(() => {
    const container = reqContainerRef.current;
    const inner = reqInnerRef.current;
    if (!container || !inner) return;

    let rafId = 0;
    let last = performance.now();
    const speed = 50; // px per second

    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      // Always scroll continuously
      container.scrollTop += dt * speed;
      // Loop when we reach halfway (since content is duplicated)
      const halfHeight = inner.scrollHeight / 2;
      if (container.scrollTop >= halfHeight) {
        container.scrollTop = container.scrollTop - halfHeight;
      }

      rafId = requestAnimationFrame(step);
    };

    // Small delay to ensure DOM is ready
    const timeout = setTimeout(() => {
      rafId = requestAnimationFrame(step);
    }, 100);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafId);
    };
  }, []); // Empty deps to prevent re-initialization

  // Auto-scroll effect for offers
  useEffect(() => {
    const container = offContainerRef.current;
    const inner = offInnerRef.current;
    if (!container || !inner) return;

    let rafId = 0;
    let last = performance.now();
    const speed = 50; // px per second

    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      // Always scroll continuously
      container.scrollTop += dt * speed;
      // Loop when we reach halfway (since content is duplicated)
      const halfHeight = inner.scrollHeight / 2;
      if (container.scrollTop >= halfHeight) {
        container.scrollTop = container.scrollTop - halfHeight;
      }

      rafId = requestAnimationFrame(step);
    };

    // Small delay to ensure DOM is ready
    const timeout = setTimeout(() => {
      rafId = requestAnimationFrame(step);
    }, 100);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafId);
    };
  }, []); // Empty deps to prevent re-initialization

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
      className={`${
        isFullscreen ? "w-screen h-screen bg-black" : "w-full min-h-screen"
      } flex flex-col relative`}
      ref={containerRef}
    >
      {/* Header with gradient background - always visible */}
      <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="bg-gradient-to-b from-black via-black/95 to-transparent pb-4">
          <div className="relative w-full py-4 px-8">
            {/* Fullscreen button - positioned absolute top-right */}
            <button
              className={`absolute top-4 right-8 z-50 pointer-events-auto btn btn-primary btn-sm shadow-2xl hover:scale-105 transition-all hover:shadow-cyan-500/50 border border-cyan-500/30 ${
                isFullscreen && !showControls
                  ? "opacity-0 pointer-events-none"
                  : "opacity-100"
              }`}
              onClick={() =>
                isFullscreen ? exitFullscreen() : enterFullscreen()
              }
            >
              {isFullscreen ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Exit (Esc)
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Fullscreen
                </>
              )}
            </button>

            {/* Title - centered */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white drop-shadow-2xl mb-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                42 Helper
              </h1>
              <p className="text-xs text-neutral-400 tracking-wide">
                A platform that connects 42 students who need help with those
                eager to offer it.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 flex overflow-hidden pt-20">
        {/* Left: Requests */}
        <div className="w-1/2 flex flex-col border-r border-neutral-800 overflow-hidden relative">
          <div className="px-8 py-6 z-30 bg-black border-b border-cyan-500/50 sticky top-0">
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-cyan-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Requests
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  I need help with...
                </p>
              </div>
            </div>
          </div>

          {/* Gradient fade overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />

          <div
            ref={reqContainerRef}
            className="flex-1 overflow-y-auto scrollbar-hide"
            style={{
              maxHeight: "100%",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div ref={reqInnerRef} className="px-6 pb-8 pt-2">
              {/* render two copies for seamless looping */}
              {[0, 1].map((copy) => (
                <div
                  key={copy}
                  className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6 mb-8"
                >
                  {requests.length > 0 ? (
                    requests.map((item) => (
                      <div key={`${item.id}-${copy}`} className="w-full">
                        <Card
                          title={item.title ?? "Unknown Title"}
                          description={item.description ?? ""}
                          category={item.category ?? "Unknown Category"}
                          project={item.project ?? "other"}
                          userImageUrl={
                            item.userImageUrl ??
                            item.avatar ??
                            item.imageUrl ??
                            "https://via.placeholder.com/150"
                          }
                          intraName={
                            item.intraName ??
                            item.owner ??
                            item.user ??
                            "anonymous"
                          }
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-neutral-400">
                      No requests available at the moment.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Offers */}
        <div className="w-1/2 flex flex-col overflow-hidden relative">
          <div className="px-8 py-6 z-30 bg-black border-b border-purple-500/50 sticky top-0">
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-purple-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
              </svg>
              <div>
                <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  Offers
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  I can help with...
                </p>
              </div>
            </div>
          </div>

          {/* Gradient fade overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />

          <div
            ref={offContainerRef}
            className="flex-1 overflow-y-auto scrollbar-hide"
            style={{
              maxHeight: "100%",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div ref={offInnerRef} className="px-6 pb-8 pt-2">
              {[0, 1].map((copy) => (
                <div
                  key={copy}
                  className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6 mb-8"
                >
                  {offers.length > 0 ? (
                    offers.map((item) => (
                      <div key={`${item.id}-${copy}`} className="w-full">
                        <Card
                          title={item.title ?? "Unknown Title"}
                          description={item.description ?? ""}
                          category={item.category ?? "Unknown Category"}
                          project={item.project ?? "other"}
                          userImageUrl={
                            item.userImageUrl ??
                            item.avatar ??
                            item.imageUrl ??
                            "https://via.placeholder.com/150"
                          }
                          intraName={
                            item.intraName ??
                            item.owner ??
                            item.user ??
                            "anonymous"
                          }
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-neutral-400">
                      No offers available at the moment.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
