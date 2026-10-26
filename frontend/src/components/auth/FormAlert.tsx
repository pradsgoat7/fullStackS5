import React from 'react';
import { AlertCircle, Info } from 'lucide-react';

interface FormAlertProps {
  tone: 'error' | 'warning';
  message: string;
}

export const FormAlert: React.FC<FormAlertProps> = ({ tone, message }) => {
  const Icon = tone === 'error' ? AlertCircle : Info;
  const styles = tone === 'error'
    ? 'bg-red-50 border-red-200 text-red-700'
    : 'bg-amber-50 border-amber-200 text-amber-800';

  return (
    <div role="alert" className={`flex items-start gap-2.5 border rounded-xl px-3.5 py-3 text-sm font-medium ${styles}`}>
      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
};
