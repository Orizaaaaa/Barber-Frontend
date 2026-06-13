import { Booking, BookingPayment, BusinessSettings, Payment } from '@/types';

export function normalizeBooking(raw: Record<string, unknown>): Booking {
  const paymentRaw = raw.payment as Record<string, unknown> | undefined;
  const service = raw.service as { price?: number } | undefined;
  const bookingDate = raw.bookingDate ?? raw.date;
  const totalAmount = Number(paymentRaw?.amount ?? service?.price ?? raw.totalAmount ?? 0);

  const payment: BookingPayment | undefined = paymentRaw
    ? {
      id: paymentRaw.id as number | undefined,
      status: String(paymentRaw.status ?? 'UNPAID') as BookingPayment['status'],
      amount: Number(paymentRaw.amount ?? totalAmount),
      paidAmount: Number(paymentRaw.paidAmount ?? 0),
      method: paymentRaw.method as string | null | undefined,
      paidAt: paymentRaw.paidAt
        ? paymentRaw.paidAt instanceof Date
          ? paymentRaw.paidAt.toISOString()
          : String(paymentRaw.paidAt)
        : null,
      discountAmount: Number(paymentRaw.discountAmount ?? 0),
      promoCode: paymentRaw.promoCode as string | undefined,
      finalAmount: Number(paymentRaw.finalAmount ?? totalAmount),
    }
    : undefined;

  return {
    ...(raw as unknown as Booking),
    id: Number(raw.id),
    customerId: Number(raw.customerId),
    barberId: Number(raw.barberId),
    serviceId: Number(raw.serviceId),
    resourceId: raw.resourceId ? Number(raw.resourceId) : undefined,
    bookingDate:
      bookingDate instanceof Date
        ? bookingDate.toISOString()
        : String(bookingDate ?? ''),
    totalAmount,
    payment,
  };
}

export function normalizePayment(raw: Record<string, unknown>): Payment {
  const booking = raw.booking as Record<string, unknown> | undefined;
  return {
    id: Number(raw.id),
    bookingId: Number(raw.bookingId),
    amount: Number(raw.amount ?? 0),
    paidAmount: Number(raw.paidAmount ?? 0),
    method: (raw.method as string) ?? null,
    status: String(raw.status ?? 'UNPAID') as Payment['status'],
    paidAt: raw.paidAt
      ? raw.paidAt instanceof Date
        ? raw.paidAt.toISOString()
        : String(raw.paidAt)
      : null,
    createdAt:
      raw.createdAt instanceof Date
        ? raw.createdAt.toISOString()
        : String(raw.createdAt ?? new Date().toISOString()),
    booking: booking ? normalizeBooking(booking) : undefined,
  };
}

export function normalizePayments(data: unknown[]): Payment[] {
  return data.map((item) => normalizePayment(item as Record<string, unknown>));
}

export function normalizeBookings(data: unknown[]): Booking[] {
  return data.map((item) => normalizeBooking(item as Record<string, unknown>));
}

export function mapSettingsFromApi(data: Record<string, unknown> | null): {
  businessName: string;
  operatingHours: { open: string; close: string };
  address: string;
  phone: string;
  email: string;
  bookingSettings: { minAdvanceHours: number; maxAdvanceDays: number; barberSelectionFee: number };
} {
  if (!data) {
    return {
      businessName: '',
      operatingHours: { open: '09:00', close: '21:00' },
      address: '',
      phone: '',
      email: '',
      bookingSettings: { minAdvanceHours: 1, maxAdvanceDays: 30, barberSelectionFee: 10000 },
    };
  }

  return {
    businessName: String(data.shopName ?? data.businessName ?? ''),
    operatingHours: {
      open: String(
        data.openingTime ??
        (data.operatingHours as { open?: string } | undefined)?.open ??
        '09:00'
      ),
      close: String(
        data.closingTime ??
        (data.operatingHours as { close?: string } | undefined)?.close ??
        '21:00'
      ),
    },
    address: String(data.address ?? ''),
    phone: String(data.phone ?? ''),
    email: String(data.email ?? ''),
    bookingSettings: {
      minAdvanceHours: Number(
        (data.bookingSettings as { minAdvanceHours?: number })?.minAdvanceHours ?? 1
      ),
      maxAdvanceDays: Number(
        data.allowBookingDays ??
        (data.bookingSettings as { maxAdvanceDays?: number } | undefined)?.maxAdvanceDays ??
        30
      ),
      barberSelectionFee: Number(
        data.barberSelectionFee ??
        (data.bookingSettings as { barberSelectionFee?: number } | undefined)?.barberSelectionFee ??
        10000
      ),
    },
  };
}

export function mapSettingsToApi(formData: {
  businessName: string;
  operatingHours: { open: string; close: string };
  address: string;
  phone: string;
  email: string;
  bookingSettings: { minAdvanceHours: number; maxAdvanceDays: number; barberSelectionFee: number };
}) {
  return {
    shopName: formData.businessName,
    openingTime: formData.operatingHours.open,
    closingTime: formData.operatingHours.close,
    address: formData.address || undefined,
    phone: formData.phone || undefined,
    email: formData.email || undefined,
    allowBookingDays: formData.bookingSettings.maxAdvanceDays,
    barberSelectionFee: formData.bookingSettings.barberSelectionFee,
  };
}

export function mapSettingsToBusinessSettings(
  data: Record<string, unknown> | null,
  form: ReturnType<typeof mapSettingsFromApi>
): BusinessSettings | null {
  if (!data) return null;
  return {
    id: Number(data.id ?? 0),
    businessName: form.businessName,
    operatingHours: form.operatingHours,
    address: form.address,
    phone: form.phone,
    email: form.email,
    bookingSettings: form.bookingSettings,
  };
}
