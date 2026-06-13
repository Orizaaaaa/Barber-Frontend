import { Barber } from '@/types';

export function getBarberDisplayName(barber?: Barber | null): string {
  if (!barber) return 'N/A';
  return barber.user?.name ?? 'N/A';
}

export function findBarberProfileId(barbers: Barber[], userId: string | number): number | null {
  const id = String(userId);
  const match = barbers.find(
    (b) => String(b.userId) === id || String(b.user?.id) === id
  );
  return match?.id ?? null;
}
