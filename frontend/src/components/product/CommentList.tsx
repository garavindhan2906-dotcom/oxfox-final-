import type { ProductComment } from '@/types';

export default function CommentList({ comments }: { comments: ProductComment[] }) {
  if (comments.length === 0) {
    return <p className="text-sm text-neutral-500">No reviews yet — be the first to share your experience.</p>;
  }

  return (
    <ul className="space-y-4">
      {comments.map((comment) => (
        <li key={comment.id} className="rounded-lg border border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-neutral-900">{comment.name}</p>
            {comment.rating && <p className="text-sm text-amber-500">{'★'.repeat(comment.rating)}</p>}
          </div>
          <p className="mt-1 text-sm text-neutral-600">{comment.comment_text}</p>
        </li>
      ))}
    </ul>
  );
}
