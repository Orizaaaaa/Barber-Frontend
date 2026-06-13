import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-700">
      {icon && <div className="text-neutral-300 dark:text-neutral-600 mb-4">{icon}</div>}
      <h3 className="text-lg font-bold text-neutral-500 dark:text-neutral-400 mb-2">{title}</h3>
      {description && <p className="text-neutral-400 dark:text-neutral-500 text-sm mb-4 max-w-sm">{description}</p>}
      {action}
    </div>
  );
};

export default EmptyState;
