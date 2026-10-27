import React, { useState } from 'react';
import { User, Mail, Lock, ShieldCheck, Loader2, CheckCircle2, CalendarDays } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import { useForm } from '../hooks/useForm';
import { apiRequest } from '../lib/api';
import { formatDate, formatPrice } from '../lib/format';
import { AuthField } from '../components/auth/AuthField';
import { FormAlert } from '../components/auth/FormAlert';
import type { AuthUser } from '../types/auth';

const initialsOf = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('');

interface PasswordValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  [key: string]: string;
}

const validatePassword = (values: PasswordValues) => {
  const errors: Partial<Record<keyof PasswordValues, string>> = {};
  if (!values.currentPassword) errors.currentPassword = 'Current password is required';
  if (values.newPassword.length < 8 || values.newPassword.length > 72) errors.newPassword = 'Password must be 8 to 72 characters';
  else if (!/[A-Za-z]/.test(values.newPassword)) errors.newPassword = 'Password must contain a letter';
  else if (!/\d/.test(values.newPassword)) errors.newPassword = 'Password must contain a number';
  if (values.confirmPassword !== values.newPassword) errors.confirmPassword = 'Passwords do not match';
  return errors;
};

type Result = { ok: boolean; message: string } | null;

export const ProfilePage: React.FC = () => {
  const { user, token, updateUser } = useAuth();
  const { orders } = useOrders();
  const [name, setName] = useState(user?.name ?? '');
  const [nameResult, setNameResult] = useState<Result>(null);
  const [isSavingName, setIsSavingName] = useState(false);
  const [passwordResult, setPasswordResult] = useState<Result>(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const password = useForm<PasswordValues>({ currentPassword: '', newPassword: '', confirmPassword: '' }, validatePassword);

  if (!user) return null;

  const allOrders = orders ?? [];
  const collected = allOrders.filter((order) => order.status === 'collected');
  const stats = [
    { label: 'Orders placed', value: String(allOrders.length) },
    { label: 'Collected', value: String(collected.length) },
    { label: 'Total spent', value: formatPrice(collected.reduce((sum, order) => sum + order.total, 0)) },
  ];

  const saveName = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setNameResult({ ok: false, message: 'Name is required' });
      return;
    }
    setIsSavingName(true);
    setNameResult(null);
    try {
      const res = await apiRequest<{ user: AuthUser }>('/api/auth/profile', { method: 'PUT', token, body: { name: trimmed } });
      updateUser(res.user);
      setNameResult({ ok: true, message: 'Name updated' });
    } catch (error) {
      setNameResult({ ok: false, message: error instanceof Error ? error.message : 'Could not update your name' });
    } finally {
      setIsSavingName(false);
    }
  };

  const changePassword = async (values: PasswordValues) => {
    setIsSavingPassword(true);
    setPasswordResult(null);
    try {
      await apiRequest('/api/auth/password', {
        method: 'PUT',
        token,
        body: { currentPassword: values.currentPassword, newPassword: values.newPassword },
      });
      password.reset();
      setPasswordResult({ ok: true, message: 'Password changed' });
    } catch (error) {
      setPasswordResult({ ok: false, message: error instanceof Error ? error.message : 'Could not change your password' });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const fieldError = (field: keyof PasswordValues) => (password.touched[field] ? password.errors[field] : undefined);

  return (
    <div className="space-y-8 pb-12">
      {/* Identity card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-orange-500 text-white text-2xl font-bold flex items-center justify-center shadow-sm shadow-orange-500/25">
          {initialsOf(user.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{user.name}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold capitalize">{user.role}</span>
          </div>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5"><Mail className="w-4 h-4" /> {user.email}</p>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Member since {formatDate(user.createdAt)}</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {stats.map(({ label, value }) => (
            <div key={label} className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-center min-w-[110px]">
              <span className="block text-lg font-bold text-slate-900">{orders === null ? '—' : value}</span>
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mt-0.5">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Edit name */}
        <form onSubmit={saveName} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4" noValidate>
          <div>
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><User className="w-5 h-5 text-orange-500" /> Personal details</h3>
            <p className="text-xs text-slate-500 mt-1">Your email and role can't be changed.</p>
          </div>
          <AuthField id="profile-name" label="Full name" icon={User} value={name} onChange={setName} onBlur={() => undefined} autoComplete="name" />
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">College email</span>
            <p className="mt-1 text-sm px-3.5 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 flex items-center gap-2"><Mail className="w-4 h-4" /> {user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={isSavingName || name.trim() === user.name} className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm shadow-orange-500/25 transition-all">
              {isSavingName && <Loader2 className="w-4 h-4 animate-spin" />} Save changes
            </button>
            {nameResult && (
              <p className={`text-xs font-medium flex items-center gap-1.5 ${nameResult.ok ? 'text-emerald-600' : 'text-red-500'}`}>
                {nameResult.ok && <CheckCircle2 className="w-4 h-4" />} {nameResult.message}
              </p>
            )}
          </div>
        </form>

        {/* Change password */}
        <form onSubmit={password.handleSubmit(changePassword)} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4" noValidate>
          <div>
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Lock className="w-5 h-5 text-orange-500" /> Change password</h3>
            <p className="text-xs text-slate-500 mt-1">At least 8 characters, with a letter and a number.</p>
          </div>
          {passwordResult && <FormAlert tone={passwordResult.ok ? 'success' : 'error'} message={passwordResult.message} />}
          <AuthField id="current-password" label="Current password" type="password" icon={Lock} value={password.values.currentPassword} autoComplete="current-password"
            error={fieldError('currentPassword')} onChange={(v) => password.handleChange('currentPassword', v)} onBlur={() => password.handleBlur('currentPassword')} />
          <AuthField id="new-password" label="New password" type="password" icon={ShieldCheck} value={password.values.newPassword} autoComplete="new-password"
            error={fieldError('newPassword')} onChange={(v) => password.handleChange('newPassword', v)} onBlur={() => password.handleBlur('newPassword')} />
          <AuthField id="confirm-password" label="Confirm new password" type="password" icon={ShieldCheck} value={password.values.confirmPassword} autoComplete="new-password"
            error={fieldError('confirmPassword')} onChange={(v) => password.handleChange('confirmPassword', v)} onBlur={() => password.handleBlur('confirmPassword')} />
          <button type="submit" disabled={isSavingPassword} className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm shadow-orange-500/25 transition-all">
            {isSavingPassword && <Loader2 className="w-4 h-4 animate-spin" />} Update password
          </button>
        </form>
      </div>
    </div>
  );
};
