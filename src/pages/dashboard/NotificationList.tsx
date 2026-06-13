import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { notificationService } from '@/services/notification.service';
import { barberService } from '@/services/barber.service';
import { Notification, Barber } from '@/types';
import PageHeader from '@/components/dashboard/PageHeader';
import DataTable from '@/components/dashboard/DataTable';
import Modal from '@/components/dashboard/Modal';
import { Bell, CheckCheck } from 'lucide-react';

const NotificationList: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    title: '',
    message: '',
  });

  useEffect(() => {
    loadNotifications();
    if (isAdmin) loadBarbers();
  }, []);

  const loadBarbers = async () => {
    try {
      const data = await barberService.getBarbers();
      setBarbers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading barbers:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const data = await notificationService.listNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const handleMarkRead = async (notification: Notification) => {
    try {
      await notificationService.markRead(notification.id);
      await loadNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      await loadNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleCreate = () => {
    setFormData({
      userId: '',
      title: '',
      message: '',
    });
    setIsCreateModalOpen(true);
  };

  const handleSubmitCreate = async () => {
    try {
      const payload = {
        userId: Number(formData.userId),
        title: formData.title,
        message: formData.message,
      };
      await notificationService.createNotification(payload);
      await loadNotifications();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const isAdmin = user?.role === 'ADMIN';

  const columns = [
    {
      key: 'title' as keyof Notification,
      label: 'Title',
      render: (value: string, row: Notification) => (
        <div className={`font-medium ${!row.isRead ? 'text-white' : 'text-neutral-400'}`}>
          {value}
        </div>
      ),
    },
    {
      key: 'message' as keyof Notification,
      label: 'Message',
      render: (value: string) => (
        <div className="text-neutral-400 truncate max-w-xs">{value}</div>
      ),
    },
    {
      key: 'isRead' as keyof Notification,
      label: 'Status',
      render: (value: boolean) => (
        <span className={value ? 'text-neutral-500' : 'text-accent'}>
          {value ? 'Read' : 'Unread'}
        </span>
      ),
    },
    {
      key: 'createdAt' as keyof Notification,
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString('id-ID'),
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
        title="Notifications"
        subtitle="Manage notifications"
        action={
          <div className="flex gap-2">
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white px-4 py-2 rounded-lg transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Mark All Read
            </button>
            {isAdmin && (
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Bell className="w-4 h-4" />
                Create
              </button>
            )}
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={notifications}
        onRowClick={handleView}
        searchable
        searchPlaceholder="Search notifications..."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Notification Details">
        {selectedNotification && (
          <div className="space-y-6">
            <div className="p-6 bg-accent-light/30 dark:bg-accent/5 rounded-3xl border border-accent/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2.5 bg-accent rounded-xl shadow-lg shadow-accent/20">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[12px] font-bold text-accent uppercase tracking-widest leading-none mb-1">Subject</div>
                  <div className="text-xl font-bold text-neutral-900 dark:text-white leading-tight">{selectedNotification.title}</div>
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-accent/5 text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed min-h-[100px]">
                {selectedNotification.message}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">Received On</div>
                <div className="text-sm font-bold text-neutral-900 dark:text-white">
                  {new Date(selectedNotification.createdAt).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">Status</div>
                <span className={`text-[12px] font-bold uppercase tracking-wider ${selectedNotification.isRead ? 'text-neutral-400' : 'text-accent animate-pulse'}`}>
                  {selectedNotification.isRead ? 'Read' : 'New Message'}
                </span>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold rounded-xl transition-all"
              >
                Close
              </button>
              {!selectedNotification.isRead && (
                <button
                  onClick={() => {
                    handleMarkRead(selectedNotification);
                    setIsModalOpen(false);
                  }}
                  className="flex-1 py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl transition-all shadow-lg shadow-accent/20 active:scale-[0.98]"
                >
                  Mark as Read
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {isAdmin && (
        <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Send Notification">
          <div className="space-y-6">
            <div>
              <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3 px-1">Target Recipient</label>
              <select
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                className="input-field appearance-none cursor-pointer font-medium"
              >
                <option value="">Select a barber...</option>
                {barbers.map((barber) => (
                  <option key={barber.id} value={String(barber.user?.id || barber.id)}>
                    {barber.user?.name || `Barber ${barber.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3 px-1">Notification Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field font-bold"
                placeholder="e.g. Schedule Update"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3 px-1">Message Body</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="input-field resize-none leading-relaxed"
                placeholder="Write your message here..."
              />
            </div>

            <div className="flex gap-4 pt-2">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1 py-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitCreate}
                disabled={!formData.userId || !formData.title || !formData.message}
                className="flex-1 py-3 bg-accent hover:bg-accent-hover disabled:bg-neutral-100 dark:disabled:bg-neutral-800 disabled:text-neutral-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-accent/20 active:scale-[0.98]"
              >
                Send Notification
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default NotificationList;
