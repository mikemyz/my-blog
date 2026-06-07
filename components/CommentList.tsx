import type { Comment } from "@/lib/types";
import CommentItem from "./CommentItem";

interface Props {
  comments: Comment[];
}

export default function CommentList({ comments }: Props) {
  if (comments.length === 0) {
    return (
      <p className="text-sm text-gray-500 py-4">
        No comments yet. Be the first to comment!
      </p>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
