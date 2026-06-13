import React, { useState, useEffect, useMemo } from 'react';
import { reportService } from '@/services/report.service';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Calendar, Users } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';

const COLORS = ['#92702A', '#7A5C22', '#A78B4A', '#D6D3C9', '#57534E', '#44403C', '#292524'];

const ReportDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [revenueReport, setRevenueReport] = useState<any>(null);
  const [bookingsReport, setBookingsReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dash, revenue, bookings] = await Promise.all([
        reportService.getDashboard(),
        reportService.getRevenue(),
        reportService.getBookings(),
      ]);
      setDashboardData(dash);
      setRevenueReport(revenue);
      setBookingsReport(bookings);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const serviceRevenueData = useMemo(() => {
    if (!revenueReport?.byService) return [];
    return Object.entries(revenueReport.byService).map(([name, value]) => ({
      name,
      value: value as number,
    }));
  }, [revenueReport]);

  const barberRevenueData = useMemo(() => {
    if (!revenueReport?.byBarber) return [];
    return Object.entries(revenueReport.byBarber).map(([name, value]) => ({
      name,
      value: value as number,
    }));
  }, [revenueReport]);

  const bookingStatusData = useMemo(() => {
    if (!bookingsReport?.statusCounts) return [];
    return Object.entries(bookingsReport.statusCounts).map(([name, value]) => ({
      name,
      value: value as number,
    }));
  }, [bookingsReport]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-12 h-12 border-4 border-neutral-700 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">Reports & Analytics</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">Detailed performance overview of your shop.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Revenue"
          value={`Rp ${(dashboardData?.totalRevenue || 0).toLocaleString()}`}
          icon={DollarSign}
          trend={[30, 45, 25, 60, 40, 75, 55]}
        />
        <StatCard
          label="Total Bookings"
          value={dashboardData?.totalBookings || 0}
          icon={Calendar}
          trend={[10, 12, 8, 15, 14, 18, 14]}
          color="#3B82F6"
        />
        <StatCard
          label="Total Customers"
          value={dashboardData?.totalCustomers || 0}
          icon={Users}
          color="#10B981"
        />
        <StatCard
          label="Active Barbers"
          value={dashboardData?.totalBarbers || 0}
          icon={Users}
          color="#F59E0B"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Revenue by Service</h2>
          <p className="text-sm text-neutral-400 mb-6">Total: Rp {(revenueReport?.total || 0).toLocaleString()}</p>
          {serviceRevenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceRevenueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={120}
                  innerRadius={60}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {serviceRevenueData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `Rp ${Number(value).toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E7E5DF', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-neutral-400 text-sm">
              No revenue data yet
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Revenue by Barber</h2>
          <p className="text-sm text-neutral-400 mb-6">Commission breakdown</p>
          {barberRevenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barberRevenueData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E7E5DF" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#78716C', fontSize: 12 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#78716C', fontSize: 12 }} width={100} />
                <Tooltip
                  formatter={(value) => `Rp ${Number(value).toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E7E5DF', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="value" fill="#92702A" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-neutral-400 text-sm">
              No revenue data yet
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Bookings by Service</h2>
          <p className="text-sm text-neutral-400 mb-6">Total: {bookingsReport?.total || 0} bookings</p>
          {bookingStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={120}
                  innerRadius={60}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.name === 'COMPLETED' ? '#10B981'
                          : entry.name === 'CONFIRMED' ? '#3B82F6'
                            : entry.name === 'PENDING' ? '#F59E0B'
                              : entry.name === 'CANCELLED' ? '#EF4444'
                                : COLORS[index % COLORS.length]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E7E5DF', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-neutral-400 text-sm">
              No booking data yet
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Bookings by Barber</h2>
          <p className="text-sm text-neutral-400 mb-6">Workload distribution</p>
          {bookingsReport?.byBarber && Object.keys(bookingsReport.byBarber).length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Object.entries(bookingsReport.byBarber).map(([name, value]) => ({ name, value }))} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E7E5DF" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#78716C', fontSize: 12 }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#78716C', fontSize: 12 }} width={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E7E5DF', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="value" fill="#A78B4A" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-neutral-400 text-sm">
              No booking data yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportDashboard;
