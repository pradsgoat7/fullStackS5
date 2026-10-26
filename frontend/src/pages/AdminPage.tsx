import React from 'react';
import { ShieldCheck, GraduationCap, UserCog, Utensils, PackageX, type LucideIcon } from 'lucide-react';
import { useProtectedData } from '../hooks/useProtectedData';
import { AnnouncementForm } from '../components/realtime/AnnouncementForm';
import type { AuthUser, Role } from '../types/auth';

interface AdminResponse {
  message: string;
  stats: { students: number; staff: number; admins: number; foodItems: number; lowStockItems: number };
}

const roleBadge: Record<Role, string> = {
  student: 'bg-slate-100 text-slate-600',
  staff: 'bg-sky-50 text-sky-700',
  admin: 'bg-orange-100 text-orange-700',
};

interface StatCardProps {
  label: string;
  value: number | undefined;
  icon: LucideIcon;
  tint: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, tint }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
      <div className={`p-2 rounded-xl ${tint}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <span className="block mt-3 text-3xl font-bold text-slate-900">{value ?? '—'}</span>
  </div>
);

export const AdminPage: React.FC = () => {
  const admin = useProtectedData<AdminResponse>('/api/admin');
  const users = useProtectedData<AuthUser[]>('/api/users');
  const stats = admin.data?.stats;

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-orange-500" />
            Admin Panel
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {admin.error ?? admin.data?.message ?? 'Loading admin data...'}
          </p>
        </div>
        <div className="bg-orange-50 text-orange-700 border border-orange-200 px-3.5 py-1.5 rounded-full text-xs font-semibold">
          Admin access
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Students" value={stats?.students} icon={GraduationCap} tint="bg-orange-50 text-orange-600" />
        <StatCard label="Admins & Staff" value={stats ? stats.admins + stats.staff : undefined} icon={UserCog} tint="bg-sky-50 text-sky-600" />
        <StatCard label="Menu Items" value={stats?.foodItems} icon={Utensils} tint="bg-emerald-50 text-emerald-600" />
        <StatCard label="Low Stock" value={stats?.lowStockItems} icon={PackageX} tint="bg-red-50 text-red-500" />
      </div>

      <AnnouncementForm />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Registered Users</h3>
          <span className="text-xs font-semibold text-slate-500">{users.data?.length ?? 0} accounts</span>
        </div>
        {users.error ? (
          <p className="text-sm text-red-500 text-center py-8">{users.error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 bg-slate-50">
                  <th className="px-6 py-3 font-semibold">Name</th>
                  <th className="px-6 py-3 font-semibold">Email</th>
                  <th className="px-6 py-3 font-semibold">Role</th>
                  <th className="px-6 py-3 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(users.data ?? []).map((account) => (
                  <tr key={account._id}>
                    <td className="px-6 py-3.5 font-semibold text-slate-900">{account.name}</td>
                    <td className="px-6 py-3.5 text-slate-500">{account.email}</td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${roleBadge[account.role]}`}>
                        {account.role}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-500">
                      {new Date(account.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
                {users.isLoading && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400">Loading users...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
