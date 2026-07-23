export default function ProductGridSkeleton({ count = 20 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <div className="aspect-square animate-pulse bg-neutral-100" />
          <div className="p-3 space-y-2">
            <div className="h-3 w-16 animate-pulse rounded bg-neutral-100" />
            <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-100" />
            <div className="h-5 w-20 animate-pulse rounded bg-neutral-100" />
            <div className="h-8 w-full animate-pulse rounded-lg bg-neutral-100 mt-3" />
          </div>
        </div>
      ))}
    </div>
  );
}
