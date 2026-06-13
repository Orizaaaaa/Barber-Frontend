import React, { useState, useEffect } from 'react';
import { promoService } from '@/services/promo.service';
import { Promo } from '@/types';
import PageHeader from '@/components/dashboard/PageHeader';
import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import Modal from '@/components/dashboard/Modal';
import ConfirmDialog from '@/components/dashboard/ConfirmDialog';
import { Plus, Calendar } from 'lucide-react';

const PromoList: React.FC = () => {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    discountValue: 0,
    minSpend: 0,
    startDate: '',
    endDate: '',
    isActive: true,
  });

  useEffect(() => {
    loadPromos();
  }, []);

  const loadPromos = async () => {
    try {
      const data = await promoService.listPromos();
      setPromos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading promos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsAddMode(true);
    setFormData({
      code: '',
      name: '',
      discountType: 'PERCENTAGE',
      discountValue: 0,
      minSpend: 0,
      startDate: '',
      endDate: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (promo: Promo) => {
    setIsAddMode(false);
    setSelectedPromo(promo);
    setFormData({
      code: promo.code,
      name: promo.name || '',
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      minSpend: promo.minSpend || 0,
      startDate: promo.startDate ? promo.startDate.split('T')[0] : '',
      endDate: promo.endDate.split('T')[0],
      isActive: promo.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (promo: Promo) => {
    setSelectedPromo(promo);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (isAddMode) {
        await promoService.createPromo(formData);
      } else if (selectedPromo) {
        await promoService.updatePromo(selectedPromo.id, formData);
      }
      await loadPromos();
      setIsModalOpen(false);
      setSelectedPromo(null);
    } catch (error) {
      console.error('Error saving promo:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedPromo) return;
    try {
      await promoService.deletePromo(selectedPromo.id);
      await loadPromos();
      setIsDeleteDialogOpen(false);
      setSelectedPromo(null);
    } catch (error) {
      console.error('Error deleting promo:', error);
    }
  };

  const columns = [
    {
      key: 'code' as keyof Promo,
      label: 'Code',
    },
    {
      key: 'discountType' as keyof Promo,
      label: 'Type',
    },
    {
      key: 'discountValue' as keyof Promo,
      label: 'Value',
      render: (value: number, row: Promo) =>
        row.discountType === 'PERCENTAGE' ? `${value}%` : `Rp ${value.toLocaleString()}`,
    },
    {
      key: 'minSpend' as keyof Promo,
      label: 'Min Spend',
      render: (value: number) => `Rp ${value?.toLocaleString() || 0}`,
    },
    {
      key: 'endDate' as keyof Promo,
      label: 'End Date',
      render: (value: string) => new Date(value).toLocaleDateString('id-ID'),
    },
    {
      key: 'isActive' as keyof Promo,
      label: 'Status',
      render: (value: boolean) => <StatusBadge status={value ? 'ACTIVE' : 'INACTIVE'} />,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-12 h-12 border-4 border-neutral-300 dark:border-neutral-700 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Promos"
        subtitle="Manage promo codes"
        action={
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Promo
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={promos}
        onRowClick={handleEdit}
        onDelete={handleDelete}
        searchable
        searchPlaceholder="Search promos..."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isAddMode ? 'Create New Promotion' : 'Edit Promotion'}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">Promo Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="input-field uppercase font-mono font-bold text-accent"
                placeholder="SUMA20"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">Display Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="Grand Opening Promo"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">Discount Type</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'PERCENTAGE' | 'FIXED' })}
                className="input-field appearance-none cursor-pointer"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (Rp)</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">Discount Value</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent font-bold">
                  {formData.discountType === 'PERCENTAGE' ? '%' : 'Rp'}
                </div>
                <input
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: parseInt(e.target.value) || 0 })}
                  className="input-field pl-12 font-bold"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">Start Date</label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="input-field pl-11"
                />
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">End Date</label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="input-field pl-11"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">Minimum Spend (Rp)</label>
            <input
              type="number"
              value={formData.minSpend}
              onChange={(e) => setFormData({ ...formData, minSpend: parseInt(e.target.value) || 0 })}
              className="input-field"
              placeholder="0"
            />
          </div>

          <div className="flex items-center gap-3 px-1">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
            </label>
            <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Promo is Active</span>
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
              {isAddMode ? 'Create Promo' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Promo"
        message="Are you sure you want to delete this promo? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};

export default PromoList;
