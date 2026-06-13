import { useQuery } from '@tanstack/react-query';
import { barberEarningsService, BarberEarningsData } from '@/services/barberEarnings.service';

export function useBarberEarnings(period: 'day' | 'week' | 'month' = 'month', date?: string, enabled = true) {
  return useQuery<BarberEarningsData>({
    queryKey: ['barber-earnings', period, date],
    queryFn: () => barberEarningsService.getMyEarnings(period, date),
    enabled,
    staleTime: 30_000,
  });
}
