import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

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
          <Navigation />

          <main className="flex-1 w-full">
            <div className="max-w-6xl mx-auto p-6 h-full">
              {children}
            </div>
          </main>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
