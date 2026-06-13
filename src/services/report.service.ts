import api from './api';

export const reportService = {
  getDashboard: async (params?: any) => {
    const response = await api.get<{ success: boolean; message: string; data: any }>('/reports/dashboard', { params });
    return response.data.data;
  },

  getRevenue: async (params?: any) => {
    const response = await api.get<{ success: boolean; message: string; data: any[] }>('/reports/revenue', { params });
    return response.data.data;
  },

  getBookings: async (params?: any) => {
    const response = await api.get<{ success: boolean; message: string; data: any[] }>('/reports/bookings', { params });
    return response.data.data;
  },
};
