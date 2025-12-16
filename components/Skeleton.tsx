'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({ 
  className = '', 
  variant = 'rectangular',
  width,
  height 
}: SkeletonProps) {
  const baseClasses = 'skeleton rounded';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

// Pre-built skeleton layouts
export function PersonCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 animate-fade-in">
      <Skeleton height={192} className="rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" width="60%" height={24} />
        <Skeleton variant="text" width="40%" height={16} />
        <Skeleton variant="text" width="80%" height={16} />
        <div className="flex gap-2 pt-2">
          <Skeleton width={40} height={40} className="rounded-lg" />
          <Skeleton width={40} height={40} className="rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Patient card skeleton */}
      <Skeleton height={120} className="rounded-2xl" />
      
      {/* Buttons skeleton */}
      <div className="flex gap-4">
        <Skeleton height={56} className="flex-1 rounded-xl" />
        <Skeleton height={56} className="flex-1 rounded-xl" />
      </div>
      
      {/* People grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <PersonCardSkeleton />
        <PersonCardSkeleton />
        <PersonCardSkeleton />
      </div>
    </div>
  );
}



