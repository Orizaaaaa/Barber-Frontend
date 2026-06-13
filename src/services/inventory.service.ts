import api from './api';

export const inventoryService = {
  listItems: async (params?: any) => {
    const response = await api.get<{ success: boolean; message: string; data: any[] }>('/inventory', { params });
    return response.data.data;
  },

  getItem: async (id: number) => {
    const response = await api.get<{ success: boolean; message: string; data: any }>(`/inventory/${id}`);
    return response.data.data;
  },

  createItem: async (data: any) => {
    const response = await api.post<{ success: boolean; message: string; data: any }>('/inventory', data);
    return response.data.data;
  },

  updateItem: async (id: number, data: any) => {
    const response = await api.patch<{ success: boolean; message: string; data: any }>(`/inventory/${id}`, data);
    return response.data.data;
  },

  deleteItem: async (id: number) => {
    const response = await api.delete<{ success: boolean; message: string }>(`/inventory/${id}`);
    return response.data;
  },

  addStock: async (id: number, amount: number) => {
    const response = await api.post<{ success: boolean; message: string; data: any }>(`/inventory/${id}/stock`, { amount });
    return response.data.data;
  },
};
