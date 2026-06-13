import api from './api';

export const customerService = {
  listCustomers: async (params?: any) => {
    const response = await api.get<{ success: boolean; message: string; data: any[] }>('/customers', { params });
    return response.data.data;
  },

  getMyData: async () => {
    const response = await api.get<{ success: boolean; message: string; data: any }>('/customers/me/data');
    return response.data.data;
  },

  updateMyData: async (data: any) => {
    const response = await api.patch<{ success: boolean; message: string; data: any }>('/customers/me/data', data);
    return response.data.data;
  },

  getMyPoints: async () => {
    const response = await api.get<{ success: boolean; message: string; data: any }>('/customers/me/points');
    return response.data.data;
  },

  getCustomerBookings: async (id: number) => {
    const response = await api.get<{ success: boolean; message: string; data: any[] }>(`/customers/${id}/bookings`);
    return response.data.data;
  },
};
