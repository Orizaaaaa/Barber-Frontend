import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { payrollService } from '@/services/payroll.service';
import { usePayrolls } from '@/hooks/usePayrolls';
import { useBarbers } from '@/hooks/useBarbers';
import { Payroll } from '@/types';
import { findBarberProfileId } from '@/utils/barber';
import { PAYROLL_TYPE_LABELS } from '@/utils/compensation';
import PageHeader from '@/components/dashboard/PageHeader';
import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import PayrollDetailModal from '@/components/dashboard/PayrollDetailModal';
import PayrollCreateModal from '@/components/dashboard/PayrollCreateModal';
import { Wallet, Info } from 'lucide-react';

const PayrollList: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  const { data: barbers = [] } = useBarbers();

  const barberProfileId = user?.role === 'BARBER' && user?.id
    ? findBarberProfileId(barbers, user.id)
    : undefined;

  const { data: payrolls = [], isLoading } = usePayrolls(barberProfileId);

  const invalidatePayrolls = () => queryClient.invalidateQueries({ queryKey: ['payrolls'] });

  const handleView = (payroll: Payroll) => {
    setSelectedPayroll(payroll);
    setIsDetailOpen(true);
  };

  const handleMarkPaid = async (payroll: Payroll) => {
    try {
      await payrollService.markPaid(payroll.id);
      invalidatePayrolls();
      setIsDetailOpen(false);
    } catch (e) {
      console.error('Error marking as paid:', e);
    }
  };

  const columns = [
    {
      key: 'barber' as keyof Payroll,
      label: 'Barber',
      render: (value: Payroll['barber']) => value?.user?.name || '–',
    },
    {
      key: 'type' as keyof Payroll,
      label: 'Skema',
      render: (value: string) => PAYROLL_TYPE_LABELS[value] || value || '–',
    },
    {
      key: 'total' as keyof Payroll,
      label: 'Total dibayar',
      render: (value: number) => `Rp ${value?.toLocaleString('id-ID') || 0}`,
    },
    {
      key: 'commission' as keyof Payroll,
      label: 'Komisi',
      render: (value: number, row: Payroll) =>
        row.type === 'FIXED' ? '–' : `Rp ${(value ?? 0).toLocaleString('id-ID')}`,
    },
    {
      key: 'baseSalary' as keyof Payroll,
      label: 'Gaji pokok',
      render: (value: number, row: Payroll) =>
        row.type === 'COMMISSION' ? '–' : `Rp ${(value ?? 0).toLocaleString('id-ID')}`,
    },
    {
      key: 'isPaid' as keyof Payroll,
      label: 'Status',
      render: (value: boolean) => <StatusBadge status={value ? 'PAID' : 'PENDING'} />,
    },
    {
      key: 'periodStart' as keyof Payroll,
      label: 'Periode',
      render: (value: string, row: Payroll) =>
        `${new Date(value).toLocaleDateString('id-ID')} – ${new Date(row.periodEnd).toLocaleDateString('id-ID')}`,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-12 h-12 border-4 border-neutral-300 dark:border-neutral-700 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Gaji & Komisi"
        subtitle="Atur skema di menu Barbers, lalu generate slip gaji per periode"
        action={
          isAdmin && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <Wallet className="w-4 h-4" />
              Buat slip gaji
            </button>
          )
        }
      />

      {isAdmin && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl text-sm">
          <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-amber-700 dark:text-amber-300/90 space-y-1">
            <p>
              <strong>Komisi</strong> — % dari booking selesai + lunas di periode tersebut.
            </p>
            <p>
              <strong>Gaji tetap</strong> — gaji bulanan diprorata menurut hari periode.
            </p>
            <p>
              <strong>Gaji + komisi</strong> — keduanya dijumlahkan.
            </p>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={payrolls}
        onRowClick={handleView}
        searchable
        searchPlaceholder="Cari slip gaji..."
      />

      <PayrollDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        payroll={selectedPayroll}
        isAdmin={isAdmin}
        onMarkPaid={handleMarkPaid}
      />

      {isAdmin && (
        <PayrollCreateModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          barbers={barbers}
          onSuccess={invalidatePayrolls}
        />
      )}
    </div>
  );
};

export default PayrollList;
