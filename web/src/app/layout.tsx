import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "../contexts/AuthContext";
import AuthNavigation from "../components/AuthNavigation";
import LoginWithIntra from "@/components/LoginWithIntra";

export const metadata = {
  title: "42 Helper",
  description:
    "A platform that connects 42 students who need help with those eager to offer it — whether for fun, collaboration, or project work.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="antialiased bg-base-200 text-base-content min-h-screen flex flex-col"
        data-theme="dark"
      >
        <AuthProvider>
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
                    href="/my-requests"
                    className="btn btn-ghost btn-sm rounded-md text-neutral-300 hover:bg-neutral-800/40 hover:text-white transition"
                  >
                    My Requests
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

          <main className="flex-1 min-h-0 w-full">
            <div className="max-w-6xl mx-auto p-6 flex flex-col min-h-0">
              {children}
            </div>
          </main>

          <footer className="bg-neutral-900/40 backdrop-blur-sm border-t border-neutral-800 p-4 mt-auto">
            <div className="max-w-6xl mx-auto text-center text-sm text-neutral-500">
              &copy; {new Date().getFullYear()} 42 Helper @
              <span className="ml-2 space-x-2">
                <a
                  href="https://intra.42.fr/users/jkauker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-300 hover:text-white underline"
                >
                  jkauker
                </a>
                <span className="text-neutral-500">,</span>
                <a
                  href="https://intra.42.fr/users/lseeger"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-300 hover:text-white underline"
                >
                  lseeger
                </a>
                <span className="text-neutral-500">,</span>
                <a
                  href="https://intra.42.fr/users/lbohm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-300 hover:text-white underline"
                >
                  lbohm
                </a>
                <span className="text-neutral-500">,</span>
                <a
                  href="https://intra.42.fr/users/lglauch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-300 hover:text-white underline"
                >
                  lglauch
                </a>
              </span>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
