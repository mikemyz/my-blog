import PostEditor from "@/components/PostEditor";

export default function NewPostPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Create New Post
      </h1>
      <PostEditor />
    </div>
  );
}
