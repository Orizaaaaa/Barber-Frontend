import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-neutral-50 dark:bg-neutral-900 border ${error ? 'border-red-400 dark:border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-neutral-200 dark:border-neutral-800 focus:border-accent focus:ring-accent/10'} rounded-xl px-4 py-3 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 transition-all duration-200 ${className}`}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1.5 animate-fade-in">
            <span className="w-1 h-1 bg-red-500 rounded-full" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
