import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/services/booking.service';
import { barberService } from '@/services/barber.service';
import { serviceService } from '@/services/service.service';
import { Barber, Service } from '@/types';
import { getBarberDisplayName } from '@/utils/barber';
import Modal from './Modal';
import { Shuffle, Calendar, Clock, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateBookingModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const queryClient = useQueryClient();
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    barberId: '',
    serviceId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
  });

  useEffect(() => {
    if (isOpen) {
      loadData();
      setForm({
        customerName: '',
        customerPhone: '',
        barberId: '',
        serviceId: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '',
      });
      setError('');
      setSuccess('');
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [barberData, serviceData] = await Promise.all([
        barberService.getBarbers(),
        serviceService.getServices(),
      ]);
      setBarbers(Array.isArray(barberData) ? barberData.filter(b => b.isActive) : []);
      setServices(Array.isArray(serviceData) ? serviceData : []);
    } catch {
      setError('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const selectedService = services.find(s => String(s.id) === form.serviceId);

  const handleSubmit = async () => {
    if (!form.customerName || !form.customerPhone || !form.barberId || !form.serviceId || !form.date || !form.startTime) {
      setError('Harap isi semua field yang wajib');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await bookingService.createBooking({
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        barberId: form.barberId,
        serviceId: form.serviceId,
        date: form.date,
        startTime: form.startTime,
      });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setSuccess('Booking berhasil dibuat!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (err: unknown) {
      const apiErr = err as { displayMessage?: string; response?: { data?: { message?: string } } };
      setError(apiErr.displayMessage || apiErr.response?.data?.message || 'Gagal membuat booking');
    } finally {
      setSubmitting(false);
    }
  };

  const timeSlots = [];
  for (let h = 9; h < 21; h++) {
    for (let m = 0; m < 60; m += 30) {
      timeSlots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Buat Booking Walk-In" size="lg">
      <div className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {success}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-neutral-100 dark:border-neutral-800 border-t-accent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Customer Info */}
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                Info Pelanggan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2">Nama *</label>
                  <input
                    type="text"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="input-field"
                    placeholder="Nama pelanggan"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2">Telepon *</label>
                  <input
                    type="tel"
                    value={form.customerPhone}
                    onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    className="input-field"
                    placeholder="08xxx"
                  />
                </div>
              </div>
            </div>

            {/* Barber Selection */}
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                Pilih Barber
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, barberId: 'random' })}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 text-center cursor-pointer ${form.barberId === 'random'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 shadow-md'
                    : 'border-neutral-100 dark:border-neutral-800 hover:border-emerald-300 dark:hover:border-emerald-700'
                    }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-1.5 ${form.barberId === 'random' ? 'bg-emerald-500 text-white' : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500'}`}>
                    <Shuffle className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-neutral-900 dark:text-white">Random</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Tanpa biaya</p>
                </button>
                {barbers.map((barber) => (
                  <button
                    key={barber.id}
                    type="button"
                    onClick={() => setForm({ ...form, barberId: String(barber.id) })}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 text-center cursor-pointer ${form.barberId === String(barber.id)
                      ? 'border-accent bg-accent/5 dark:bg-accent/10 shadow-gold'
                      : 'border-neutral-100 dark:border-neutral-800 hover:border-accent/30'
                      }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-1.5 font-bold text-sm transition-all ${form.barberId === String(barber.id) ? 'bg-gradient-to-br from-accent to-gold-600 text-white shadow-gold' : 'bg-accent/10 text-accent'}`}>
                      {getBarberDisplayName(barber).charAt(0)}
                    </div>
                    <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">{getBarberDisplayName(barber)}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Service Selection */}
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                Pilih Layanan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setForm({ ...form, serviceId: String(service.id) })}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer ${form.serviceId === String(service.id)
                      ? 'border-accent bg-accent/5 dark:bg-accent/10 shadow-gold'
                      : 'border-neutral-100 dark:border-neutral-800 hover:border-accent/30'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-neutral-900 dark:text-white">{service.name}</span>
                      {form.serviceId === String(service.id) && (
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-400">{service.duration} menit</span>
                      <span className="text-sm font-black text-accent">Rp {service.price.toLocaleString()}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-accent" /> Tanggal
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="input-field"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-accent" /> Jam
                </label>
                <select
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  className="input-field"
                >
                  <option value="">Pilih jam...</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Summary */}
            {selectedService && form.barberId && form.date && form.startTime && (
              <div className="p-5 bg-gradient-to-br from-neutral-900 to-neutral-950 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl space-y-3 animate-fade-in">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-accent/20 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <p className="text-xs font-bold text-accent uppercase tracking-[0.15em]">Ringkasan</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-neutral-500 text-[11px] block">Pelanggan</span>
                    <span className="text-white font-bold">{form.customerName}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[11px] block">Barber</span>
                    <span className="text-white font-bold">
                      {form.barberId === 'random' ? 'Random' : barbers.find(b => String(b.id) === form.barberId)?.user?.name || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[11px] block">Jadwal</span>
                    <span className="text-white font-bold">{form.date} · {form.startTime}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[11px] block">Total</span>
                    <span className="font-black text-gradient-gold text-lg">Rp {selectedService.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl font-bold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-3.5 bg-gradient-to-r from-accent to-gold-600 hover:from-accent-hover hover:to-gold-700 text-white rounded-xl font-bold shadow-gold hover:shadow-gold-lg transition-all disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Membuat...' : 'Buat Booking'}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default CreateBookingModal;
