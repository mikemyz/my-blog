import { getPaginatedPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import EmptyState from "@/components/EmptyState";

const PAGE_SIZE = 10;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const page = parseInt(
    Array.isArray(sp.page) ? sp.page[0] : sp.page || "1",
    10
  );

  const result = await getPaginatedPosts(page, PAGE_SIZE);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
        <p className="text-gray-600 mt-2">
          Thoughts, tutorials, and stories.
        </p>
      </div>

      {result.items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          {result.items.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}

      <Pagination currentPage={result.page} totalPages={result.totalPages} />
    </div>
  );
}
