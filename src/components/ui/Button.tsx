import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, disabled, children, className = '', ...props }, ref) => {
    const baseStyles = 'font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]';

    const variantStyles = {
      primary: 'bg-gradient-to-r from-accent to-gold-600 hover:from-accent-hover hover:to-gold-700 text-white shadow-gold hover:shadow-gold-lg',
      secondary: 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white',
      outline: 'border-2 border-accent text-accent hover:bg-accent hover:text-white',
      gold: 'bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-white shadow-gold hover:shadow-gold-lg',
    };

    const sizeStyles = {
      sm: 'py-2 px-4 text-sm',
      md: 'py-3 px-6',
      lg: 'py-4 px-8 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? 'Loading...' : children}
      </button>
    );
  }
);

Button.displayName = 'Button';
