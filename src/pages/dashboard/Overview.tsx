import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useBookings } from '@/hooks/useBookings';
import { useBarbers } from '@/hooks/useBarbers';
import { findBarberProfileId } from '@/utils/barber';
import { Calendar, DollarSign, Users, TrendingUp, Clock, Star, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '@/components/dashboard/StatCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { SkeletonOverview } from '@/components/dashboard/Skeleton';

const Overview: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const isBarber = user?.role === 'BARBER';
  const isCustomer = user?.role === 'CUSTOMER';

  const { data: barbers = [] } = useBarbers();

  const barberProfileId = isBarber && user?.id
    ? findBarberProfileId(barbers, user.id)
    : undefined;

  const bookingFilters = {
    ...(isCustomer && user?.id ? { customerId: user.id } : {}),
    ...(isBarber && barberProfileId ? { barberId: barberProfileId } : {}),
  };

  const { data: bookings = [], isLoading } = useBookings(
    bookingFilters,
    !!user
  );

  if (isLoading) {
    return <SkeletonOverview />;
  }

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED').length;
  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED').length;
  const activeBarbersCount = barbers.filter((b) => b.isActive).length;

  const currentBarberProfile = isBarber
    ? barbers.find((b) => String(b.userId) === String(user?.id) || String(b.user?.id) === String(user?.id))
    : null;
  const commissionRate = currentBarberProfile?.commissionRate ?? 0.3;
  const commission = totalRevenue * commissionRate;

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
          Welcome, {user?.name}!
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
        {isAdmin && (
          <>
            <div className="animate-fade-in-up delay-100">
              <StatCard
                label="Total Revenue"
                value={`Rp ${totalRevenue.toLocaleString()}`}
                icon={DollarSign}
              />
            </div>
            <div className="animate-fade-in-up delay-200">
              <StatCard
                label="Active Barbers"
                value={activeBarbersCount}
                icon={Users}
                trend={[4, 4, 3, 4, 4, 4, 4]}
              />
            </div>
          </>
        )}

        {isBarber && (
          <>
            <div className="animate-fade-in-up delay-100">
              <StatCard
                label="Total Earnings"
                value={`Rp ${totalRevenue.toLocaleString()}`}
                icon={DollarSign}
              />
            </div>
            <div className="animate-fade-in-up delay-200">
              <StatCard
                label={`Commission (${Math.round(commissionRate * 100)}%)`}
                value={`Rp ${commission.toLocaleString()}`}
                icon={TrendingUp}
                color="#10B981"
              />
            </div>
          </>
        )}

        {isCustomer && (
          <div className="animate-fade-in-up delay-100">
            <StatCard
              label="Loyalty Points"
              value="150"
              icon={Star}
            />
          </div>
        )}

        <div className="animate-fade-in-up delay-300">
          <StatCard
            label="Total Bookings"
            value={bookings.length}
            icon={Calendar}
            trend={[10, 12, 8, 15, 14, 18, 14]}
          />
        </div>
        <div className="animate-fade-in-up delay-400">
          <StatCard
            label="Confirmed"
            value={confirmedBookings}
            icon={Clock}
            trend={[2, 5, 3, 6, 4, 7, 5]}
          />
        </div>
        <div className="animate-fade-in-up delay-500">
          <StatCard
            label="Completed"
            value={completedBookings}
            icon={CheckCircle2}
            trend={[5, 8, 4, 9, 7, 10, 8]}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 animate-fade-in-up delay-300">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Recent Activity</h2>
          <Link to="/dashboard/bookings" className="text-sm font-bold text-accent hover:underline flex items-center gap-1 cursor-pointer">
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-700">
            <Calendar className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-2">No recent activity found</p>
            <Link to="/booking" className="text-sm font-bold text-accent hover:underline cursor-pointer">
              Book your first appointment
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-neutral-50 dark:divide-neutral-800">
            {bookings.slice(0, 6).map((booking, index) => (
              <div
                key={booking.id}
                className="py-5 first:pt-0 last:pb-0 group transition-all animate-fade-in-up"
                style={{ animationDelay: `${(index + 4) * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 group-hover:text-accent transition-colors">
                      {booking.service?.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <div className="text-[16px] font-bold text-neutral-900 dark:text-white group-hover:text-accent transition-colors">
                        {booking.service?.name || 'Service'}
                      </div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center gap-2 mt-0.5">
                        <span>{new Date(booking.bookingDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</span>
                        <span className="w-1 h-1 rounded-full bg-neutral-300" />
                        <span>{booking.startTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[16px] font-bold text-neutral-900 dark:text-white mb-1.5">
                      Rp {booking.totalAmount?.toLocaleString()}
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;
