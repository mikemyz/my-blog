import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
        >
          📝 My Blog
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/posts/new"
            className="text-sm px-3 py-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            + New Post
          </Link>
        </nav>
      </div>
    </header>
  );
}
