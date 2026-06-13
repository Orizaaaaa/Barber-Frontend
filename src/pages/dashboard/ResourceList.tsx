import React, { useState, useEffect } from 'react';
import { resourceService } from '@/services/resource.service';
import { Resource } from '@/types';
import PageHeader from '@/components/dashboard/PageHeader';
import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import Modal from '@/components/dashboard/Modal';
import ConfirmDialog from '@/components/dashboard/ConfirmDialog';
import { Plus } from 'lucide-react';

const ResourceList: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: 1,
    isActive: true,
  });

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const data = await resourceService.listResources();
      setResources(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsAddMode(true);
    setFormData({
      name: '',
      type: '',
      capacity: 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (resource: Resource) => {
    setIsAddMode(false);
    setSelectedResource(resource);
    setFormData({
      name: resource.name,
      type: resource.type,
      capacity: resource.capacity || 1,
      isActive: resource.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (resource: Resource) => {
    setSelectedResource(resource);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (isAddMode) {
        await resourceService.createResource({
          ...formData,
          capacity: Number(formData.capacity),
        });
      } else if (selectedResource) {
        await resourceService.updateResource(selectedResource.id, {
          ...formData,
          capacity: Number(formData.capacity),
        });
      }
      await loadResources();
      setIsModalOpen(false);
      setSelectedResource(null);
    } catch (error) {
      console.error('Error saving resource:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedResource) return;
    try {
      await resourceService.deleteResource(selectedResource.id);
      await loadResources();
      setIsDeleteDialogOpen(false);
      setSelectedResource(null);
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  const columns = [
    {
      key: 'name' as keyof Resource,
      label: 'Name',
    },
    {
      key: 'type' as keyof Resource,
      label: 'Type',
    },
    {
      key: 'isActive' as keyof Resource,
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
        title="Resources"
        subtitle="Manage shop resources"
        action={
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Resource
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={resources}
        onRowClick={handleEdit}
        onDelete={handleDelete}
        searchable
        searchPlaceholder="Search resources..."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isAddMode ? 'Add New Resource' : 'Edit Resource'}>
        <div className="space-y-6">
          <div>
            <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">Resource Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="e.g. Chair 1, Washing Station"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">Resource Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input-field appearance-none cursor-pointer"
              >
                <option value="">Select type...</option>
                <option value="CHAIR">Barber Chair</option>
                <option value="STATION">Styling Station</option>
                <option value="WASHER">Washing Station</option>
                <option value="ROOM">Private Room</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">Capacity</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                className="input-field"
                min="1"
              />
            </div>
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
            <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Active & Available</span>
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
              {isAddMode ? 'Add Resource' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Resource"
        message="Are you sure you want to delete this resource? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};

export default ResourceList;
