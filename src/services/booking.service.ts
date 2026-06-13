import api from './api';
import { Booking } from '@/types';
import { normalizeBooking, normalizeBookings } from '@/utils/normalize';

export const bookingService = {
  createBooking: async (data: {
    customerName: string;
    customerPhone: string;
    barberId: string | number;
    serviceId: string | number;
    resourceId?: string | number;
    date: string;
    startTime: string;
    promoCode?: string;
  }): Promise<Booking> => {
    const payload = {
      ...data,
      barberId: data.barberId === 'random' ? 'random' : Number(data.barberId),
      serviceId: Number(data.serviceId),
      resourceId: data.resourceId ? Number(data.resourceId) : undefined,
    };
    const response = await api.post<{ success: boolean; message: string; data: Booking }>('/bookings', payload);
    return normalizeBooking(response.data.data as unknown as Record<string, unknown>);
  },

  getBookings: async (params?: {
    status?: string;
    barberId?: string | number;
    customerId?: string | number;
    date?: string;
  }): Promise<Booking[]> => {
    const response = await api.get<{ success: boolean; message: string; data: Booking[] }>('/bookings', { params });
    return normalizeBookings(response.data.data ?? []);
  },

  getBooking: async (id: number): Promise<Booking> => {
    const response = await api.get<{ success: boolean; message: string; data: Booking }>(`/bookings/${id}`);
    return normalizeBooking(response.data.data as unknown as Record<string, unknown>);
  },

  updateStatus: async (id: number, status: string): Promise<Booking> => {
    const response = await api.patch<{ success: boolean; message: string; data: Booking }>(`/bookings/${id}/status`, { status });
    return normalizeBooking(response.data.data as unknown as Record<string, unknown>);
  },

  reschedule: async (id: number, date: string, startTime: string): Promise<Booking> => {
    const response = await api.patch<{ success: boolean; message: string; data: Booking }>(`/bookings/${id}/reschedule`, { date, startTime });
    return normalizeBooking(response.data.data as unknown as Record<string, unknown>);
  },

  cancel: async (id: number): Promise<Booking> => {
    const response = await api.patch<{ success: boolean; message: string; data: Booking }>(`/bookings/${id}/cancel`);
    return normalizeBooking(response.data.data as unknown as Record<string, unknown>);
  },
};
