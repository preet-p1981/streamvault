export default function SkeletonCard() {
  return <div className="animate-pulse bg-[#1a1a1a] rounded aspect-[2/3] w-full" />;
}

export function SkeletonHero() {
  return <div className="animate-pulse bg-[#141414] w-full h-[70vh] rounded" />;
}

export function SkeletonRow() {
  return (
    <div className="px-4 md:px-8 my-8">
      <div className="h-6 w-48 bg-[#1a1a1a] rounded animate-pulse mb-3" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
