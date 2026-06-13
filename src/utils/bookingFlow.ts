/** Alur status booking yang jelas untuk barbershop */
export const BOOKING_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Menunggu konfirmasi',
  CONFIRMED: 'Dikonfirmasi',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan',
  NO_SHOW: 'Tidak hadir',
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  UNPAID: 'Belum bayar',
  PARTIAL: 'Bayar sebagian',
  PAID: 'Lunas',
  REFUNDED: 'Dikembalikan',
};

export function getPaymentStatus(booking: {
  payment?: { status?: string; amount?: number; paidAmount?: number };
  totalAmount?: number;
}): string {
  return booking.payment?.status ?? 'UNPAID';
}

export function getAmountDue(booking: {
  payment?: { amount?: number; paidAmount?: number };
  totalAmount?: number;
}): number {
  const total = booking.payment?.amount ?? booking.totalAmount ?? 0;
  const paid = booking.payment?.paidAmount ?? 0;
  return Math.max(0, total - paid);
}

export function canConfirmBooking(status: string): boolean {
  return status === 'PENDING';
}

export function canRecordPayment(status: string, paymentStatus: string): boolean {
  return status !== 'CANCELLED' && status !== 'COMPLETED' && paymentStatus !== 'PAID';
}

export function canMarkCompleted(status: string, paymentStatus: string): boolean {
  return status === 'CONFIRMED' && paymentStatus === 'PAID';
}
