import "./globals.css";

export const metadata = {
  title: "My Next.js App",
  description: "A clean Next.js + Tailwind setup",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">{children}</body>
    </html>
  );
}
