import type { Comment } from "@/lib/types";

interface Props {
  comment: Comment;
}

export default function CommentItem({ comment }: Props) {
  const date = new Date(comment.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-medium text-sm text-gray-900">
          {comment.author}
        </span>
        <span className="text-xs text-gray-400">{date}</span>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
        {comment.content}
      </p>
    </div>
  );
}
