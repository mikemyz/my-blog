"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import MarkdownRenderer from "./MarkdownRenderer";

interface PostEditorProps {
  initialData?: {
    title: string;
    slug: string;
    excerpt: string;
    tags: string;
    content: string;
  };
  isEditing?: boolean;
  slug?: string;
}

export default function PostEditor({
  initialData,
  isEditing = false,
  slug,
}: PostEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [editSlug, setEditSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [tagsInput, setTagsInput] = useState(initialData?.tags || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [showPreview, setShowPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleTitleChange = useCallback(
    (value: string) => {
      setTitle(value);
      // Only auto-fill slug in create mode when slug hasn't been manually edited
      if (!isEditing && editSlug === generateSlug(title)) {
        setEditSlug(generateSlug(value));
      }
    },
    [isEditing, editSlug, title]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!content.trim()) {
      setError("Content is required.");
      return;
    }

    setSubmitting(true);

    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const body = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        tags,
        content: content.trim(),
        ...(isEditing ? {} : { slug: editSlug.trim() || undefined }),
      };

      const url = isEditing ? `/api/posts/${slug}` : "/api/posts";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      const data = await res.json();
      router.push(`/posts/${data.slug}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !slug) return;
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete post");
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900"
          placeholder="Enter post title"
        />
      </div>

      {/* Slug (only in create mode) */}
      {!isEditing && (
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Slug
          </label>
          <input
            id="slug"
            type="text"
            value={editSlug}
            onChange={(e) => setEditSlug(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900"
            placeholder="Auto-generated from title"
          />
          <p className="text-xs text-gray-500 mt-1">
            URL-friendly identifier. Leave empty to auto-generate from title.
          </p>
        </div>
      )}

      {/* Excerpt */}
      <div>
        <label
          htmlFor="excerpt"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Excerpt
        </label>
        <input
          id="excerpt"
          type="text"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900"
          placeholder="Brief summary of the post"
        />
      </div>

      {/* Tags */}
      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Tags
        </label>
        <input
          id="tags"
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900"
          placeholder="e.g. tech, javascript, tutorial"
        />
        <p className="text-xs text-gray-500 mt-1">
          Comma-separated list of tags.
        </p>
      </div>

      {/* Content */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Content (Markdown) *
          </label>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {showPreview ? "✏️ Edit" : "👁 Preview"}
          </button>
        </div>
        {showPreview ? (
          <div className="min-h-[300px] p-4 border border-gray-300 rounded-md bg-white">
            {content ? (
              <MarkdownRenderer content={content} />
            ) : (
              <p className="text-gray-400 italic">Nothing to preview yet.</p>
            )}
          </div>
        ) : (
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent font-mono text-sm text-gray-900"
            placeholder="Write your post in Markdown..."
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div>
          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={submitting}
              className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              Delete Post
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {submitting
              ? "Saving..."
              : isEditing
              ? "Update Post"
              : "Publish Post"}
          </button>
        </div>
      </div>
    </form>
  );
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}
