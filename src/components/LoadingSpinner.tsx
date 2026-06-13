import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-neutral-950 gap-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-neutral-100 dark:border-neutral-800 border-t-accent rounded-full animate-spin" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Loading</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
