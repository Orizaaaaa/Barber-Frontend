import { useQuery } from '@tanstack/react-query';
import { barberService } from '@/services/barber.service';
import { Barber } from '@/types';

export function useBarbers() {
  return useQuery<Barber[]>({
    queryKey: ['barbers'],
    queryFn: async () => {
      const data = await barberService.getBarbers();
      return Array.isArray(data) ? data : [];
    },
  });
}
