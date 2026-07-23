import ProductGridSkeleton from '@/components/catalog/ProductGridSkeleton';

export default function NewLoading() {
  return (
    <div>
      <div className="flex min-h-[40vh] items-end bg-neutral-900 px-6 pb-16">
        <div className="mx-auto w-full max-w-7xl space-y-3">
          <div className="h-3 w-24 animate-pulse rounded bg-neutral-700" />
          <div className="h-10 w-56 animate-pulse rounded bg-neutral-700" />
          <div className="h-4 w-80 animate-pulse rounded bg-neutral-700" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ProductGridSkeleton count={20} />
      </div>
    </div>
  );
}
