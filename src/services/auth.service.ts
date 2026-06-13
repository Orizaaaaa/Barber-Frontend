import api from './api';
import { LoginCredentials, RegisterData, AuthResponse, User } from '@/types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<{ success: boolean; message: string; data: AuthResponse }>('/auth/login', credentials);
    return response.data.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<{ success: boolean; message: string; data: AuthResponse }>('/auth/register', data);
    return response.data.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<{ success: boolean; message: string; data: User }>('/auth/me');
    return response.data.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
