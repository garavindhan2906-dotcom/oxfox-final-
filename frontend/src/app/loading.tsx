export default function Loading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
      <p className="text-6xl font-bold tracking-tight text-brand sm:text-7xl">OXFOX</p>
      <div className="h-1 w-16 animate-pulse rounded-full bg-brand" />
    </div>
  );
}
