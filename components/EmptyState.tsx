import Link from "next/link";

export default function EmptyState() {
  return (
    <div className="text-center py-20">
      <p className="text-4xl mb-4">📄</p>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        No posts yet
      </h2>
      <p className="text-gray-600 mb-6">
        Get started by writing your first blog post!
      </p>
      <Link
        href="/posts/new"
        className="inline-block px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors"
      >
        Write your first post
      </Link>
    </div>
  );
}
