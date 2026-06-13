import React from 'react';
import { Input } from '@/components/ui/Input';
import { Clock } from 'lucide-react';

interface Props {
  dateError?: string;
  dateRegister: ReturnType<ReturnType<typeof import('react-hook-form').useForm>['register']>;
  availableSlots: string[];
  selectedTime: string;
  onSelectTime: (time: string) => void;
  timeError?: string;
  timeRegister: ReturnType<ReturnType<typeof import('react-hook-form').useForm>['register']>;
  today: string;
  maxDate?: string;
  operatingHours?: { open: string; close: string };
}

const TimeSelection: React.FC<Props> = ({
  dateError,
  dateRegister,
  availableSlots,
  selectedTime,
  onSelectTime,
  timeError,
  timeRegister,
  today,
  maxDate,
  operatingHours,
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div>
      <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-5 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-accent rounded-full" />
        Date
      </h2>
      <div>
        <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">Appointment Date</label>
        <Input
          type="date"
          min={today}
          max={maxDate}
          error={dateError}
          {...dateRegister}
        />
        {maxDate && (
          <p className="text-[11px] text-neutral-400 mt-1.5 px-1">
            Max {new Date(maxDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
          </p>
        )}
      </div>
    </div>

    <div>
      <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-5 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-accent rounded-full" />
        Time
        {operatingHours && (
          <span className="text-xs font-normal text-neutral-400 ml-1">
            ({operatingHours.open}–{operatingHours.close})
          </span>
        )}
      </h2>
      {availableSlots.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {availableSlots.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => onSelectTime(slot)}
              className={`py-2.5 px-2 rounded-lg border-2 text-xs font-bold transition-all duration-200 cursor-pointer ${selectedTime === slot
                ? 'border-accent bg-gradient-to-br from-accent to-gold-600 text-white shadow-gold'
                : 'border-neutral-100 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-accent/30'
                }`}
            >
              {slot}
            </button>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-neutral-50 dark:bg-neutral-800/50 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-xl">
          <Clock className="w-6 h-6 text-neutral-300 dark:text-neutral-600 mx-auto mb-2" />
          <p className="text-xs font-medium text-neutral-400">Select barber & date to view slots</p>
        </div>
      )}
      {timeError && <p className="text-xs font-medium text-red-500 mt-2">{timeError}</p>}
      <input type="hidden" {...timeRegister} />
    </div>
  </div>
);

export default TimeSelection;
