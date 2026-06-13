import React, { useState, useEffect } from 'react';
import { inventoryService } from '@/services/inventory.service';
import { Inventory } from '@/types';
import PageHeader from '@/components/dashboard/PageHeader';
import DataTable from '@/components/dashboard/DataTable';
import Modal from '@/components/dashboard/Modal';
import ConfirmDialog from '@/components/dashboard/ConfirmDialog';
import { Plus, Package } from 'lucide-react';
import { SkeletonPage } from '@/components/dashboard/Skeleton';

const InventoryList: React.FC = () => {
  const [items, setItems] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: 0,
    minStock: 10,
    unitCost: 0,
    unit: '',
  });
  const [stockQty, setStockQty] = useState(0);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await inventoryService.listItems();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsAddMode(true);
    setFormData({
      name: '',
      description: '',
      quantity: 0,
      minStock: 10,
      unitCost: 0,
      unit: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: Inventory) => {
    setIsAddMode(false);
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      quantity: item.quantity,
      minStock: item.minStock,
      unitCost: item.unitCost,
      unit: item.unit,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item: Inventory) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        quantity: formData.quantity,
        minStock: formData.minStock,
        unitCost: formData.unitCost,
        unit: formData.unit,
      };
      if (isAddMode) {
        await inventoryService.createItem(payload);
      } else if (selectedItem) {
        await inventoryService.updateItem(selectedItem.id, payload);
      }
      await loadItems();
      setIsModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleAddStockSubmit = async () => {
    if (!selectedItem) return;
    try {
      await inventoryService.addStock(selectedItem.id, stockQty);
      await loadItems();
      setIsAddStockModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error adding stock:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;
    try {
      await inventoryService.deleteItem(selectedItem.id);
      await loadItems();
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const columns = [
    {
      key: 'name' as keyof Inventory,
      label: 'Name',
    },
    {
      key: 'description' as keyof Inventory,
      label: 'Description',
      render: (value: string) => value || '-',
    },
    {
      key: 'quantity' as keyof Inventory,
      label: 'Stock',
      render: (value: number, row: Inventory) => (
        <span className={value <= row.minStock ? 'text-red-400 font-semibold' : 'text-neutral-900 dark:text-white'}>
          {value} {row.unit}
        </span>
      ),
    },
    {
      key: 'minStock' as keyof Inventory,
      label: 'Min Stock',
      render: (value: number, row: Inventory) => `${value} ${row.unit}`,
    },
    {
      key: 'unitCost' as keyof Inventory,
      label: 'Unit Cost',
      render: (value: number) => `Rp ${value?.toLocaleString() || 0}`,
    },
  ];

  if (loading) {
    return <SkeletonPage />;
  }

  return (
    <div>
      <PageHeader
        title="Inventory"
        subtitle="Manage inventory items"
        action={
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={items}
        onRowClick={handleEdit}
        onDelete={handleDelete}
        searchable
        searchPlaceholder="Search items..."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isAddMode ? 'Add New Item' : 'Edit Item Details'}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">Item Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="e.g. Pomade X"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">Unit</label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="pcs, ml, kg"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              placeholder="Brief description of the item..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">Initial Stock</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">Min Stock Alert</label>
              <input
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                className="input-field border-red-100 dark:border-red-900/30"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">Unit Cost (Rp)</label>
              <input
                type="number"
                value={formData.unitCost}
                onChange={(e) => setFormData({ ...formData, unitCost: parseInt(e.target.value) || 0 })}
                className="input-field font-bold"
              />
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
              {isAddMode ? 'Add Item' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isAddStockModalOpen} onClose={() => setIsAddStockModalOpen(false)} title="Update Stock Inventory">
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-6 bg-accent-light/30 dark:bg-accent/5 rounded-3xl border border-accent/10">
            <div className="p-3 bg-accent rounded-2xl shadow-lg shadow-accent/20">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-neutral-900 dark:text-white leading-none mb-1">{selectedItem?.name}</div>
              <div className="text-sm font-medium text-accent">Current stock: {selectedItem?.quantity} {selectedItem?.unit}</div>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3 px-1">Quantity to Add</label>
            <input
              type="number"
              value={stockQty}
              onChange={(e) => setStockQty(parseInt(e.target.value) || 0)}
              className="input-field text-center text-2xl font-black py-4"
              placeholder="0"
              autoFocus
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setIsAddStockModalOpen(false)}
              className="flex-1 py-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleAddStockSubmit}
              disabled={stockQty <= 0}
              className="flex-1 py-3 bg-accent hover:bg-accent-hover disabled:bg-neutral-100 dark:disabled:bg-neutral-800 disabled:text-neutral-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-accent/20 active:scale-[0.98]"
            >
              Update Stock
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};

export default InventoryList;
