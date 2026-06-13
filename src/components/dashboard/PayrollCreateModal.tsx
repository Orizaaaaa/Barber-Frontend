import React, { useState } from 'react';
import { payrollService } from '@/services/payroll.service';
import { PayrollPreview, Barber } from '@/types';
import {
  COMPENSATION_TYPE_LABELS,
  formatRate,
  CompensationType,
} from '@/utils/compensation';
import Modal from './Modal';
import { Calculator } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  barbers: Barber[];
  onSuccess: () => void;
}

const PayrollCreateModal: React.FC<Props> = ({ isOpen, onClose, barbers, onSuccess }) => {
  const [preview, setPreview] = useState<PayrollPreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    barberId: '',
    periodStart: '',
    periodEnd: '',
    bonus: 0,
    deductions: 0,
  });

  const selectedBarber = barbers.find((b) => String(b.id) === formData.barberId);

  const handlePreview = async () => {
    if (!formData.barberId || !formData.periodStart || !formData.periodEnd) return;
    setPreviewLoading(true);
    setError('');
    try {
      const result = await payrollService.previewPayroll(
        formData.barberId,
        formData.periodStart,
        formData.periodEnd,
        { bonus: formData.bonus, deductions: formData.deductions }
      );
      setPreview(result);
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      setError(apiErr.response?.data?.message || 'Gagal menghitung slip gaji');
      setPreview(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!formData.barberId || !formData.periodStart || !formData.periodEnd) return;
    setSubmitLoading(true);
    setError('');
    try {
      await payrollService.generatePayroll({
        barberId: formData.barberId,
        periodStart: formData.periodStart,
        periodEnd: formData.periodEnd,
        bonus: formData.bonus,
        deductions: formData.deductions,
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      setError(apiErr.response?.data?.message || 'Gagal membuat slip gaji');
    } finally {
      setSubmitLoading(false);
    }
  };

  const updateField = <K extends keyof typeof formData>(key: K, value: typeof formData[K]) => {
    setFormData({ ...formData, [key]: value });
    setPreview(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Buat slip gaji">
      <div className="space-y-5">
        <div>
          <label className="block text-[12px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
            Pilih barber
          </label>
          <select
            value={formData.barberId}
            onChange={(e) => updateField('barberId', e.target.value)}
            className="input-field appearance-none"
          >
            <option value="">Pilih barber...</option>
            {barbers.map((b) => (
              <option key={b.id} value={String(b.id)}>
                {b.user?.name} —{' '}
                {COMPENSATION_TYPE_LABELS[(b.compensationType as CompensationType) || 'COMMISSION']}
              </option>
            ))}
          </select>
          {selectedBarber && (
            <p className="text-xs text-neutral-500 mt-2">
              Skema aktif:{' '}
              <strong>
                {COMPENSATION_TYPE_LABELS[(selectedBarber.compensationType as CompensationType) || 'COMMISSION']}
              </strong>
              {(selectedBarber.compensationType === 'COMMISSION' ||
                selectedBarber.compensationType === 'HYBRID') &&
                ` · Komisi ${formatRate(selectedBarber.commissionRate ?? 0.3)}`}
              {(selectedBarber.compensationType === 'FIXED' ||
                selectedBarber.compensationType === 'HYBRID') &&
                ` · Gaji Rp ${(selectedBarber.baseSalary ?? 0).toLocaleString('id-ID')}/bln`}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-bold text-neutral-400 uppercase mb-2">Dari tanggal</label>
            <input
              type="date"
              value={formData.periodStart}
              onChange={(e) => updateField('periodStart', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-neutral-400 uppercase mb-2">Sampai tanggal</label>
            <input
              type="date"
              value={formData.periodEnd}
              onChange={(e) => updateField('periodEnd', e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-bold text-neutral-400 uppercase mb-2">Bonus (opsional)</label>
            <input
              type="number"
              min={0}
              value={formData.bonus}
              onChange={(e) => updateField('bonus', parseInt(e.target.value, 10) || 0)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-neutral-400 uppercase mb-2">Potongan (opsional)</label>
            <input
              type="number"
              min={0}
              value={formData.deductions}
              onChange={(e) => updateField('deductions', parseInt(e.target.value, 10) || 0)}
              className="input-field"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
        )}

        <button
          type="button"
          onClick={handlePreview}
          disabled={previewLoading || !formData.barberId}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-accent text-accent font-bold rounded-xl hover:bg-accent-light/30 disabled:opacity-50 cursor-pointer"
        >
          <Calculator className="w-4 h-4" />
          {previewLoading ? 'Menghitung...' : 'Hitung preview'}
        </button>

        {preview && (
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl space-y-2 text-sm border border-neutral-200 dark:border-neutral-700">
            <div className="font-bold text-neutral-900 dark:text-white mb-2">Preview slip gaji</div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Booking selesai (lunas)</span>
              <span>{preview.bookingCount} transaksi</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Omzet</span>
              <span>Rp {preview.totalRevenue.toLocaleString('id-ID')}</span>
            </div>
            {preview.baseSalaryPortion > 0 && (
              <div className="flex justify-between">
                <span className="text-neutral-500">Gaji pokok (prorata)</span>
                <span>Rp {preview.baseSalaryPortion.toLocaleString('id-ID')}</span>
              </div>
            )}
            {preview.commission > 0 && (
              <div className="flex justify-between">
                <span className="text-neutral-500">
                  Komisi ({formatRate(preview.commissionRate)})
                </span>
                <span>Rp {preview.commission.toLocaleString('id-ID')}</span>
              </div>
            )}
            {preview.bonus > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Bonus</span>
                <span>+ Rp {preview.bonus.toLocaleString('id-ID')}</span>
              </div>
            )}
            {preview.deductions > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Potongan</span>
                <span>− Rp {preview.deductions.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700 font-black text-lg">
              <span>Total</span>
              <span className="text-accent">Rp {preview.total.toLocaleString('id-ID')}</span>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl font-bold cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={submitLoading || !preview}
            className="flex-1 py-3 bg-accent text-white rounded-xl font-bold disabled:opacity-50 cursor-pointer"
          >
            {submitLoading ? 'Menyimpan...' : 'Simpan slip gaji'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PayrollCreateModal;
