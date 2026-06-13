import React, { useState, useEffect } from 'react';
import { serviceService } from '@/services/service.service';
import { Service } from '@/types';
import PageHeader from '@/components/dashboard/PageHeader';
import DataTable from '@/components/dashboard/DataTable';
import Modal from '@/components/dashboard/Modal';
import ConfirmDialog from '@/components/dashboard/ConfirmDialog';
import { Plus, Clock } from 'lucide-react';
import { SkeletonPage } from '@/components/dashboard/Skeleton';

const ServiceList: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    duration: 30,
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await serviceService.getServices();
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const [error, setError] = useState('');

  const handleAdd = () => {
    setError('');
    setIsAddMode(true);
    setFormData({
      name: '',
      description: '',
      price: 0,
      duration: 30,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (service: Service) => {
    setIsAddMode(false);
    setSelectedService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price,
      duration: service.duration,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (service: Service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('Service name is required');
      return;
    }
    setError('');
    try {
      if (isAddMode) {
        await serviceService.createService(formData);
      } else if (selectedService) {
        await serviceService.updateService(selectedService.id, formData);
      }
      await loadServices();
      setIsModalOpen(false);
      setSelectedService(null);
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      setError(apiErr.response?.data?.message || 'Failed to save service');
      console.error('Error saving service:', err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedService) return;
    try {
      await serviceService.deleteService(selectedService.id);
      await loadServices();
      setIsDeleteDialogOpen(false);
      setSelectedService(null);
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const columns = [
    {
      key: 'name' as keyof Service,
      label: 'Name',
    },
    {
      key: 'price' as keyof Service,
      label: 'Price',
      render: (value: number) => `Rp ${value?.toLocaleString() || 0}`,
    },
    {
      key: 'duration' as keyof Service,
      label: 'Duration',
      render: (value: number) => `${value} min`,
    },
  ];

  if (loading) {
    return <SkeletonPage />;
  }

  return (
    <div>
      <PageHeader
        title="Services"
        subtitle="Manage services"
        action={
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        }
      />

      {error && !isModalOpen && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={services}
        onRowClick={handleEdit}
        onDelete={handleDelete}
        searchable
        searchPlaceholder="Search services..."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isAddMode ? 'Add New Service' : 'Edit Service Details'}>
        <div className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">Service Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="e.g. Premium Haircut"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">Price (Rp)</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent flex items-center justify-center font-bold">Rp</div>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                  className="input-field pl-12"
                  placeholder="50000"
                />
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">Duration (min)</label>
              <div className="relative group">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 30 })}
                  className="input-field pl-11"
                  placeholder="30"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="input-field resize-none"
              placeholder="What's included in this service?"
            />
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
              {isAddMode ? 'Create Service' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Service"
        message="Are you sure you want to delete this service? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};

export default ServiceList;
