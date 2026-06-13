import { useQuery } from '@tanstack/react-query';
import { payrollService } from '@/services/payroll.service';
import { Payroll } from '@/types';

export function usePayrolls(barberId?: number | null) {
  return useQuery<Payroll[]>({
    queryKey: ['payrolls', barberId],
    queryFn: async () => {
      const params: { barberId?: number } = {};
      if (barberId) params.barberId = barberId;
      const data = await payrollService.listPayrolls(params);
      return Array.isArray(data) ? data : [];
    },
  });
}
