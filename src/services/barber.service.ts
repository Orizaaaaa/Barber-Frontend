import api from './api';
import { Barber } from '@/types';

export const barberService = {
  getBarbers: async (): Promise<Barber[]> => {
    const response = await api.get<{ success: boolean; message: string; data: Barber[] }>('/barbers');
    return response.data.data;
  },

  getBarber: async (id: number): Promise<Barber> => {
    const response = await api.get<{ success: boolean; message: string; data: Barber }>(`/barbers/${id}`);
    return response.data.data;
  },

  createBarber: async (data: any): Promise<Barber> => {
    const response = await api.post<{ success: boolean; message: string; data: Barber }>('/barbers', data);
    return response.data.data;
  },

  updateBarber: async (id: number, data: any): Promise<Barber> => {
    const response = await api.patch<{ success: boolean; message: string; data: Barber }>(`/barbers/${id}`, data);
    return response.data.data;
  },

  setSchedule: async (id: number, data: any): Promise<any> => {
    const response = await api.post<{ success: boolean; message: string; data: any }>(`/barbers/${id}/schedule`, data);
    return response.data.data;
  },

  getAvailability: async (barberId: string | number, date: string): Promise<string[]> => {
    const response = await api.get<{ success: boolean; message: string; data: { available: boolean; slots: string[] } }>(`/barbers/${barberId}/availability`, {
      params: { date }
    });
    return response.data.data.slots || [];
  },

  addPortfolio: async (id: number, data: any): Promise<any> => {
    const response = await api.post<{ success: boolean; message: string; data: any }>(`/barbers/${id}/portfolio`, data);
    return response.data.data;
  },

  removePortfolio: async (id: number, portfolioId: number): Promise<any> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/barbers/${id}/portfolio/${portfolioId}`);
    return response.data;
  },
};
