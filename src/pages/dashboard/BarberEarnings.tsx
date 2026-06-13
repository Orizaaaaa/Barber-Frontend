import React, { useState, useMemo } from 'react';
import { useBarberEarnings } from '@/hooks/useBarberEarnings';
import { TrendingUp, Calendar, Clock, ChevronLeft, ChevronRight, Wallet } from 'lucide-react';

type Period = 'day' | 'week' | 'month';

const PERIOD_LABELS: Record<Period, string> = {
  day: 'Hari',
  week: 'Minggu',
  month: 'Bulan',
};

function formatDateLabel(period: Period, date: Date): string {
  if (period === 'day') {
    return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  } else if (period === 'week') {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  } else {
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  }
}

function shiftDate(period: Period, date: Date, direction: number): Date {
  const d = new Date(date);
  if (period === 'day') {
    d.setDate(d.getDate() + direction);
  } else if (period === 'week') {
    d.setDate(d.getDate() + (7 * direction));
  } else {
    d.setMonth(d.getMonth() + direction);
  }
  return d;
}

const BarberEarnings: React.FC = () => {
  const [period, setPeriod] = useState<Period>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  const dateStr = currentDate.toISOString().split('T')[0];
  const { data, isLoading } = useBarberEarnings(period, dateStr);

  const isToday = useMemo(() => {
    const now = new Date();
    if (period === 'day') {
      return currentDate.toDateString() === now.toDateString();
    } else if (period === 'week') {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const currentWeekStart = new Date(currentDate);
      currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay());
      return weekStart.toDateString() === currentWeekStart.toDateString();
    } else {
      return currentDate.getMonth() === now.getMonth() && currentDate.getFullYear() === now.getFullYear();
    }
  }, [period, currentDate]);

  const goNext = () => setCurrentDate(shiftDate(period, currentDate, 1));
  const goPrev = () => setCurrentDate(shiftDate(period, currentDate, -1));
  const goToday = () => setCurrentDate(new Date());

  const formatRp = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-12 h-12 border-4 border-neutral-100 dark:border-neutral-800 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16 text-neutral-500">
        Gagal memuat data penghasilan
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header + Period Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">Penghasilan Saya</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            {data.compensationType === 'COMMISSION' && `Komisi ${Math.round(data.commissionRate * 100)}% per booking`}
            {data.compensationType === 'FIXED' && 'Gaji tetap bulanan'}
            {data.compensationType === 'HYBRID' && `Gaji + komisi ${Math.round(data.commissionRate * 100)}%`}
          </p>
        </div>
        <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-lg p-0.5">
          {(['day', 'week', 'month'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => { setPeriod(p); setCurrentDate(new Date()); }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${period === p
                ? 'bg-white dark:bg-neutral-700 text-accent shadow-sm'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl px-4 py-3">
        <button
          onClick={goPrev}
          className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-neutral-400" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-neutral-900 dark:text-white">
            {formatDateLabel(period, currentDate)}
          </span>
          {!isToday && (
            <button
              onClick={goToday}
              className="px-2 py-0.5 bg-accent/10 text-accent text-[10px] font-bold rounded uppercase tracking-wider hover:bg-accent/20 transition-colors cursor-pointer"
            >
              Hari ini
            </button>
          )}
        </div>
        <button
          onClick={goNext}
          disabled={isToday}
          className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Period Commission */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-accent" />
            </div>
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Komisi {PERIOD_LABELS[period]}</span>
          </div>
          <p className="text-2xl font-black text-neutral-900 dark:text-white">{formatRp(data.periodStats.commission)}</p>
          <p className="text-xs text-neutral-400 mt-1">{data.periodStats.bookingCount} booking selesai</p>
        </div>

        {/* Unpaid */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/30 dark:from-amber-950/20 dark:to-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Belum Dibayar</span>
          </div>
          <p className="text-2xl font-black text-amber-900 dark:text-amber-100">{formatRp(data.unpaid.commission)}</p>
          <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">dari omzet {formatRp(data.unpaid.revenue)}</p>
        </div>

        {/* Paid Out */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/30 dark:from-emerald-950/20 dark:to-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
              <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Sudah Dibayar</span>
          </div>
          <p className="text-2xl font-black text-emerald-900 dark:text-emerald-100">{formatRp(data.paidOut.total)}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">{data.paidOut.payrollCount}x payroll</p>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent" />
            Riwayat
          </h2>
          <span className="text-xs text-neutral-400">{data.dailyBreakdown.length} hari</span>
        </div>

        {data.dailyBreakdown.length === 0 ? (
          <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800">
            <Calendar className="w-10 h-10 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
            <p className="text-sm text-neutral-400">Belum ada riwayat booking</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.dailyBreakdown.map((day) => (
              <div
                key={day.date}
                className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl overflow-hidden"
              >
                {/* Day Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-neutral-50/50 dark:bg-neutral-800/30">
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="text-lg font-black text-accent leading-none">
                        {new Date(day.date).toLocaleDateString('id-ID', { day: 'numeric' })}
                      </p>
                      <p className="text-[10px] text-neutral-400 uppercase">
                        {new Date(day.date).toLocaleDateString('id-ID', { month: 'short' })}
                      </p>
                    </div>
                    <div className="border-l border-neutral-200 dark:border-neutral-700 pl-3">
                      <p className="text-sm font-bold text-neutral-900 dark:text-white">
                        {new Date(day.date).toLocaleDateString('id-ID', { weekday: 'long' })}
                      </p>
                      <p className="text-[11px] text-neutral-400">{day.count} booking · {formatRp(day.revenue)} omzet</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-accent">+{formatRp(day.commission)}</p>
                    <p className="text-[10px] text-neutral-400">komisi</p>
                  </div>
                </div>

                {/* Bookings */}
                <div className="divide-y divide-neutral-50 dark:divide-neutral-800/50">
                  {day.bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-neutral-400 w-10">{booking.time}</span>
                        <div>
                          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{booking.service}</p>
                          <p className="text-[11px] text-neutral-400">{booking.customer}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">{formatRp(booking.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex items-start gap-3 p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl text-xs text-neutral-400 leading-relaxed">
        <Clock className="w-4 h-4 flex-shrink-0 mt-0.5 text-neutral-300" />
        <p>
          "Belum Dibayar" adalah estimasi komisi yang belum diterima dari barbershop.
          Setelah admin membayar via Payroll, jumlah berkurang dan masuk ke "Sudah Dibayar".
        </p>
      </div>
    </div>
  );
};

export default BarberEarnings;
