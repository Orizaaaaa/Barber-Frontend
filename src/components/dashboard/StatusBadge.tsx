import React from 'react';
import { BOOKING_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '@/utils/bookingFlow';

interface StatusBadgeProps {
  status: string;
  type?: 'booking' | 'payment';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'booking' }) => {
  const getStatusStyles = (s: string) => {
    switch (s) {
      case 'ACTIVE':
      case 'AVAILABLE':
        return 'text-accent-dark bg-accent-light dark:text-accent dark:bg-accent/10 border-accent/20';
      case 'COMPLETED':
      case 'PAID':
        return 'text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/30 border-green-200 dark:border-green-800/30';
      case 'CONFIRMED':
        return 'text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800/30';
      case 'PENDING':
      case 'UNPAID':
        return 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800/30';
      case 'PARTIAL':
        return 'text-orange-700 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800/30';
      case 'CANCELLED':
      case 'REFUNDED':
      case 'NO_SHOW':
        return 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/30 border-red-200 dark:border-red-800/30';
      case 'INACTIVE':
      case 'MAINTENANCE':
        return 'text-neutral-600 bg-neutral-100 dark:text-neutral-400 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700';
      default:
        return 'text-neutral-500 bg-neutral-50 dark:text-neutral-500 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700';
    }
  };

  const label =
    type === 'payment'
      ? PAYMENT_STATUS_LABELS[status] ?? status
      : BOOKING_STATUS_LABELS[status] ?? status;

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold border ${getStatusStyles(status)}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
