import React from 'react';
import { Loader2 } from 'lucide-react';

export const FullPageLoader: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
        <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
        Checking your session...
      </div>
    </div>
  );
};
