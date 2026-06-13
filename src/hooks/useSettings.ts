import { useQuery } from '@tanstack/react-query';
import { settingsService } from '@/services/settings.service';

export interface BusinessSettingsData {
  businessName: string;
  operatingHours: { open: string; close: string };
  address: string;
  phone: string;
  email: string;
  bookingSettings: { minAdvanceHours: number; maxAdvanceDays: number; barberSelectionFee: number };
}

const fallbackSettings: BusinessSettingsData = {
  businessName: 'Suma Barber',
  operatingHours: { open: '09:00', close: '21:00' },
  address: 'Jl. Sudirman No. 123, Jakarta Pusat',
  phone: '+62 812 3456 7890',
  email: 'info@sumabarber.com',
  bookingSettings: { minAdvanceHours: 1, maxAdvanceDays: 7, barberSelectionFee: 10000 },
};

export function useSettings() {
  return useQuery<BusinessSettingsData>({
    queryKey: ['settings'],
    queryFn: async () => {
      try {
        return await settingsService.getSettings();
      } catch {
        return fallbackSettings;
      }
    },
    staleTime: 5 * 60_000,
    placeholderData: fallbackSettings,
  });
}
