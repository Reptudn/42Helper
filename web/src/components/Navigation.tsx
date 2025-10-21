"use client";

import Link from "next/link";
import AuthNavigation from "./AuthNavigation";
import { useAuth } from "../contexts/AuthContext";

export default function Navigation() {
  const { user } = useAuth();

  return (
    <header className="bg-black/95 backdrop-blur-sm border-b border-neutral-800 px-8 py-4 shrink-0">
      <div className="w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          {/* Brand with gradient */}
          <Link href="/" className="flex items-center gap-3 no-underline group">
            <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
              42 Helper
            </span>
          </Link>

          {/* Nav buttons with neon hover effects */}
          <nav className="hidden sm:flex items-center gap-2">
            <Link
              href="/requests"
              className="btn btn-ghost btn-sm rounded-md text-neutral-300 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/50 transition-all border border-transparent"
            >
              Requests
            </Link>
            <Link
              href="/offers"
              className="btn btn-ghost btn-sm rounded-md text-neutral-300 hover:bg-purple-500/10 hover:text-purple-400 hover:border-purple-500/50 transition-all border border-transparent"
            >
              Offers
            </Link>
            {user && (
              <Link
                href="/my-posts"
                className="btn btn-ghost btn-sm rounded-md text-neutral-300 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/50 transition-all border border-transparent"
              >
                My Posts
              </Link>
            )}
            <Link
              href="/visualizer"
              className="btn btn-ghost btn-sm rounded-md text-neutral-300 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-purple-500/10 hover:text-white hover:border-neutral-600 transition-all border border-transparent"
            >
              Visualizer
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <AuthNavigation />
        </div>
      </div>
    </header>
  );
}
