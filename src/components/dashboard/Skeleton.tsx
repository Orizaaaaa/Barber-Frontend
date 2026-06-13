import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`bg-neutral-100 dark:bg-neutral-800 rounded-lg animate-pulse ${className}`} />
  );
};

export const SkeletonStatCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-20 h-3" />
        <Skeleton className="w-9 h-9 rounded-xl" />
      </div>
      <div className="flex items-end justify-between">
        <Skeleton className="w-28 h-8" />
        <Skeleton className="w-20 h-6" />
      </div>
    </div>
  );
};

export const SkeletonTableRow: React.FC = () => {
  return (
    <tr className="border-b border-neutral-50 dark:border-neutral-800">
      <td className="px-6 py-4"><Skeleton className="w-24 h-4" /></td>
      <td className="px-6 py-4"><Skeleton className="w-32 h-4" /></td>
      <td className="px-6 py-4"><Skeleton className="w-20 h-4" /></td>
      <td className="px-6 py-4"><Skeleton className="w-16 h-5 rounded-full" /></td>
    </tr>
  );
};

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl overflow-hidden">
      {/* Search bar */}
      <div className="p-5 border-b border-neutral-50 dark:border-neutral-800">
        <Skeleton className="w-64 h-9 rounded-full" />
      </div>
      {/* Table header */}
      <div className="px-6 py-3 bg-neutral-50/50 dark:bg-neutral-800/50 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex gap-6">
          <Skeleton className="w-20 h-3" />
          <Skeleton className="w-24 h-3" />
          <Skeleton className="w-16 h-3" />
          <Skeleton className="w-14 h-3" />
        </div>
      </div>
      {/* Table rows */}
      <div className="divide-y divide-neutral-50 dark:divide-neutral-800">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-6 py-4 flex items-center gap-6">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-16 h-5 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonCardGrid: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="space-y-2 flex-1">
              <Skeleton className="w-28 h-4" />
              <Skeleton className="w-20 h-3" />
            </div>
          </div>
          <Skeleton className="w-full h-3" />
          <Skeleton className="w-3/4 h-3" />
          <div className="pt-4 border-t border-neutral-50 dark:border-neutral-800 flex justify-between">
            <Skeleton className="w-16 h-3" />
            <Skeleton className="w-20 h-3" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const SkeletonActivityRow: React.FC = () => {
  return (
    <div className="py-5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-24 h-3" />
        </div>
      </div>
      <div className="text-right space-y-2">
        <Skeleton className="w-20 h-4 ml-auto" />
        <Skeleton className="w-16 h-5 ml-auto rounded-full" />
      </div>
    </div>
  );
};

export const SkeletonOverview: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="w-48 h-8" />
        <Skeleton className="w-64 h-4" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>
      <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="w-36 h-6" />
          <Skeleton className="w-16 h-4" />
        </div>
        <div className="divide-y divide-neutral-50 dark:divide-neutral-800">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonActivityRow key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const SkeletonPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="w-40 h-7" />
          <Skeleton className="w-56 h-4" />
        </div>
        <Skeleton className="w-32 h-10 rounded-lg" />
      </div>
      <SkeletonTable />
    </div>
  );
};

export default SkeletonOverview;
