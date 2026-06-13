import api from './api';
import { mapSettingsFromApi, mapSettingsToApi } from '@/utils/normalize';

export const settingsService = {
  getSettings: async () => {
    const response = await api.get<{ success: boolean; message: string; data: Record<string, unknown> }>('/settings');
    return mapSettingsFromApi(response.data.data ?? null);
  },

  updateSettings: async (data: Parameters<typeof mapSettingsToApi>[0]) => {
    const response = await api.patch<{ success: boolean; message: string; data: Record<string, unknown> }>(
      '/settings',
      mapSettingsToApi(data)
    );
    return mapSettingsFromApi(response.data.data ?? null);
  },
};
