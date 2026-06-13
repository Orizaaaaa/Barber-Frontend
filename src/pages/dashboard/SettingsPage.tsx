import React, { useState, useEffect } from 'react';
import { settingsService } from '@/services/settings.service';
import { BusinessSettings } from '@/types';
import PageHeader from '@/components/dashboard/PageHeader';
import { Building2, Clock, Mail, Phone, MapPin, Calendar, DollarSign } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    operatingHours: {
      open: '09:00',
      close: '21:00',
    },
    address: '',
    phone: '',
    email: '',
    bookingSettings: {
      minAdvanceHours: 1,
      maxAdvanceDays: 30,
      barberSelectionFee: 10000,
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsService.getSettings();
      setFormData(data);
      setSettings({
        id: 1,
        ...data,
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await settingsService.updateSettings(formData);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-12 h-12 border-4 border-neutral-100 dark:border-neutral-800 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <PageHeader title="Business Settings" subtitle="Configure your shop's information and booking rules" />

      <div className="space-y-8">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-8 flex items-center gap-3">
            <div className="p-2 bg-accent-light/50 dark:bg-accent/10 rounded-xl">
              <Building2 className="w-5 h-5 text-accent" />
            </div>
            Business Information
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">Business Name</label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="input-field"
                placeholder="Suma Barber"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">Shop Address</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="input-field pl-11"
                  placeholder="Street name, City, Postcode"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field pl-11"
                    placeholder="+62..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field pl-11"
                    placeholder="contact@sumabarber.com"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-8 flex items-center gap-3">
            <div className="p-2 bg-accent-light/50 dark:bg-accent/10 rounded-xl">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            Operating Hours
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3 px-1">Opening Time</label>
              <input
                type="time"
                value={formData.operatingHours.open}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    operatingHours: { ...formData.operatingHours, open: e.target.value },
                  })
                }
                className="input-field text-lg font-bold"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3 px-1">Closing Time</label>
              <input
                type="time"
                value={formData.operatingHours.close}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    operatingHours: { ...formData.operatingHours, close: e.target.value },
                  })
                }
                className="input-field text-lg font-bold"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-8 flex items-center gap-3">
            <div className="p-2 bg-accent-light/50 dark:bg-accent/10 rounded-xl">
              <Calendar className="w-5 h-5 text-accent" />
            </div>
            Booking Constraints
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3 px-1">Min Advance (Hours)</label>
              <input
                type="number"
                value={formData.bookingSettings.minAdvanceHours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bookingSettings: {
                      ...formData.bookingSettings,
                      minAdvanceHours: parseInt(e.target.value) || 1,
                    },
                  })
                }
                className="input-field"
                min="0"
              />
              <p className="text-[11px] text-neutral-400 mt-2 px-1 italic">How many hours in advance can customers book?</p>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3 px-1">Max Advance (Days)</label>
              <input
                type="number"
                value={formData.bookingSettings.maxAdvanceDays}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bookingSettings: {
                      ...formData.bookingSettings,
                      maxAdvanceDays: parseInt(e.target.value) || 30,
                    },
                  })
                }
                className="input-field"
                min="1"
              />
              <p className="text-[11px] text-neutral-400 mt-2 px-1 italic">How far into the future can customers book?</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-8 flex items-center gap-3">
            <div className="p-2 bg-accent-light/50 dark:bg-accent/10 rounded-xl">
              <DollarSign className="w-5 h-5 text-accent" />
            </div>
            Barber Selection Fee
          </h2>
          <div>
            <label className="block text-[12px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3 px-1">Fee Amount (Rp)</label>
            <input
              type="number"
              value={formData.bookingSettings.barberSelectionFee}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bookingSettings: {
                    ...formData.bookingSettings,
                    barberSelectionFee: parseInt(e.target.value) || 0,
                  },
                })
              }
              className="input-field"
              min="0"
              step="1000"
            />
            <p className="text-[11px] text-neutral-400 mt-2 px-1 italic">Additional charge when customer picks a specific barber (0 = no fee). Random selection is always free.</p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full md:w-auto bg-accent hover:bg-accent-hover disabled:bg-neutral-200 dark:disabled:bg-neutral-800 disabled:text-neutral-400 text-white font-bold px-12 py-4 rounded-2xl transition-all shadow-xl shadow-accent/20 active:scale-[0.98]"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving Changes...
              </div>
            ) : 'Save All Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
