import React from 'react';
import { Scissors } from 'lucide-react';

const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 40,
  };

  return (
    <div className={`${sizes[size]} relative flex items-center justify-center group`}>
      <div className="absolute inset-0 bg-gradient-to-br from-accent to-gold-600 rounded-xl shadow-gold group-hover:shadow-gold-lg transition-shadow duration-300" />
      <div className="relative z-10 flex items-center justify-center text-white">
        <Scissors size={iconSizes[size]} className="transform -rotate-45" />
      </div>
    </div>
  );
};

export default Logo;
