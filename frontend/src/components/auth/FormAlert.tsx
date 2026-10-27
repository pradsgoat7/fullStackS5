import React from 'react';
import { AlertCircle, Info, CheckCircle2 } from 'lucide-react';

interface FormAlertProps {
  tone: 'error' | 'warning' | 'success';
  message: string;
}

const TONES = {
  error: { icon: AlertCircle, className: 'bg-red-50 border-red-200 text-red-700' },
  warning: { icon: Info, className: 'bg-amber-50 border-amber-200 text-amber-800' },
  success: { icon: CheckCircle2, className: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
};

export const FormAlert: React.FC<FormAlertProps> = ({ tone, message }) => {
  const { icon: Icon, className } = TONES[tone];

  return (
    <div role="alert" className={`flex items-start gap-2.5 border rounded-xl px-3.5 py-3 text-sm font-medium ${className}`}>
      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
};
