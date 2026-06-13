import api from './api';
import { Service } from '@/types';

export const serviceService = {
  getServices: async (): Promise<Service[]> => {
    const response = await api.get<{ success: boolean; message: string; data: Service[] }>('/services');
    return response.data.data;
  },

  getService: async (id: number): Promise<Service> => {
    const response = await api.get<{ success: boolean; message: string; data: Service }>(`/services/${id}`);
    return response.data.data;
  },

  createService: async (data: {
    name: string;
    description?: string;
    price: number;
    duration: number;
  }): Promise<Service> => {
    const response = await api.post<{ success: boolean; message: string; data: Service }>('/services', data);
    return response.data.data;
  },

  updateService: async (id: number, data: {
    name?: string;
    description?: string;
    price?: number;
    duration?: number;
  }): Promise<Service> => {
    const response = await api.patch<{ success: boolean; message: string; data: Service }>(`/services/${id}`, data);
    return response.data.data;
  },

  deleteService: async (id: number): Promise<void> => {
    await api.delete(`/services/${id}`);
  },
};
