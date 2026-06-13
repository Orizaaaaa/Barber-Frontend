import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useCallback } from 'react';
import { bookingService } from '@/services/booking.service';
import { barberService } from '@/services/barber.service';
import { serviceService } from '@/services/service.service';
import { resourceService } from '@/services/resource.service';
import { bookingSchema, BookingFormData } from '../schemas/booking.schema';
import { Barber, Service } from '@/types';

export const useBooking = () => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      barberId: '',
      serviceId: '',
      resourceId: '',
      date: '',
      startTime: '',
      promoCode: '',
    },
  });

  const loadBarbersAndServices = useCallback(async () => {
    setLoading(true);
    try {
      const [barbersData, servicesData, resourcesData] = await Promise.all([
        barberService.getBarbers(),
        serviceService.getServices(),
        resourceService.listResources({ activeOnly: true }),
      ]);
      const activeBarbers = barbersData.filter((b) => b.isActive);
      setBarbers(activeBarbers);
      setServices(servicesData);
      setResources(resourcesData);
      setMessage('');
    } catch {
      setMessage('Failed to load barbers, services, and resources');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAvailableSlots = useCallback(async (barberId: string, date: string) => {
    if (!barberId || !date) {
      setAvailableSlots([]);
      return;
    }
    try {
      const slots = await barberService.getAvailability(barberId, date);
      setAvailableSlots(slots);
    } catch {
      setAvailableSlots([]);
    }
  }, []);

  const onSubmit = async (data: BookingFormData) => {
    try {
      await bookingService.createBooking({
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        barberId: data.barberId,
        serviceId: data.serviceId,
        resourceId: data.resourceId || undefined,
        date: data.date,
        startTime: data.startTime,
        promoCode: data.promoCode,
      });
      setMessage(
        'Reservasi berhasil! Tim kami akan mengonfirmasi jadwal Anda. Pembayaran dilakukan saat kunjungan di barbershop.'
      );
      form.reset();
      setAvailableSlots([]);
    } catch (error: unknown) {
      const err = error as { displayMessage?: string; response?: { data?: { message?: string } }; message?: string };
      setMessage(err.displayMessage || err.response?.data?.message || err.message || 'Gagal membuat booking');
    }
  };

  const watchedBarberId = form.watch('barberId');
  const watchedServiceId = form.watch('serviceId');
  const selectedBarber = barbers.find((b) => String(b.id) === watchedBarberId);
  const selectedService = services.find((s) => String(s.id) === watchedServiceId);

  return {
    form,
    onSubmit,
    barbers,
    services,
    resources,
    availableSlots,
    loading,
    message,
    loadBarbersAndServices,
    loadAvailableSlots,
    selectedBarber,
    selectedService,
    isSubmitting: form.formState.isSubmitting,
  };
};
