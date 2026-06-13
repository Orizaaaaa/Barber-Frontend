import React from 'react';
import { Service, Barber } from '@/types';
import { CheckCircle2, Shuffle } from 'lucide-react';
import { getBarberDisplayName } from '@/utils/barber';

interface Props {
  service: Service;
  barber: Barber | undefined;
  date: string;
  startTime: string;
  isRandomBarber?: boolean;
  selectionFee?: number;
}

const BookingSummary: React.FC<Props> = ({ service, barber, date, startTime, isRandomBarber, selectionFee }) => {
  const fee = isRandomBarber ? 0 : (selectionFee || 0);
  const total = service.price + fee;

  return (
    <div className="p-6 bg-gradient-to-br from-neutral-900 to-neutral-950 dark:from-neutral-800 dark:to-neutral-900 text-white rounded-2xl space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
          <CheckCircle2 className="w-4 h-4 text-accent" />
        </div>
        <p className="text-sm font-bold text-accent uppercase tracking-[0.2em]">Reservation Summary</p>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-neutral-400 text-xs block mb-1">Service</span>
          <span className="font-bold">{service.name}</span>
        </div>
        <div>
          <span className="text-neutral-400 text-xs block mb-1">Barber</span>
          <span className="font-bold flex items-center gap-1">
            {isRandomBarber ? (
              <>
                <Shuffle className="w-3 h-3" />
                Random
              </>
            ) : (
              barber ? getBarberDisplayName(barber) : '-'
            )}
          </span>
        </div>
        <div>
          <span className="text-neutral-400 text-xs block mb-1">Schedule</span>
          <span className="font-bold">
            {new Date(date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })} · {startTime}
          </span>
        </div>
        <div>
          <span className="text-neutral-400 text-xs block mb-1">Price</span>
          <span className="font-black text-gradient-gold text-lg">Rp {service.price.toLocaleString('id-ID')}</span>
        </div>
      </div>

      {fee > 0 && (
        <div className="flex items-center justify-between pt-3 border-t border-neutral-700 text-sm">
          <span className="text-amber-400">Barber selection fee</span>
          <span className="font-bold text-amber-400">+Rp {fee.toLocaleString('id-ID')}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-neutral-700">
        <span className="text-neutral-400 text-sm">Total</span>
        <span className="font-black text-white text-xl">Rp {total.toLocaleString('id-ID')}</span>
      </div>

      <p className="text-xs text-neutral-500 pt-2">
        Pay at the venue after service. You'll be contacted for confirmation.
      </p>
    </div>
  );
};

export default BookingSummary;
