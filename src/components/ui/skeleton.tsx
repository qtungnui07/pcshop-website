export function ProductSkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm animate-pulse flex flex-col justify-between h-[400px]">
      <div>
        {/* Image Skeleton */}
        <div className="w-full h-44 bg-slate-100 rounded-xl mb-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
        </div>
        
        {/* Brand / Tag Skeleton */}
        <div className="w-20 h-4 bg-slate-100 rounded-md mb-3" />
        
        {/* Title Skeleton */}
        <div className="w-full h-5 bg-slate-100 rounded-md mb-2" />
        <div className="w-3/4 h-5 bg-slate-100 rounded-md mb-4" />
        
        {/* Spec Tags */}
        <div className="flex gap-2 mb-4">
          <div className="w-14 h-5 bg-slate-100 rounded-md" />
          <div className="w-16 h-5 bg-slate-100 rounded-md" />
          <div className="w-12 h-5 bg-slate-100 rounded-md" />
        </div>
      </div>
      
      {/* Price & CTA Skeleton */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div>
          <div className="w-28 h-6 bg-slate-100 rounded-md mb-1" />
          <div className="w-16 h-3 bg-slate-100 rounded-md" />
        </div>
        <div className="w-10 h-10 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}

export function ProductSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeletonCard key={i} />
      ))}
    </div>
  );
}
