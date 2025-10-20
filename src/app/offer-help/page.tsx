import Link from "next/link";

interface DefaultPageProps {
  title: string;
  description?: string;
}

export default function DefaultPage({ title, description }: DefaultPageProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 bg-gray-50">
      {/* Header / Navigation */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">{title}</h1>
        <nav className="space-x-4">
          <Link href="/" className="text-blue-600 hover:underline">
            Home
          </Link>
          <Link href="/find-help" className="text-blue-600 hover:underline">
            Find Help
          </Link>
          <Link href="/offer-help" className="text-blue-600 hover:underline">
            Offer Help
          </Link>
          <Link href="/my-requests" className="text-blue-600 hover:underline">
            My Requests
          </Link>
        </nav>
      </header>

      {/* Content */}
      <section className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
        {description && <p className="mb-4 text-gray-700">{description}</p>}
        <div className="text-gray-500">
          {/* Placeholder content */}
          <p>This is the {title} page. Replace this with your real content.</p>
        </div>
      </section>
    </main>
  );
}
