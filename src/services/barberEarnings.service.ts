import api from './api';

export interface BarberEarningsData {
  barberId: number;
  barberName: string;
  compensationType: string;
  commissionRate: number;
  period: string;
  periodStart: string;
  periodEnd: string;
  periodStats: {
    revenue: number;
    commission: number;
    bookingCount: number;
  };
  unpaid: {
    revenue: number;
    commission: number;
    bookingCount: number;
  };
  paidOut: {
    total: number;
    payrollCount: number;
  };
  dailyBreakdown: Array<{
    date: string;
    revenue: number;
    count: number;
    commission: number;
    bookings: Array<{
      id: number;
      service: string;
      customer: string;
      amount: number;
      time: string;
    }>;
  }>;
}

export const barberEarningsService = {
  getMyEarnings: async (period: 'day' | 'week' | 'month' = 'month', date?: string): Promise<BarberEarningsData> => {
    const response = await api.get<{ success: boolean; message: string; data: BarberEarningsData }>('/barbers/my-earnings', {
      params: { period, date },
    });
    return response.data.data;
  },
};
