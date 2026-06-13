import React, { useState, useEffect } from 'react';
import { paymentService } from '@/services/payment.service';
import { Payment } from '@/types';
import { getAmountDue } from '@/utils/bookingFlow';
import PageHeader from '@/components/dashboard/PageHeader';
import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import Modal from '@/components/dashboard/Modal';
import RecordPaymentModal from '@/components/dashboard/RecordPaymentModal';
import { SkeletonPage } from '@/components/dashboard/Skeleton';
import { Booking } from '@/types';
import { DollarSign, Calendar, AlertCircle } from 'lucide-react';

type PaymentTab = 'unpaid' | 'paid' | 'all';

const PaymentList: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<PaymentTab>('unpaid');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [payBooking, setPayBooking] = useState<Booking | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const data = await paymentService.listPayments();
      setPayments(data);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    if (tab === 'unpaid') return p.status === 'UNPAID' || p.status === 'PARTIAL';
    if (tab === 'paid') return p.status === 'PAID';
    return true;
  });

  const unpaidCount = payments.filter((p) => p.status === 'UNPAID' || p.status === 'PARTIAL').length;

  const handleOpenPay = (payment: Payment) => {
    if (!payment.booking) return;
    setPayBooking(payment.booking);
    setIsPaymentModalOpen(true);
  };

  const columns = [
    {
      key: 'booking' as keyof Payment,
      label: 'Pelanggan / Layanan',
      render: (_: Payment['booking'], row: Payment) => (
        <div>
          <div className="font-semibold text-neutral-900 dark:text-white">
            {row.booking?.customer?.name || 'Pelanggan'}
          </div>
          <div className="text-xs text-neutral-500">
            {row.booking?.service?.name || '–'} · Booking #{row.bookingId}
          </div>
        </div>
      ),
    },
    {
      key: 'booking' as keyof Payment,
      label: 'Tanggal kunjungan',
      render: (_: Payment['booking'], row: Payment) =>
        row.booking?.bookingDate
          ? new Date(row.booking.bookingDate).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
          : '–',
    },
    {
      key: 'amount' as keyof Payment,
      label: 'Tagihan',
      render: (value: number, row: Payment) => {
        const due = row.booking ? getAmountDue(row.booking) : value;
        return (
          <div>
            <div className="font-semibold">Rp {value?.toLocaleString('id-ID')}</div>
            {(row.status === 'UNPAID' || row.status === 'PARTIAL') && (
              <div className="text-xs text-amber-600">Sisa: Rp {due.toLocaleString('id-ID')}</div>
            )}
          </div>
        );
      },
    },
    {
      key: 'status' as keyof Payment,
      label: 'Status',
      render: (value: string) => <StatusBadge status={value} type="payment" />,
    },
    {
      key: 'method' as keyof Payment,
      label: 'Metode',
      render: (value: string | null | undefined) => value || '–',
    },
  ];

  if (loading) {
    return <SkeletonPage />;
  }

  return (
    <div>
      <PageHeader
        title="Pembayaran"
        subtitle="Setiap reservasi otomatis punya tagihan. Terima pembayaran saat pelanggan bayar di kasir."
      />

      <div className="mb-6 flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl text-sm">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
        <p className="text-amber-800 dark:text-amber-200">
          Tagihan dibuat otomatis saat pelanggan booking. Anda tidak perlu membuat pembayaran manual — cukup
          klik baris di tab <strong>Belum lunas</strong> untuk menerima pembayaran.
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {(
          [
            { id: 'unpaid' as const, label: `Belum lunas (${unpaidCount})` },
            { id: 'paid' as const, label: 'Sudah lunas' },
            { id: 'all' as const, label: 'Semua' },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${tab === t.id
                ? 'bg-accent text-white shadow-md shadow-accent/20'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filteredPayments}
        onRowClick={(row) => {
          if (row.status === 'UNPAID' || row.status === 'PARTIAL') {
            handleOpenPay(row);
          } else {
            setSelectedPayment(row);
            setIsViewModalOpen(true);
          }
        }}
        searchable
        searchPlaceholder="Cari pembayaran..."
      />

      <RecordPaymentModal
        booking={payBooking}
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setPayBooking(null);
        }}
        onSuccess={loadPayments}
      />

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Bukti pembayaran">
        {selectedPayment && (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center p-8 bg-accent-light/30 dark:bg-accent/5 rounded-3xl border border-accent/10">
              <div className="p-3 bg-accent rounded-2xl shadow-lg shadow-accent/20 mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div className="text-[12px] font-bold text-accent uppercase tracking-widest mb-1">Total dibayar</div>
              <div className="text-4xl font-black text-neutral-900 dark:text-white">
                Rp {(selectedPayment.paidAmount ?? selectedPayment.amount)?.toLocaleString('id-ID')}
              </div>
              <StatusBadge status={selectedPayment.status} type="payment" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                <div className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Metode</div>
                <div className="font-bold">{selectedPayment.method || '–'}</div>
              </div>
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                <div className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Booking</div>
                <div className="font-bold">#{selectedPayment.bookingId}</div>
              </div>
            </div>

            {selectedPayment.paidAt && (
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-accent" />
                  <div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase">Waktu bayar</div>
                    <div className="font-bold">
                      {new Date(selectedPayment.paidAt).toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setIsViewModalOpen(false)}
              className="w-full py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold rounded-2xl"
            >
              Tutup
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PaymentList;
