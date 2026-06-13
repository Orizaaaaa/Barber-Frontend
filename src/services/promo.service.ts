import api from './api';

export const promoService = {
  listPromos: async (params?: any) => {
    const response = await api.get<{ success: boolean; message: string; data: any[] }>('/promos', { params });
    return response.data.data;
  },

  getPromo: async (id: number) => {
    const response = await api.get<{ success: boolean; message: string; data: any }>(`/promos/${id}`);
    return response.data.data;
  },

  createPromo: async (data: any) => {
    const response = await api.post<{ success: boolean; message: string; data: any }>('/promos', data);
    return response.data.data;
  },

  updatePromo: async (id: number, data: any) => {
    const response = await api.patch<{ success: boolean; message: string; data: any }>(`/promos/${id}`, data);
    return response.data.data;
  },

  deletePromo: async (id: number) => {
    const response = await api.delete<{ success: boolean; message: string }>(`/promos/${id}`);
    return response.data;
  },

  validatePromo: async (code: string) => {
    const response = await api.post<{ success: boolean; message: string; data: any }>('/promos/validate', { code });
    return response.data.data;
  },
};
