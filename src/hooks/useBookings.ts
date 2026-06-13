import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/services/booking.service';
import { Booking } from '@/types';

export interface BookingFilters {
  customerId?: string | number;
  barberId?: string | number;
  status?: string;
}

export function useBookings(filters: BookingFilters, enabled = true) {
  return useQuery<Booking[]>({
    queryKey: ['bookings', filters],
    queryFn: async () => {
      const params: Record<string, string | number> = {};
      if (filters.customerId) params.customerId = filters.customerId;
      if (filters.barberId) params.barberId = filters.barberId;
      if (filters.status) params.status = filters.status;
      const data = await bookingService.getBookings(params);
      return Array.isArray(data) ? data : [];
    },
    enabled,
  });
}
