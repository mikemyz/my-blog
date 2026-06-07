import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import CommentSection from "@/components/CommentSection";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        href="/"
        className="text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 inline-block"
      >
        ← Back to all posts
      </Link>

      {/* Post header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <time dateTime={post.date}>{post.date}</time>
          {post.tags.length > 0 && (
            <div className="flex gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <Link
            href={`/posts/${slug}/edit`}
            className="ml-auto text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            ✏️ Edit
          </Link>
        </div>
      </header>

      {/* Post content */}
      <div className="mb-10">
        <MarkdownRenderer content={post.content} />
      </div>

      {/* Comments */}
      <CommentSection slug={slug} />
    </div>
  );
}
