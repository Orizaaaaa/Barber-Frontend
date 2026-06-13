import api from './api';

export const reviewService = {
  listReviews: async (params?: any) => {
    const response = await api.get<{ success: boolean; message: string; data: any[] }>('/reviews', { params });
    return response.data.data;
  },

  getReview: async (bookingId: number) => {
    const response = await api.get<{ success: boolean; message: string; data: any }>(`/reviews/${bookingId}`);
    return response.data.data;
  },

  createReview: async (data: any) => {
    const response = await api.post<{ success: boolean; message: string; data: any }>('/reviews', data);
    return response.data.data;
  },
};
