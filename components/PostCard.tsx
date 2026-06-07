import Link from "next/link";
import type { PostSummary } from "@/lib/types";

interface Props {
  post: PostSummary;
}

export default function PostCard({ post }: Props) {
  return (
    <article className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
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
      </div>
      <Link href={`/posts/${post.slug}`} className="group">
        <h2 className="text-xl font-semibold text-gray-900 group-hover:text-gray-600 transition-colors mb-2">
          {post.title}
        </h2>
      </Link>
      {post.excerpt && (
        <p className="text-gray-600 leading-relaxed">{post.excerpt}</p>
      )}
      <Link
        href={`/posts/${post.slug}`}
        className="inline-block mt-3 text-sm text-gray-900 font-medium hover:underline"
      >
        Read more →
      </Link>
    </article>
  );
}
