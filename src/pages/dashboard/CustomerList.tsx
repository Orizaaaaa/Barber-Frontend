import React, { useState, useEffect } from 'react';
import { customerService } from '@/services/customer.service';
import { Customer } from '@/types';
import PageHeader from '@/components/dashboard/PageHeader';
import DataTable from '@/components/dashboard/DataTable';
import Modal from '@/components/dashboard/Modal';
import { Calendar } from 'lucide-react';
import { SkeletonPage } from '@/components/dashboard/Skeleton';

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await customerService.listCustomers();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (customer: Customer) => {
    setSelectedCustomer(customer);
    try {
      const bookingData = await customerService.getCustomerBookings(customer.id);
      setBookings(Array.isArray(bookingData) ? bookingData : []);
    } catch (error) {
      console.error('Error loading customer bookings:', error);
      setBookings([]);
    }
    setIsModalOpen(true);
  };

  const columns = [
    {
      key: 'name' as keyof Customer,
      label: 'Name',
    },
    {
      key: 'email' as keyof Customer,
      label: 'Email',
    },
    {
      key: 'phone' as keyof Customer,
      label: 'Phone',
      render: (value: string) => value || 'N/A',
    },
    {
      key: 'customerData' as keyof Customer,
      label: 'Total Visits',
      render: (value: any) => value?.totalVisits || 0,
    },
  ];

  if (loading) {
    return <SkeletonPage />;
  }

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="Manage customer information"
      />

      <DataTable
        columns={columns}
        data={customers}
        onRowClick={handleView}
        searchable
        searchPlaceholder="Search customers..."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Customer Profile">
        {selectedCustomer && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-6 bg-accent-light/30 dark:bg-accent/5 rounded-3xl border border-accent/10">
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-accent/20">
                {selectedCustomer.name.charAt(0)}
              </div>
              <div>
                <div className="text-xl font-bold text-neutral-900 dark:text-white leading-none mb-1">{selectedCustomer.name}</div>
                <div className="text-sm font-medium text-accent">{selectedCustomer.email}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800 text-center">
                <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">Total Visits</div>
                <div className="text-2xl font-black text-neutral-900 dark:text-white">{selectedCustomer.customerData?.totalVisits || 0}</div>
              </div>
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800 text-center">
                <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">Total Spent</div>
                <div className="text-xl font-black text-accent">Rp {(selectedCustomer.customerData?.totalSpent || 0).toLocaleString()}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">Booking History</h3>
                <span className="text-[11px] font-bold text-neutral-400">{bookings.length} records</span>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-10 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-700">
                  <Calendar className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                  <p className="text-sm text-neutral-500 font-medium">No previous bookings</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {bookings.map((booking: any) => (
                    <div key={booking.id} className="bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-xl p-4 flex justify-between items-center group hover:border-accent/30 transition-all">
                      <div>
                        <div className="text-sm font-bold text-neutral-900 dark:text-white mb-0.5">{booking.service?.name || 'Service'}</div>
                        <div className="text-[11px] text-neutral-500 font-medium">
                          {new Date(booking.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-neutral-900 dark:text-white">
                          Rp {booking.totalAmount?.toLocaleString() || 0}
                        </div>
                        <div className="text-[10px] font-bold text-accent uppercase">{booking.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full py-3.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold rounded-xl transition-all active:scale-[0.98]"
            >
              Close Profile
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CustomerList;
