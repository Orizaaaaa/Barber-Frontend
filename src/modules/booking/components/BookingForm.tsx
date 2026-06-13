import React, { useEffect, useMemo } from 'react';
import { useBooking } from '../actions/useBookingActions';
import { useSettings } from '@/hooks/useSettings';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Scissors, CheckCircle2, Calendar, User, CreditCard, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import BarberSelection from './BarberSelection';
import ServiceSelection from './ServiceSelection';
import TimeSelection from './TimeSelection';
import BookingSummary from './BookingSummary';

export const BookingForm: React.FC = () => {
  const {
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
    isSubmitting,
    selectedBarber,
    selectedService,
  } = useBooking();

  const { data: settings } = useSettings();

  const { register, handleSubmit, watch, formState: { errors } } = form;
  const watchedBarberId = watch('barberId');
  const watchedDate = watch('date');
  const watchedServiceId = watch('serviceId');
  const watchedStartTime = watch('startTime');

  useEffect(() => {
    loadBarbersAndServices();
  }, [loadBarbersAndServices]);

  useEffect(() => {
    if (watchedBarberId && watchedDate) {
      loadAvailableSlots(watchedBarberId, watchedDate);
    } else {
      form.setValue('startTime', '');
    }
  }, [watchedBarberId, watchedDate, loadAvailableSlots, form]);

  const today = new Date().toISOString().split('T')[0];
  const maxAdvanceDays = settings?.bookingSettings?.maxAdvanceDays || 7;
  const maxDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + maxAdvanceDays);
    return d.toISOString().split('T')[0];
  }, [maxAdvanceDays]);

  const steps = [
    { id: 1, label: 'Info', icon: User, completed: !!watch('customerName') && !!watch('customerPhone') },
    { id: 2, label: 'Barber', icon: Scissors, completed: !!watchedBarberId },
    { id: 3, label: 'Service', icon: CheckCircle2, completed: !!watchedServiceId },
    { id: 4, label: 'Schedule', icon: Calendar, completed: !!watchedDate && !!watchedStartTime },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-neutral-100 dark:border-neutral-800 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Loading booking form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-accent transition-colors mb-6 cursor-pointer group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-light dark:bg-accent/10 rounded-full mb-4">
              <Scissors className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold text-accent uppercase tracking-[0.2em]">Reservation</span>
            </div>
            <h1 className="text-4xl font-black text-neutral-900 dark:text-white font-serif tracking-tight mb-2">Book Your Style</h1>
            <p className="text-neutral-500 dark:text-neutral-400">Select your preferred service, barber, and time.</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((step, i) => (
            <React.Fragment key={step.id}>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${step.completed
                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                }`}>
                <step.icon className="w-4 h-4" />
                <span className="text-xs font-semibold hidden sm:block">{step.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 h-0.5 rounded-full transition-colors ${step.completed ? 'bg-emerald-300 dark:bg-emerald-700' : 'bg-neutral-200 dark:bg-neutral-700'
                  }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 md:p-10 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {message && (
              <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 animate-fade-in ${message.includes('berhasil')
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400'
                : 'bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 text-red-700 dark:text-red-400'
                }`}>
                {message}
              </div>
            )}

            {/* Customer Info */}
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                Your Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">Full Name</label>
                  <Input placeholder="Enter your name" error={errors.customerName?.message} {...register('customerName')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">Phone Number</label>
                  <Input type="tel" placeholder="e.g. 0812..." error={errors.customerPhone?.message} {...register('customerPhone')} />
                </div>
              </div>
            </div>

            <BarberSelection
              barbers={barbers}
              selectedId={watchedBarberId}
              onSelect={(id) => form.setValue('barberId', id)}
              error={errors.barberId?.message}
              selectionFee={settings?.bookingSettings?.barberSelectionFee}
            />
            <input type="hidden" {...register('barberId')} />

            <ServiceSelection
              services={services}
              selectedId={watchedServiceId}
              onSelect={(id) => form.setValue('serviceId', id)}
              error={errors.serviceId?.message}
            />
            <input type="hidden" {...register('serviceId')} />

            {/* Resource Selection */}
            {resources.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-5 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                  Preferred Resource
                  <span className="text-xs font-normal text-neutral-400 ml-1">(Optional)</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => form.setValue('resourceId', '')}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 text-center cursor-pointer ${!form.watch('resourceId')
                      ? 'border-accent bg-gradient-to-br from-accent to-gold-600 text-white shadow-gold'
                      : 'border-neutral-100 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-accent/30'
                      }`}
                  >
                    <p className="text-sm font-bold">No Preference</p>
                  </button>
                  {resources.map((resource) => (
                    <button
                      key={resource.id}
                      type="button"
                      onClick={() => form.setValue('resourceId', resource.id)}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 text-center cursor-pointer ${form.watch('resourceId') === resource.id
                        ? 'border-accent bg-gradient-to-br from-accent to-gold-600 text-white shadow-gold'
                        : 'border-neutral-100 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-accent/30'
                        }`}
                    >
                      <p className="text-sm font-bold">{resource.name}</p>
                      <p className="text-xs opacity-75 capitalize">{resource.type}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Promo Code */}
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                Promo Code
                <span className="text-xs font-normal text-neutral-400 ml-1">(Optional)</span>
              </h2>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Enter promo code"
                  {...register('promoCode')}
                  className="input-field pl-10 uppercase font-mono font-semibold text-accent"
                  onChange={(e) => form.setValue('promoCode', e.target.value.toUpperCase())}
                />
              </div>
            </div>

            <TimeSelection
              dateError={errors.date?.message}
              dateRegister={register('date')}
              availableSlots={availableSlots}
              selectedTime={watchedStartTime}
              onSelectTime={(time) => form.setValue('startTime', time)}
              timeError={errors.startTime?.message}
              timeRegister={register('startTime')}
              today={today}
              maxDate={maxDate}
              operatingHours={settings?.operatingHours}
            />

            {selectedService && watchedBarberId && watchedDate && watchedStartTime && (
              <BookingSummary
                service={selectedService}
                barber={selectedBarber}
                date={watchedDate}
                startTime={watchedStartTime}
                isRandomBarber={watchedBarberId === 'random'}
                selectionFee={settings?.bookingSettings?.barberSelectionFee}
              />
            )}

            <div>
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={!watchedBarberId || !watchedServiceId || !watchedDate || !watchedStartTime}
                className="w-full py-4 text-lg font-black disabled:opacity-40"
              >
                {isSubmitting ? 'Processing...' : 'Book Now'}
              </Button>
              <p className="text-center text-neutral-400 text-xs mt-3 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                Free reservation · Pay at the venue
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
