import React, { useEffect, useState } from 'react';
import Modal from '@/components/dashboard/Modal';
import { Booking } from '@/types';
import { paymentService } from '@/services/payment.service';
import { getAmountDue } from '@/utils/bookingFlow';

interface RecordPaymentModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [method, setMethod] = useState('');
  const [amount, setAmount] = useState(0);
  const [markCompleted, setMarkCompleted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (booking && isOpen) {
      setMethod('');
      setAmount(getAmountDue(booking));
      setMarkCompleted(true);
      setError('');
    }
  }, [booking, isOpen]);

  const handleSubmit = async () => {
    if (!booking || !method) return;
    setLoading(true);
    setError('');
    try {
      await paymentService.recordPayment(booking.id, {
        amount,
        method,
        markCompleted,
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const apiErr = err as { displayMessage?: string; response?: { data?: { message?: string } } };
      setError(apiErr.displayMessage || apiErr.response?.data?.message || 'Gagal mencatat pembayaran');
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return null;

  const due = getAmountDue(booking);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Terima Pembayaran">
      <div className="space-y-6">
        <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800 text-sm">
          <div className="font-bold text-neutral-900 dark:text-white mb-1">
            {booking.customer?.name || 'Pelanggan'} — {booking.service?.name}
          </div>
          <div className="text-neutral-500">
            {new Date(booking.bookingDate).toLocaleDateString('id-ID')} · {booking.startTime}
          </div>
        </div>

        <div className="p-4 bg-accent-light/30 dark:bg-accent/5 rounded-2xl border border-accent/10 text-center">
          <div className="text-[11px] font-bold text-accent uppercase tracking-widest mb-1">Sisa tagihan</div>
          <div className="text-3xl font-black text-neutral-900 dark:text-white">
            Rp {due.toLocaleString('id-ID')}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-[12px] font-bold text-neutral-400 uppercase tracking-widest mb-2 px-1">
            Metode pembayaran
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="input-field appearance-none cursor-pointer"
          >
            <option value="">Pilih metode...</option>
            <option value="CASH">Tunai</option>
            <option value="QRIS">QRIS</option>
            <option value="BANK_TRANSFER">Transfer bank</option>
            <option value="WALLET">E-Wallet</option>
          </select>
        </div>

        <div>
          <label className="block text-[12px] font-bold text-neutral-400 uppercase tracking-widest mb-2 px-1">
            Jumlah dibayar
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-accent font-bold">Rp</span>
            <input
              type="number"
              min={1}
              max={due}
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value, 10) || 0)}
              className="input-field pl-12 font-bold"
            />
          </div>
        </div>

        <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
          <input
            type="checkbox"
            checked={markCompleted}
            onChange={(e) => setMarkCompleted(e.target.checked)}
            className="mt-1 accent-accent"
          />
          <span className="text-sm text-neutral-600 dark:text-neutral-300">
            <span className="font-bold text-neutral-900 dark:text-white block mb-0.5">
              Tandai layanan selesai
            </span>
            Setelah lunas, booking otomatis menjadi <strong>Selesai</strong> (cocok saat pelanggan bayar setelah potong).
          </span>
        </label>

        <div className="flex gap-4 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold rounded-xl"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !method || amount <= 0}
            className="flex-1 py-3 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-accent/20"
          >
            {loading ? 'Memproses...' : 'Konfirmasi pembayaran'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RecordPaymentModal;
