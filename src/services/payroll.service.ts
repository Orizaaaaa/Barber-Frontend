import api from './api';
import { Payroll, PayrollPreview } from '@/types';

export const payrollService = {
  listPayrolls: async (params?: { barberId?: number }) => {
    const response = await api.get<{ success: boolean; message: string; data: Payroll[] }>('/payrolls', {
      params,
    });
    return response.data.data;
  },

  previewPayroll: async (
    barberId: string | number,
    periodStart: string,
    periodEnd: string,
    options?: { bonus?: number; deductions?: number }
  ): Promise<PayrollPreview> => {
    const response = await api.get<{ success: boolean; message: string; data: PayrollPreview }>(
      `/payrolls/preview/${barberId}`,
      { params: { periodStart, periodEnd, ...options } }
    );
    return response.data.data;
  },

  generatePayroll: async (data: {
    barberId: string | number;
    periodStart: string;
    periodEnd: string;
    bonus?: number;
    deductions?: number;
  }): Promise<Payroll> => {
    const response = await api.post<{ success: boolean; message: string; data: Payroll }>(
      '/payrolls/generate',
      { ...data, barberId: Number(data.barberId) }
    );
    return response.data.data;
  },

  markPaid: async (id: number) => {
    const response = await api.patch<{ success: boolean; message: string; data: Payroll }>(
      `/payrolls/${id}/paid`
    );
    return response.data.data;
  },
};
