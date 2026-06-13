import React from 'react';
import { LucideIcon } from 'lucide-react';
import Sparkline from '../Sparkline';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number[];
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  icon: Icon, 
  trend, 
  color = 'var(--accent, #92702A)' 
}) => {
  const valueStr = String(value);
  const isLong = valueStr.length > 15;
  const isVeryLong = valueStr.length > 20;

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-5 hover:border-neutral-200 dark:hover:border-neutral-700 transition-colors group cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
          {label}
        </div>
        <div className="p-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg group-hover:bg-accent/10 dark:group-hover:bg-accent/10 transition-colors flex-shrink-0">
          <Icon className="w-4 h-4 text-neutral-400 dark:text-neutral-500 group-hover:text-accent transition-colors" />
        </div>
      </div>
      
      <div className="flex items-end justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className={`font-bold text-neutral-900 dark:text-neutral-100 tracking-tight leading-tight break-all ${isVeryLong ? 'text-base' : isLong ? 'text-lg' : 'text-2xl'}`}>
            {value}
          </div>
        </div>
        {trend && (
          <div className="pb-0.5 flex-shrink-0">
            <Sparkline data={trend} color={color} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
