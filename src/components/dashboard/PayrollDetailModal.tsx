import React from 'react';
import { Payroll } from '@/types';
import { PAYROLL_TYPE_LABELS } from '@/utils/compensation';
import Modal from './Modal';
import StatusBadge from './StatusBadge';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  payroll: Payroll | null;
  isAdmin: boolean;
  onMarkPaid: (payroll: Payroll) => void;
}

const PayrollDetailModal: React.FC<Props> = ({ isOpen, onClose, payroll, isAdmin, onMarkPaid }) => {
  if (!payroll) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail slip gaji">
      <div className="space-y-4 text-sm">
        <div className="text-center p-6 bg-accent-light/30 dark:bg-accent/5 rounded-2xl">
          <div className="text-xs font-bold text-accent uppercase mb-1">Total</div>
          <div className="text-3xl font-black">Rp {payroll.total?.toLocaleString('id-ID')}</div>
          <div className="mt-2 flex justify-center gap-2">
            <StatusBadge status={payroll.isPaid ? 'PAID' : 'PENDING'} />
            <StatusBadge status={payroll.type || 'COMMISSION'} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
            <div className="text-[10px] uppercase text-neutral-400 mb-1">Barber</div>
            <div className="font-bold">{payroll.barber?.user?.name}</div>
          </div>
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
            <div className="text-[10px] uppercase text-neutral-400 mb-1">Skema</div>
            <div className="font-bold">{PAYROLL_TYPE_LABELS[payroll.type || ''] || '–'}</div>
          </div>
          {(payroll.type === 'FIXED' || payroll.type === 'HYBRID') && (
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
              <div className="text-[10px] uppercase text-neutral-400 mb-1">Gaji pokok</div>
              <div className="font-bold">Rp {(payroll.baseSalary ?? 0).toLocaleString('id-ID')}</div>
            </div>
          )}
          {(payroll.type === 'COMMISSION' || payroll.type === 'HYBRID') && (
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
              <div className="text-[10px] uppercase text-neutral-400 mb-1">Komisi</div>
              <div className="font-bold">Rp {(payroll.commission ?? 0).toLocaleString('id-ID')}</div>
            </div>
          )}
          {(payroll.bonus ?? 0) > 0 && (
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
              <div className="text-[10px] uppercase text-neutral-400 mb-1">Bonus</div>
              <div className="font-bold text-green-600">+ Rp {payroll.bonus?.toLocaleString('id-ID')}</div>
            </div>
          )}
          {(payroll.deductions ?? 0) > 0 && (
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
              <div className="text-[10px] uppercase text-neutral-400 mb-1">Potongan</div>
              <div className="font-bold text-red-600">− Rp {payroll.deductions?.toLocaleString('id-ID')}</div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl font-bold cursor-pointer">
            Tutup
          </button>
          {isAdmin && !payroll.isPaid && (
            <button
              onClick={() => onMarkPaid(payroll)}
              className="flex-1 py-3 bg-accent text-white rounded-xl font-bold cursor-pointer"
            >
              Tandai sudah dibayar
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PayrollDetailModal;
