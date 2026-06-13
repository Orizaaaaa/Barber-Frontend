import { z } from 'zod';

export const bookingSchema = z.object({
  customerName: z.string().min(1, 'Please enter your name'),
  customerPhone: z.string().min(10, 'Please enter a valid phone number'),
  barberId: z.string().min(1, 'Please select a barber'),
  serviceId: z.string().min(1, 'Please select a service'),
  resourceId: z.string().optional(),
  date: z.string().min(1, 'Please select a date'),
  startTime: z.string().min(1, 'Please select a time slot'),
  promoCode: z.string().optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;
