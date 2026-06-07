"use client";

import { useState } from "react";

interface Props {
  slug: string;
  onCommentAdded: () => void;
}

export default function CommentForm({ slug, onCommentAdded }: Props) {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!author.trim()) {
      setError("Name is required.");
      return;
    }
    if (!content.trim()) {
      setError("Comment is required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          author: author.trim(),
          content: content.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to post comment");
      }

      setAuthor("");
      setContent("");
      onCommentAdded();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-900">Leave a Comment</h4>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
      )}

      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Your name"
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        placeholder="Write your comment..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 resize-y"
      />

      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
      >
        {submitting ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}
