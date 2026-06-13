import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { barberService } from '@/services/barber.service';
import { Barber } from '@/types';
import { Scissors, Star, ArrowRight, ChevronRight, Clock } from 'lucide-react';

export const Barbers: React.FC = () => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBarbers();
  }, []);

  const loadBarbers = async () => {
    try {
      const data = await barberService.getBarbers();
      setBarbers(data);
    } catch (error) {
      console.error('Error loading barbers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-neutral-100 dark:border-neutral-800 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Loading barbers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero section */}
      <section className="relative bg-neutral-950 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-gold-600/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full mb-6">
              <Scissors className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold text-white/70 uppercase tracking-[0.2em]">Our Team</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-display-lg font-black text-white font-serif tracking-tight mb-4">
              Meet Our <span className="text-gradient-gold">Master Barbers</span>
            </h1>
            <p className="text-neutral-400 max-w-lg mx-auto text-lg">
              Professional stylists dedicated to crafting your perfect look.
            </p>
          </div>
        </div>
      </section>

      {/* Barbers grid */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {barbers.map((barber, i) => (
            <div
              key={barber.id}
              className="group bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 hover:border-accent/20 transition-all duration-300 hover-lift cursor-pointer"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-gold-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-gold group-hover:shadow-gold-lg transition-shadow">
                  {barber.user?.name?.charAt(0) || '?'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-accent transition-colors">
                    {barber.user?.name || 'Unknown'}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{barber.specialty || 'Master Barber'}</p>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <Star className="w-4 h-4 text-gold-500" />
                  <span>{barber.specialty || 'All styles'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <Clock className="w-4 h-4 text-neutral-400" />
                  <span>Available today</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-neutral-50 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  {barber.isActive ? (
                    <>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Active</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-neutral-300 rounded-full" />
                      <span className="text-xs font-semibold text-neutral-400">Inactive</span>
                    </>
                  )}
                </div>
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-accent hover:text-accent-hover transition-colors cursor-pointer group/link"
                >
                  Book Now
                  <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {barbers.length === 0 && !loading && (
          <div className="text-center py-20 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Scissors className="w-8 h-8 text-neutral-300 dark:text-neutral-600" />
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-2">No barbers available at the moment</p>
            <p className="text-sm text-neutral-400 dark:text-neutral-500">Please check back later</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-20">
        <div className="relative bg-neutral-900 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-600/10 rounded-full blur-[60px]" />

          <div className="max-w-xl text-center md:text-left relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white font-serif mb-4 leading-tight">
              Ready to Book with <span className="text-gradient-gold">Our Team?</span>
            </h2>
            <p className="text-neutral-400 text-lg">
              Choose your preferred barber and schedule an appointment today.
            </p>
          </div>
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-accent to-gold-600 hover:from-accent-hover hover:to-gold-700 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all duration-200 shadow-gold hover:shadow-gold-lg cursor-pointer whitespace-nowrap relative z-10 group"
          >
            Book Appointment
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Barbers;
