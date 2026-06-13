import React, { useState, useEffect } from 'react';
import { barberService } from '@/services/barber.service';
import { Barber } from '@/types';
import PageHeader from '@/components/dashboard/PageHeader';
import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import Modal from '@/components/dashboard/Modal';
import ConfirmDialog from '@/components/dashboard/ConfirmDialog';
import { Plus } from 'lucide-react';
import { SkeletonPage } from '@/components/dashboard/Skeleton';
import {
  COMPENSATION_TYPE_LABELS,
  COMPENSATION_TYPE_DESCRIPTIONS,
  formatRate,
  CompensationType,
} from '@/utils/compensation';

const BarberList: React.FC = () => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialty: '',
    experience: 0,
    bio: '',
    compensationType: 'COMMISSION' as CompensationType,
    baseSalary: 0,
    commissionRate: 30,
  });

  useEffect(() => {
    loadBarbers();
  }, []);

  const loadBarbers = async () => {
    try {
      const data = await barberService.getBarbers();
      setBarbers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading barbers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsAddMode(true);
    setFormData({
      name: '',
      email: '',
      password: '',
      specialty: '',
      experience: 0,
      bio: '',
      compensationType: 'COMMISSION',
      baseSalary: 0,
      commissionRate: 30,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (barber: Barber) => {
    setIsAddMode(false);
    setSelectedBarber(barber);
    setFormData({
      name: barber.user?.name || '',
      email: barber.user?.email || '',
      password: '',
      specialty: barber.specialty,
      experience: barber.experience,
      bio: barber.bio,
      compensationType: (barber.compensationType as CompensationType) || 'COMMISSION',
      baseSalary: barber.baseSalary ?? 0,
      commissionRate: Math.round((barber.commissionRate ?? 0.3) * 100),
    });
    setIsModalOpen(true);
  };

  const handleDelete = (barber: Barber) => {
    setSelectedBarber(barber);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const compensationPayload = {
        compensationType: formData.compensationType,
        baseSalary: formData.baseSalary,
        commissionRate: formData.commissionRate / 100,
      };
      if (isAddMode) {
        const { name, email, password, specialty, experience, bio } = formData;
        await barberService.createBarber({
          name,
          email,
          password,
          specialty,
          experience,
          bio,
          ...compensationPayload,
        });
      } else if (selectedBarber) {
        const { specialty, experience, bio } = formData;
        await barberService.updateBarber(selectedBarber.id, {
          specialty,
          experience,
          bio,
          ...compensationPayload,
        });
      }
      await loadBarbers();
      setIsModalOpen(false);
      setSelectedBarber(null);
    } catch (error) {
      console.error('Error saving barber:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedBarber) return;
    try {
      await barberService.updateBarber(selectedBarber.id, { isActive: false });
      await loadBarbers();
      setIsDeleteDialogOpen(false);
      setSelectedBarber(null);
    } catch (error) {
      console.error('Error deleting barber:', error);
    }
  };

  const columns = [
    {
      key: 'user' as keyof Barber,
      label: 'Name',
      render: (value: any) => value?.name || 'N/A',
    },
    {
      key: 'user' as keyof Barber,
      label: 'Email',
      render: (value: any) => value?.email || 'N/A',
    },
    {
      key: 'compensationType' as keyof Barber,
      label: 'Skema gaji',
      render: (value: string, row: Barber) => {
        const type = (value || 'COMMISSION') as CompensationType;
        const extra =
          type === 'COMMISSION' || type === 'HYBRID'
            ? ` · ${formatRate(row.commissionRate ?? 0.3)}`
            : type === 'FIXED'
              ? ` · Rp ${(row.baseSalary ?? 0).toLocaleString('id-ID')}/bln`
              : '';
        return `${COMPENSATION_TYPE_LABELS[type]?.split('(')[0].trim() || type}${extra}`;
      },
    },
    {
      key: 'specialty' as keyof Barber,
      label: 'Specialty',
    },
    {
      key: 'experience' as keyof Barber,
      label: 'Experience',
      render: (value: number) => `${value} years`,
    },
    {
      key: 'isActive' as keyof Barber,
      label: 'Status',
      render: (value: boolean) => <StatusBadge status={value ? 'ACTIVE' : 'INACTIVE'} />,
    },
  ];

  if (loading) {
    return <SkeletonPage />;
  }

  return (
    <div>
      <PageHeader
        title="Barbers"
        subtitle="Manage barbers"
        action={
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Barber
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={barbers}
        onRowClick={handleEdit}
        onDelete={handleDelete}
        searchable
        searchPlaceholder="Search barbers..."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isAddMode ? 'Add New Barber' : 'Edit Barber Profile'}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                placeholder="john@example.com"
                disabled={!isAddMode}
              />
            </div>
          </div>

          {isAddMode && (
            <div>
              <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
                placeholder="••••••••"
              />
              <p className="text-[11px] text-neutral-400 mt-1.5 px-1 italic">Minimum 6 characters for security.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">Specialty</label>
              <input
                type="text"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="input-field"
                placeholder="e.g. Fades, Beard Trimming"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">Years of Experience</label>
              <input
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                className="input-field"
                placeholder="5"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">Short Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="input-field resize-none"
              placeholder="Tell customers about this barber's expertise..."
            />
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4">Skema gaji & komisi</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-neutral-400 uppercase tracking-widest mb-2 px-1">
                  Tipe kompensasi
                </label>
                <select
                  value={formData.compensationType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      compensationType: e.target.value as CompensationType,
                    })
                  }
                  className="input-field appearance-none cursor-pointer"
                >
                  {(Object.keys(COMPENSATION_TYPE_LABELS) as CompensationType[]).map((key) => (
                    <option key={key} value={key}>
                      {COMPENSATION_TYPE_LABELS[key]}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-neutral-500 mt-2 px-1">
                  {COMPENSATION_TYPE_DESCRIPTIONS[formData.compensationType]}
                </p>
              </div>

              {(formData.compensationType === 'FIXED' || formData.compensationType === 'HYBRID') && (
                <div>
                  <label className="block text-[12px] font-bold text-neutral-400 uppercase tracking-widest mb-2 px-1">
                    Gaji pokok bulanan (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.baseSalary}
                    onChange={(e) =>
                      setFormData({ ...formData, baseSalary: parseInt(e.target.value, 10) || 0 })
                    }
                    className="input-field"
                    placeholder="5000000"
                  />
                </div>
              )}

              {(formData.compensationType === 'COMMISSION' || formData.compensationType === 'HYBRID') && (
                <div>
                  <label className="block text-[12px] font-bold text-neutral-400 uppercase tracking-widest mb-2 px-1">
                    Persentase komisi (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.commissionRate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        commissionRate: Math.min(100, parseInt(e.target.value, 10) || 0),
                      })
                    }
                    className="input-field"
                    placeholder="30"
                  />
                  <p className="text-xs text-neutral-500 mt-1 px-1">
                    Dihitung dari omzet booking <strong>selesai</strong> yang sudah <strong>lunas</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl transition-all shadow-lg shadow-accent/20 active:scale-[0.98]"
            >
              {isAddMode ? 'Create Barber' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Deactivate Barber"
        message="Are you sure you want to deactivate this barber? They will no longer be available for bookings."
        confirmText="Deactivate"
      />
    </div>
  );
};

export default BarberList;
