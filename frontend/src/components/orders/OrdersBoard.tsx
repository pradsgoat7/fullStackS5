import React, { useEffect, useState } from 'react';
import { ChefHat, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import { useProtectedData } from '../../hooks/useProtectedData';
import { apiRequest } from '../../lib/api';
import { formatPrice, formatTime, itemsSummary } from '../../lib/format';
import { StatusBadge } from './StatusBadge';
import { ACTIVE_STATUSES, type Order, type OrderStatus } from '../../types/order';

const NEXT_ACTION: Partial<Record<OrderStatus, { status: OrderStatus; label: string }>> = {
  placed: { status: 'preparing', label: 'Start preparing' },
  preparing: { status: 'ready', label: 'Mark ready' },
  ready: { status: 'collected', label: 'Mark collected' },
};

// Admin/staff kitchen queue: active orders oldest first, updated live as students order
export const OrdersBoard: React.FC = () => {
  const { token } = useAuth();
  const { socket } = useSocket();
  const initial = useProtectedData<Order[]>('/api/orders');
  // Live changes since the initial load, keyed by order id
  const [changes, setChanges] = useState<Record<string, Order>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;
    const onChange = (order: Order) => setChanges((prev) => ({ ...prev, [order._id]: order }));
    socket.on('staff:order-new', onChange);
    socket.on('staff:order-updated', onChange);
    return () => {
      socket.off('staff:order-new', onChange);
      socket.off('staff:order-updated', onChange);
    };
  }, [socket]);

  const merged = new Map((initial.data ?? []).map((order) => [order._id, order]));
  Object.values(changes).forEach((order) => merged.set(order._id, order));
  const queue = [...merged.values()]
    .filter((order) => ACTIVE_STATUSES.includes(order.status))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const updateStatus = async (order: Order, status: OrderStatus) => {
    setBusyId(order._id);
    setError(null);
    try {
      const updated = await apiRequest<Order>(`/api/orders/${order._id}/status`, { method: 'PATCH', token, body: { status } });
      setChanges((prev) => ({ ...prev, [updated._id]: updated }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update the order');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-orange-500" />
            Live order queue
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Oldest first. Students see every status change instantly.</p>
        </div>
        <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">{queue.length} active</span>
      </div>

      {error && <p className="text-xs text-red-500 px-6 pt-4">{error}</p>}

      {initial.error ? (
        <p className="text-sm text-red-500 text-center py-8">{initial.error}</p>
      ) : initial.isLoading ? (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin text-orange-500" /> Loading orders...
        </div>
      ) : queue.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">No active orders right now.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 bg-slate-50">
                <th className="px-6 py-3 font-semibold">Token</th>
                <th className="px-6 py-3 font-semibold">Student</th>
                <th className="px-6 py-3 font-semibold">Items</th>
                <th className="px-6 py-3 font-semibold">Pickup</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {queue.map((order) => {
                const next = NEXT_ACTION[order.status];
                const isBusy = busyId === order._id;
                return (
                  <tr key={order._id}>
                    <td className="px-6 py-3.5">
                      <span className="font-bold text-slate-900 whitespace-nowrap">{order.token}</span>
                      <span className="block text-[11px] text-slate-400">{formatTime(order.createdAt)}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-semibold text-slate-900">{order.customerName}</span>
                      <span className="block text-[11px] text-slate-400">{order.rollNumber}</span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 min-w-[200px]">
                      {itemsSummary(order.items)}
                      <span className="block text-[11px] font-semibold text-slate-900">{formatPrice(order.total)}</span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 whitespace-nowrap">{order.pickupSlot}</td>
                    <td className="px-6 py-3.5"><StatusBadge status={order.status} /></td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        {next && (
                          <button
                            onClick={() => updateStatus(order, next.status)}
                            disabled={isBusy}
                            className="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
                          >
                            {isBusy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            {next.label}
                          </button>
                        )}
                        <button
                          onClick={() => updateStatus(order, 'cancelled')}
                          disabled={isBusy}
                          className="text-xs font-semibold text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg disabled:opacity-60 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
