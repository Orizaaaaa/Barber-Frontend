import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-neutral-300">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full bg-neutral-900 border ${error ? 'border-accent' : 'border-neutral-700'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors ${className}`}
          {...props}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-sm text-accent">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
