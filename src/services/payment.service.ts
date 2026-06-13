import api from './api';
import { Payment } from '@/types';
import { normalizePayment, normalizePayments } from '@/utils/normalize';

export const paymentService = {
  listPayments: async (): Promise<Payment[]> => {
    const response = await api.get<{ success: boolean; message: string; data: unknown[] }>('/payments');
    return normalizePayments(response.data.data ?? []);
  },

  getPayment: async (bookingId: number): Promise<Payment> => {
    const response = await api.get<{ success: boolean; message: string; data: unknown }>(`/payments/${bookingId}`);
    return normalizePayment(response.data.data as Record<string, unknown>);
  },

  recordPayment: async (
    bookingId: number,
    data: { amount: number; method: string; markCompleted?: boolean }
  ): Promise<Payment> => {
    const response = await api.post<{ success: boolean; message: string; data: unknown }>(
      `/payments/${bookingId}`,
      data
    );
    return normalizePayment(response.data.data as Record<string, unknown>);
  },
};
