import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const AccessDeniedPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <span className="inline-block mt-5 text-[11px] font-bold tracking-wider uppercase text-red-500">403 · Forbidden</span>
        <h1 className="text-xl font-bold text-slate-900 mt-1">Access denied</h1>
        <p className="text-sm text-slate-500 mt-2">
          You are signed in as <span className="font-semibold text-slate-700">{user?.name}</span> with the{' '}
          <span className="font-semibold text-slate-700">{user?.role}</span> role. Only admins can open this page.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm shadow-orange-500/25 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </Link>
      </div>
    </div>
  );
};
