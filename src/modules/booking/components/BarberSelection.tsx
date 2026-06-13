import React from 'react';
import { Barber } from '@/types';
import { CheckCircle2, Shuffle } from 'lucide-react';
import { getBarberDisplayName } from '@/utils/barber';

interface Props {
  barbers: Barber[];
  selectedId: string;
  onSelect: (id: string) => void;
  error?: string;
  selectionFee?: number;
}

const BarberSelection: React.FC<Props> = ({ barbers, selectedId, onSelect, error, selectionFee }) => (
  <div>
    <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-5 flex items-center gap-2">
      <div className="w-1.5 h-1.5 bg-accent rounded-full" />
      Select Barber
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Random Barber option */}
      <button
        type="button"
        onClick={() => onSelect('random')}
        className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 text-left cursor-pointer hover-lift ${selectedId === 'random'
          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 shadow-md'
          : 'border-neutral-100 dark:border-neutral-800 hover:border-emerald-300'
          }`}
      >
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-200 ${selectedId === 'random'
          ? 'bg-emerald-500 text-white'
          : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
          }`}>
          <Shuffle className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold text-neutral-900 dark:text-white text-sm">Random</div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">Sistem pilih otomatis</div>
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">Tanpa biaya tambahan</div>
        </div>
        {selectedId === 'random' && (
          <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto" />
        )}
      </button>

      {/* Specific barber options */}
      {barbers.map((barber) => (
        <button
          key={barber.id}
          type="button"
          onClick={() => onSelect(barber.id.toString())}
          className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 text-left cursor-pointer hover-lift ${selectedId === barber.id.toString()
            ? 'border-accent bg-accent/5 dark:bg-accent/10 shadow-gold'
            : 'border-neutral-100 dark:border-neutral-800 hover:border-accent/30'
            }`}
        >
          <div className={`w-11 h-11 rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-200 ${selectedId === String(barber.id) ? 'bg-gradient-to-br from-accent to-gold-600 text-white shadow-gold' : 'bg-accent/10 text-accent'}`}>
            {getBarberDisplayName(barber).charAt(0)}
          </div>
          <div>
            <div className="font-bold text-neutral-900 dark:text-white text-sm">{getBarberDisplayName(barber)}</div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">{barber.specialty || 'Master Barber'}</div>
            {selectionFee && selectionFee > 0 && (
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
                +Rp {selectionFee.toLocaleString('id-ID')}
              </div>
            )}
          </div>
          {selectedId === String(barber.id) && (
            <CheckCircle2 className="w-5 h-5 text-accent ml-auto" />
          )}
        </button>
      ))}
    </div>
    {error && <p className="text-xs font-medium text-red-500 mt-2">{error}</p>}
  </div>
);

export default BarberSelection;
