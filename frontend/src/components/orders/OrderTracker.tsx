import React from 'react';
import { ClipboardCheck, ChefHat, BellRing, type LucideIcon } from 'lucide-react';
import type { OrderStatus } from '../../types/order';

const STEPS: { status: OrderStatus; label: string; icon: LucideIcon }[] = [
  { status: 'placed', label: 'Order placed', icon: ClipboardCheck },
  { status: 'preparing', label: 'Preparing', icon: ChefHat },
  { status: 'ready', label: 'Ready for pickup', icon: BellRing },
];

// Three-step progress bar for an active order
export const OrderTracker: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const current = STEPS.findIndex((step) => step.status === status);

  return (
    <ol className="flex items-start" aria-label={`Order progress: step ${current + 1} of ${STEPS.length}`}>
      {STEPS.map(({ status: stepStatus, label, icon: Icon }, index) => {
        const isDone = index <= current;
        return (
          <li key={stepStatus} className="flex-1 flex flex-col items-center relative">
            {index > 0 && (
              <span
                className={`absolute top-5 right-1/2 w-full h-1 -translate-y-1/2 rounded-full transition-colors duration-500 ${index <= current ? 'bg-orange-500' : 'bg-slate-200'}`}
                aria-hidden="true"
              />
            )}
            <span
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${
                isDone ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-slate-200 text-slate-400'
              } ${index === current ? 'ring-4 ring-orange-500/20' : ''}`}
            >
              <Icon className="w-5 h-5" />
            </span>
            <span className={`mt-2 text-xs font-semibold text-center ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
};
