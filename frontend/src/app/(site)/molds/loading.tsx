export default function MoldsLoading() {
  return (
    <div>
      <div className="flex min-h-[40vh] items-end bg-neutral-900 px-6 pb-16">
        <div className="mx-auto w-full max-w-7xl space-y-3">
          <div className="h-3 w-24 animate-pulse rounded bg-neutral-700" />
          <div className="h-10 w-48 animate-pulse rounded bg-neutral-700" />
          <div className="h-4 w-96 animate-pulse rounded bg-neutral-700" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              <div className="aspect-[4/3] animate-pulse bg-neutral-100" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 animate-pulse rounded bg-neutral-100" />
                <div className="h-3 w-full animate-pulse rounded bg-neutral-100" />
                <div className="h-3 w-20 animate-pulse rounded bg-neutral-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
