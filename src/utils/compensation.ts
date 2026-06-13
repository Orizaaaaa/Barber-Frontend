export type CompensationType = 'COMMISSION' | 'FIXED' | 'HYBRID';

export const COMPENSATION_TYPE_LABELS: Record<CompensationType, string> = {
  COMMISSION: 'Komisi (% omzet)',
  FIXED: 'Gaji tetap',
  HYBRID: 'Gaji + komisi',
};

export const COMPENSATION_TYPE_DESCRIPTIONS: Record<CompensationType, string> = {
  COMMISSION: 'Dibayar berdasarkan persentase dari booking selesai yang sudah lunas.',
  FIXED: 'Gaji pokok bulanan (diprorata sesuai periode slip gaji).',
  HYBRID: 'Gaji pokok + komisi dari omzet booking selesai yang lunas.',
};

export const PAYROLL_TYPE_LABELS: Record<string, string> = {
  COMMISSION: 'Komisi',
  FIXED: 'Gaji tetap',
  HYBRID: 'Gaji + komisi',
};

export function formatRate(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}
