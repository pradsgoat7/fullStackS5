import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Loader2, Receipt, Wallet, CheckCircle2 } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { StatusBadge } from '../components/orders/StatusBadge';
import { formatDateTime, formatPrice, itemsSummary } from '../lib/format';

export const OrderHistoryPage: React.FC = () => {
  const { orders, pastOrders, error } = useOrders();
  const collected = pastOrders.filter((order) => order.status === 'collected');
  const totalSpent = collected.reduce((sum, order) => sum + order.total, 0);

  const stats = [
    { label: 'Past orders', value: String(pastOrders.length), icon: Receipt },
    { label: 'Collected', value: String(collected.length), icon: CheckCircle2 },
    { label: 'Total spent', value: formatPrice(totalSpent), icon: Wallet },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Clock className="w-6 h-6 text-orange-500" />
          Order History
        </h2>
        <p className="text-slate-500 text-sm mt-1">Your collected and cancelled orders.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
              <span className="block mt-2 text-2xl font-bold text-slate-900">{orders === null ? '—' : value}</span>
            </div>
            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
              <Icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {error ? (
          <p className="text-sm text-red-500 text-center py-12">{error}</p>
        ) : orders === null ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin text-orange-500" /> Loading history...
          </div>
        ) : pastOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-semibold text-slate-900">No past orders yet</p>
            <p className="text-sm text-slate-500 mt-1">
              Orders appear here once they are collected or cancelled. Active ones are in{' '}
              <Link to="/my-orders" className="font-semibold text-orange-600 hover:text-orange-700">My Orders</Link>.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 bg-slate-50">
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Token</th>
                  <th className="px-6 py-3 font-semibold">Items</th>
                  <th className="px-6 py-3 font-semibold text-right">Total</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pastOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-3.5 text-slate-500 whitespace-nowrap">{formatDateTime(order.createdAt)}</td>
                    <td className="px-6 py-3.5 font-semibold text-slate-900">{order.token}</td>
                    <td className="px-6 py-3.5 text-slate-600 min-w-[240px]">{itemsSummary(order.items)}</td>
                    <td className="px-6 py-3.5 font-semibold text-slate-900 text-right">{formatPrice(order.total)}</td>
                    <td className="px-6 py-3.5"><StatusBadge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
