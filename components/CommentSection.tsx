"use client";

import { useState, useEffect, useCallback } from "react";
import type { Comment } from "@/lib/types";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";

interface Props {
  slug: string;
}

export default function CommentSection({ slug }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <div className="mt-10 pt-8 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Comments ({comments.length})
      </h3>
      {loading ? (
        <p className="text-sm text-gray-500">Loading comments...</p>
      ) : (
        <CommentList comments={comments} />
      )}
      <div className="mt-6">
        <CommentForm slug={slug} onCommentAdded={fetchComments} />
      </div>
    </div>
  );
}
