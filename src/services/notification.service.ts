import api from './api';

export const notificationService = {
  listNotifications: async (params?: any) => {
    const response = await api.get<{ success: boolean; message: string; data: any[] }>('/notifications', { params });
    return response.data.data;
  },

  markRead: async (id: number) => {
    const response = await api.patch<{ success: boolean; message: string; data: any }>(`/notifications/${id}/read`);
    return response.data.data;
  },

  markAllRead: async () => {
    const response = await api.patch<{ success: boolean; message: string; data: any }>('/notifications/read-all');
    return response.data.data;
  },

  createNotification: async (data: any) => {
    const response = await api.post<{ success: boolean; message: string; data: any }>('/notifications', data);
    return response.data.data;
  },
};
