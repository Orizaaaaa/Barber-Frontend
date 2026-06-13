import React from 'react';
import { Service } from '@/types';
import { CheckCircle2 } from 'lucide-react';

interface Props {
  services: Service[];
  selectedId: string;
  onSelect: (id: string) => void;
  error?: string;
}

const ServiceSelection: React.FC<Props> = ({ services, selectedId, onSelect, error }) => (
  <div>
    <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-5 flex items-center gap-2">
      <div className="w-1.5 h-1.5 bg-accent rounded-full" />
      Choose Service
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {services.map((service) => (
        <button
          key={service.id}
          type="button"
          onClick={() => onSelect(service.id.toString())}
          className={`p-4 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer hover-lift ${selectedId === service.id.toString()
            ? 'border-accent bg-accent/5 dark:bg-accent/10 shadow-gold'
            : 'border-neutral-100 dark:border-neutral-800 hover:border-accent/30'
            }`}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="font-bold text-neutral-900 dark:text-white text-sm">{service.name}</div>
            <span className="badge-neutral">{service.duration}m</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xl font-black text-accent">
              <span className="text-xs font-bold mr-0.5">Rp</span>
              {service.price.toLocaleString()}
            </div>
            {selectedId === String(service.id) && (
              <CheckCircle2 className="w-5 h-5 text-accent" />
            )}
          </div>
        </button>
      ))}
    </div>
    {error && <p className="text-xs font-medium text-red-500 mt-2">{error}</p>}
  </div>
);

export default ServiceSelection;
