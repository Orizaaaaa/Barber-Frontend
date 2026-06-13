import api from './api';

export const userService = {
  listUsers: async (params?: any) => {
    const response = await api.get<{ success: boolean; message: string; data: any[] }>('/users', { params });
    return response.data.data;
  },

  updateUser: async (id: number, data: any) => {
    const response = await api.patch<{ success: boolean; message: string; data: any }>(`/users/${id}`, data);
    return response.data.data;
  },
};
