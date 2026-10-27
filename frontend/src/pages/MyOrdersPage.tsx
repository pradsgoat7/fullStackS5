import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Clock, Loader2, XCircle, ArrowRight, Ticket } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { StatusBadge } from '../components/orders/StatusBadge';
import { OrderTracker } from '../components/orders/OrderTracker';
import { formatPrice, formatTime } from '../lib/format';
import type { Order } from '../types/order';

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const { cancelOrder } = useOrders();
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = async () => {
    setIsCancelling(true);
    setError(null);
    try {
      await cancelOrder(order._id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not cancel the order');
      setIsCancelling(false);
    }
  };

  const isReady = order.status === 'ready';

  return (
    <article className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${isReady ? 'border-emerald-300 ring-4 ring-emerald-500/10' : 'border-slate-200'}`}>
      <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="px-4 py-2.5 rounded-xl bg-orange-50 border border-orange-200 text-center">
            <span className="block text-[10px] font-bold tracking-wider uppercase text-orange-600">Pickup token</span>
            <span className="block text-xl font-bold text-slate-900 tracking-wide">{order.token}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Placed at {formatTime(order.createdAt)}</p>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Pickup: {order.pickupSlot}
            </p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="p-6 space-y-6">
        <OrderTracker status={order.status} />

        {isReady && (
          <p className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-xl px-4 py-3">
            <Ticket className="w-4 h-4 shrink-0" /> Your food is ready! Show token {order.token} at the counter.
          </p>
        )}

        <div className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <div key={item.food} className="py-2.5 flex justify-between text-sm">
              <span className="text-slate-700">{item.quantity} × {item.name}</span>
              <span className="font-semibold text-slate-900">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="pt-3 flex justify-between text-sm">
            <span className="font-semibold text-slate-500">Total</span>
            <span className="font-bold text-slate-900">{formatPrice(order.total)}</span>
          </div>
        </div>

        {order.status === 'placed' && (
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-slate-500">You can cancel until the canteen starts preparing it.</p>
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors disabled:opacity-60"
            >
              {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              Cancel order
            </button>
          </div>
        )}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </article>
  );
};

export const MyOrdersPage: React.FC = () => {
  const { orders, activeOrders, error } = useOrders();

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-orange-500" />
            My Orders
          </h2>
          <p className="text-slate-500 text-sm mt-1">Track your active pre-orders. Status updates appear here instantly.</p>
        </div>
        <span className="self-start md:self-auto inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live tracking
        </span>
      </div>

      {error ? (
        <p className="text-sm text-red-500 text-center py-12 bg-white rounded-2xl border border-slate-200">{error}</p>
      ) : orders === null ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin text-orange-500" /> Loading your orders...
        </div>
      ) : activeOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <p className="font-semibold text-slate-900 mt-4">No active orders</p>
          <p className="text-sm text-slate-500 mt-1">Pre-order from the menu and track it here.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link to="/menu" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm shadow-orange-500/25 transition-all">
              Browse the menu <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/order-history" className="text-sm font-semibold text-orange-600 hover:text-orange-700 px-3 py-2.5">
              Order history
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {activeOrders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};
