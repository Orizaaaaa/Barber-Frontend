import api from './api';

export const resourceService = {
  listResources: async (params?: any) => {
    const response = await api.get<{ success: boolean; message: string; data: any[] }>('/resources', { params });
    return response.data.data;
  },

  getResource: async (id: number) => {
    const response = await api.get<{ success: boolean; message: string; data: any }>(`/resources/${id}`);
    return response.data.data;
  },

  createResource: async (data: any) => {
    const response = await api.post<{ success: boolean; message: string; data: any }>('/resources', data);
    return response.data.data;
  },

  updateResource: async (id: number, data: any) => {
    const response = await api.patch<{ success: boolean; message: string; data: any }>(`/resources/${id}`, data);
    return response.data.data;
  },

  deleteResource: async (id: number) => {
    const response = await api.delete<{ success: boolean; message: string }>(`/resources/${id}`);
    return response.data;
  },
};
