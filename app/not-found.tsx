import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <p className="text-6xl mb-4">🔍</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        404 — Page Not Found
      </h1>
      <p className="text-gray-600 mb-6">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="inline-block px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
