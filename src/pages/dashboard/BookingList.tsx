import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { bookingService } from '@/services/booking.service';
import { useBookings, BookingFilters } from '@/hooks/useBookings';
import { useBarbers } from '@/hooks/useBarbers';
import { Booking } from '@/types';
import { findBarberProfileId } from '@/utils/barber';
import {
  getPaymentStatus,
  canConfirmBooking,
  canRecordPayment,
  BOOKING_STATUS_LABELS,
} from '@/utils/bookingFlow';
import PageHeader from '@/components/dashboard/PageHeader';
import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { SkeletonPage } from '@/components/dashboard/Skeleton';
import Modal from '@/components/dashboard/Modal';
import ConfirmDialog from '@/components/dashboard/ConfirmDialog';
import RecordPaymentModal from '@/components/dashboard/RecordPaymentModal';
import CreateBookingModal from '@/components/dashboard/CreateBookingModal';
import { Calendar, Clock, User, Scissors, Info, Plus } from 'lucide-react';

const BookingList: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [actionError, setActionError] = useState('');

  const isStaff = user?.role === 'ADMIN' || user?.role === 'BARBER';

  const { data: barbers = [] } = useBarbers();

  const barberProfileId = user?.role === 'BARBER' && user?.id
    ? findBarberProfileId(barbers, user.id)
    : undefined;

  const filters: BookingFilters = {
    ...(user?.role === 'CUSTOMER' && user?.id ? { customerId: user.id } : {}),
    ...(barberProfileId ? { barberId: barberProfileId } : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
  };

  const { data: bookings = [], isLoading } = useBookings(filters, !!user);

  const invalidateBookings = () => queryClient.invalidateQueries({ queryKey: ['bookings'] });

  const confirmMutation = useMutation({
    mutationFn: (booking: Booking) => bookingService.updateStatus(booking.id, 'CONFIRMED'),
    onSuccess: () => { invalidateBookings(); setIsViewModalOpen(false); },
    onError: (err: unknown) => {
      const apiErr = err as { displayMessage?: string; response?: { data?: { message?: string } } };
      setActionError(apiErr.displayMessage || apiErr.response?.data?.message || 'Gagal mengonfirmasi reservasi');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => bookingService.cancel(selectedBooking!.id),
    onSuccess: () => { invalidateBookings(); setIsDeleteDialogOpen(false); setSelectedBooking(null); },
    onError: (err: unknown) => {
      const apiErr = err as { displayMessage?: string; response?: { data?: { message?: string } } };
      setActionError(apiErr.displayMessage || apiErr.response?.data?.message || 'Gagal membatalkan booking');
    },
  });

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsViewModalOpen(true);
  };

  const openPayment = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsViewModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const canCancel = () => user?.role === 'ADMIN' || user?.role === 'CUSTOMER';

  const columns = [
    {
      key: 'date' as keyof Booking,
      label: 'Tanggal',
      render: (value: string) =>
        new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    },
    {
      key: 'startTime' as keyof Booking,
      label: 'Jam',
      render: (value: string, row: Booking) => `${value} – ${row.endTime}`,
    },
    {
      key: 'service' as keyof Booking,
      label: 'Layanan',
      render: (value: Booking['service']) => value?.name || '–',
    },
    {
      key: 'barber' as keyof Booking,
      label: 'Barber',
      render: (value: Booking['barber']) => value?.user?.name || '–',
    },
    ...(user?.role !== 'CUSTOMER'
      ? [
        {
          key: 'customer' as keyof Booking,
          label: 'Pelanggan',
          render: (value: Booking['customer']) => value?.name || '–',
        },
      ]
      : []),
    {
      key: 'totalAmount' as keyof Booking,
      label: 'Tagihan',
      render: (value: number) => `Rp ${value?.toLocaleString('id-ID') || 0}`,
    },
    {
      key: 'status' as keyof Booking,
      label: 'Status reservasi',
      render: (value: string) => <StatusBadge status={value} type="booking" />,
    },
    {
      key: 'payment' as keyof Booking,
      label: 'Pembayaran',
      render: (_: Booking['payment'], row: Booking) => (
        <StatusBadge status={getPaymentStatus(row)} type="payment" />
      ),
    },
  ];

  if (isLoading) {
    return <SkeletonPage />;
  }

  return (
    <div>
      <PageHeader
        title="Bookings"
        subtitle="Alur: Reservasi → Konfirmasi → Bayar → Selesai"
        action={
          isStaff && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Buat Booking
            </button>
          )
        }
      />

      {isStaff && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl text-sm">
          <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold mb-1 text-amber-800 dark:text-amber-200">Cara kerja</p>
            <ol className="list-decimal list-inside space-y-0.5 text-amber-700/90 dark:text-amber-300/90">
              <li>Pelanggan booking online → status <strong>Menunggu konfirmasi</strong></li>
              <li>Admin/barber klik <strong>Konfirmasi reservasi</strong></li>
              <li>Saat pelanggan bayar di kasir → <strong>Terima pembayaran</strong> (otomatis selesai)</li>
            </ol>
          </div>
        </div>
      )}

      {actionError && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 text-red-600 rounded-xl text-sm">
          {actionError}
        </div>
      )}

      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:border-accent text-sm"
        >
          <option value="">Semua status</option>
          <option value="PENDING">Menunggu konfirmasi</option>
          <option value="CONFIRMED">Dikonfirmasi</option>
          <option value="COMPLETED">Selesai</option>
          <option value="CANCELLED">Dibatalkan</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={bookings}
        onRowClick={handleView}
        searchable
        searchPlaceholder="Cari booking..."
      />

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Detail reservasi">
        {selectedBooking && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={selectedBooking.status} type="booking" />
              <StatusBadge status={getPaymentStatus(selectedBooking)} type="payment" />
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-accent" />
              <div>
                <div className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider">Tanggal</div>
                <div className="text-neutral-900 dark:text-white font-semibold">
                  {new Date(selectedBooking.bookingDate).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
              <Clock className="w-5 h-5 text-accent" />
              <div>
                <div className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider">Jam</div>
                <div className="text-neutral-900 dark:text-white font-semibold">
                  {selectedBooking.startTime} – {selectedBooking.endTime}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
              <Scissors className="w-5 h-5 text-accent" />
              <div>
                <div className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider">Layanan</div>
                <div className="text-neutral-900 dark:text-white font-semibold">
                  {selectedBooking.service?.name || '–'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-accent" />
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Barber</span>
                </div>
                <div className="text-neutral-900 dark:text-white font-bold">
                  {selectedBooking.barber?.user?.name || '–'}
                </div>
              </div>
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-accent" />
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Pelanggan</span>
                </div>
                <div className="text-neutral-900 dark:text-white font-bold">
                  {selectedBooking.customer?.name || '–'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-accent-light/30 dark:bg-accent/5 rounded-2xl border border-accent/10">
              <div>
                <div className="text-[10px] font-bold text-accent uppercase tracking-widest mb-0.5">Total tagihan</div>
                <div className="text-2xl font-black text-neutral-900 dark:text-white">
                  Rp {selectedBooking.totalAmount?.toLocaleString('id-ID') || 0}
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-500">
              Status saat ini:{' '}
              <strong>{BOOKING_STATUS_LABELS[selectedBooking.status] || selectedBooking.status}</strong>
            </p>

            <div className="flex flex-col gap-3 pt-4">
              {isStaff && canConfirmBooking(selectedBooking.status) && (
                <button
                  onClick={() => confirmMutation.mutate(selectedBooking)}
                  disabled={confirmMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  Konfirmasi reservasi
                </button>
              )}
              {isStaff && canRecordPayment(selectedBooking.status, getPaymentStatus(selectedBooking)) && (
                <button
                  onClick={() => openPayment(selectedBooking)}
                  className="w-full bg-accent hover:bg-accent-hover text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-accent/20 cursor-pointer"
                >
                  Terima pembayaran
                </button>
              )}
              {canCancel() &&
                selectedBooking.status !== 'CANCELLED' &&
                selectedBooking.status !== 'COMPLETED' && (
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setIsDeleteDialogOpen(true);
                    }}
                    className="w-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 py-3 rounded-xl font-bold cursor-pointer"
                  >
                    Batalkan reservasi
                  </button>
                )}
            </div>
          </div>
        )}
      </Modal>

      <RecordPaymentModal
        booking={selectedBooking}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={invalidateBookings}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => cancelMutation.mutate()}
        title="Batalkan reservasi"
        message="Reservasi ini akan dibatalkan. Pelanggan perlu booking ulang jika masih ingin datang."
        confirmText="Ya, batalkan"
      />

      {isStaff && (
        <CreateBookingModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={invalidateBookings}
        />
      )}
    </div>
  );
};

export default BookingList;
