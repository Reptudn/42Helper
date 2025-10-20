import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "42 Helper",
  description:
    "A platform that connects 42 students who need help with those eager to offer it — whether for fun, collaboration, or project work.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900">
        <header className="bg-white shadow-md p-4">
          <nav className="max-w-6xl mx-auto flex space-x-6">
            <Link href="/" className="text-blue-600 hover:underline">
              Home
            </Link>
            <Link href="/requests" className="text-blue-600 hover:underline">
              Requests
            </Link>
            <Link href="/offers" className="text-blue-600 hover:underline">
              Offers
            </Link>
            <Link href="/my-requests" className="text-blue-600 hover:underline">
              My Requests
            </Link>
            <Link href="/visualizer" className="text-blue-600 hover:underline">
              Visualizer
            </Link>
          </nav>
        </header>
        <main className="max-w-6xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
