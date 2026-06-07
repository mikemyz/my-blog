import Link from "next/link";

interface Props {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: Props) {
  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-4 mt-8">
      {currentPage > 1 ? (
        <Link
          href={`/?page=${currentPage - 1}`}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          ← Previous
        </Link>
      ) : (
        <span className="px-4 py-2 text-sm border border-gray-200 rounded-md text-gray-400 cursor-not-allowed">
          ← Previous
        </span>
      )}
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages ? (
        <Link
          href={`/?page=${currentPage + 1}`}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Next →
        </Link>
      ) : (
        <span className="px-4 py-2 text-sm border border-gray-200 rounded-md text-gray-400 cursor-not-allowed">
          Next →
        </span>
      )}
    </nav>
  );
}
