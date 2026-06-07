import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";
import PostEditor from "@/components/PostEditor";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const initialData = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    tags: post.tags.join(", "),
    content: post.content,
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Post</h1>
      <PostEditor initialData={initialData} isEditing slug={slug} />
    </div>
  );
}
