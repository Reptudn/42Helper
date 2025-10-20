import Link from "next/link";
import AuthNavigation from "./AuthNavigation";

export default function Navigation() {
  return (
    <header className="bg-neutral-900/40 backdrop-blur-sm border-b border-neutral-800 p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          {/* Brand badge + name */}
          <Link href="/" className="flex items-center gap-3 no-underline">
            {/* <div className="w-10 h-10 rounded-md bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-sm font-extrabold text-black shadow-md">
              42
            </div> */}
            <span className="text-2xl font-bold text-white">
              42 Helper
            </span>
          </Link>

          {/* Nav buttons */}
          <nav className="hidden sm:flex items-center gap-2">
            <Link
              href="/requests"
              className="btn btn-ghost btn-sm rounded-md text-neutral-300 hover:bg-neutral-800/40 hover:text-white transition"
            >
              Requests
            </Link>
            <Link
              href="/offers"
              className="btn btn-ghost btn-sm rounded-md text-neutral-300 hover:bg-neutral-800/40 hover:text-white transition"
            >
              Offers
            </Link>
            <Link
              href="/my-posts"
              className="btn btn-ghost btn-sm rounded-md text-neutral-300 hover:bg-neutral-800/40 hover:text-white transition"
            >
              My Posts
            </Link>
            <Link
              href="/visualizer"
              className="btn btn-ghost btn-sm rounded-md text-neutral-300 hover:bg-neutral-800/40 hover:text-white transition"
            >
              Visualizer
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* <LoginWithIntra href="/api/auth/intra" /> */}
          <AuthNavigation />
        </div>
      </div>
    </header>
  );
}
