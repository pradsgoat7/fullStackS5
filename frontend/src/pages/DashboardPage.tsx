import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Clock, Armchair, ArrowUpRight, Flame, Search, ShoppingBag, Trash2, CheckCircle2, ChefHat } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useMenuItems } from '../hooks/useMenuItems';
import { useAuth } from '../hooks/useAuth';
import { useProtectedData } from '../hooks/useProtectedData';
import { useOrders } from '../hooks/useOrders';
import { FoodCard } from '../components/menu/FoodCard';
import { StatusBadge } from '../components/orders/StatusBadge';
import { formatPrice } from '../lib/format';
import type { AuthUser } from '../types/auth';
import { CheckoutForm, type CheckoutFormValues } from '../components/cart/CheckoutForm';
import { LiveAnnouncements } from '../components/realtime/LiveAnnouncements';

export const DashboardPage: React.FC = () => {
  const { cart, addToCart, removeFromCart, clearCart, totalItemsCount, totalPrice } = useCart();
  const { items: menuItems, isLoading, error } = useMenuItems();
  const { user } = useAuth();
  // Server-verified session: an expired token here sends the user back to login
  const dashboard = useProtectedData<{ message: string; user: AuthUser }>('/api/dashboard');
  const firstName = (dashboard.data?.user.name ?? user?.name ?? '').split(' ')[0];
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{ token: string; total: number } | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const { placeOrder, activeOrders, queue } = useOrders();

  const handlePlaceOrder = async (values: CheckoutFormValues) => {
    setIsPlacingOrder(true);
    setOrderError(null);
    try {
      const order = await placeOrder({
        items: cart.map((item) => ({ food: item.id, quantity: item.quantity })),
        pickupSlot: values.pickupSlot,
        rollNumber: values.rollNumber.trim(),
      });
      setConfirmedOrder({ token: order.token, total: order.total });
      clearCart();
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : 'Could not place the order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Only students order; staff manage the queue from the Admin Panel
  const canOrder = user?.role === 'student';

  const queueLength = queue?.activeOrders;
  const rush = queueLength === undefined ? null
    : queueLength <= 3 ? { label: 'Quiet', className: 'text-emerald-600 bg-emerald-50' }
    : queueLength <= 8 ? { label: 'Moderate Rush', className: 'text-amber-600 bg-amber-50' }
    : { label: 'Busy', className: 'text-red-600 bg-red-50' };

  const quickBites = menuItems.filter((item) => item.category === 'Quick Bites' || item.category === 'Beverages');

  const filteredBites = quickBites.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Welcome back, {firstName}! 👋</h2>
          <p className="text-slate-500 text-sm mt-1">Here is the live status of the college canteen right now.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Canteen Open • Closes at 5:00 PM
          </div>
        </div>
      </div>

      {/* Active order: live status, links to My Orders */}
      {activeOrders.length > 0 && (
        <Link
          to="/my-orders"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-orange-50 border border-orange-200 hover:border-orange-300 rounded-2xl px-6 py-4 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 text-white rounded-xl">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                Your order {activeOrders[0].token}
                {activeOrders.length > 1 && <span className="font-medium text-slate-500"> and {activeOrders.length - 1} more</span>}
              </p>
              <p className="text-xs text-slate-500">Pickup: {activeOrders[0].pickupSlot}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={activeOrders[0].status} />
            <span className="text-xs font-semibold text-orange-600">Track →</span>
          </div>
        </Link>
      )}

      {/* Queue Status Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Queue Length</span>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{queueLength ?? '—'}</span>
            {rush && <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${rush.className}`}>{rush.label}</span>}
          </div>
          <p className="text-xs text-slate-500 mt-2">Orders waiting to be prepared right now</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Est. Waiting Time</span>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{queue ? queue.estimatedWaitMinutes : '—'}</span>
            <span className="text-sm font-semibold text-slate-600">mins</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">About 3 minutes per order in the queue</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Seat Availability</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Armchair className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">32</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Seats Free</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Main Hall & Outdoor Patio</p>
        </div>
      </div>

      {/* Interactive Menu Filtering Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter quick bites by name..."
          className="w-full bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-sm"
        />
      </div>

      {/* Main Content Grid: Featured Food & Active Cart Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left 2 Columns: Quick Bites */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Popular Quick Bites
            </h3>
            <Link to="/menu" className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1">
              View Full Menu <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {error ? (
              <p className="text-sm text-red-500 col-span-2 text-center py-8">{error}</p>
            ) : isLoading ? (
              Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-pulse">
                  <div className="h-36 w-full bg-slate-100" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 w-2/3 bg-slate-100 rounded" />
                    <div className="h-3 w-1/3 bg-slate-100 rounded" />
                  </div>
                </div>
              ))
            ) : filteredBites.length > 0 ? (
              filteredBites.map((item) => <FoodCard key={item.id} item={item} onAdd={canOrder ? addToCart : undefined} />)
            ) : (
              <p className="text-sm text-slate-500 col-span-2 text-center py-8">No quick bites match your search.</p>
            )}
          </div>
        </div>

        {/* Right 1 Column: Live Pre-Order Cart State (students) or a link to the order queue (staff) */}
        <div className="space-y-4">
          {!canOrder ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24 text-center">
            <ChefHat className="w-10 h-10 text-orange-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-900 mt-3">Canteen staff view</p>
            <p className="text-xs text-slate-500 mt-1">Students place orders. Manage incoming orders from the live queue.</p>
            <Link to="/admin" className="mt-5 inline-flex text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 px-3.5 py-2 rounded-xl">
              Open live order queue
            </Link>
          </div>
          ) : (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-orange-500" />
                Your Pre-Order Cart
              </h3>
              <span className="bg-orange-50 text-orange-600 font-bold text-xs px-2.5 py-1 rounded-full">
                {totalItemsCount} items
              </span>
            </div>

            {confirmedOrder ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="text-sm font-semibold text-slate-900 mt-3">Thanks, {firstName}! Order placed.</p>
                <p className="text-xs text-slate-500 mt-1">Show this token at pickup · {formatPrice(confirmedOrder.total)}</p>
                <p className="text-2xl font-bold text-orange-600 mt-3 tracking-wide">{confirmedOrder.token}</p>
                <div className="mt-5 flex items-center justify-center gap-4">
                  <Link to="/my-orders" className="text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 px-3.5 py-2 rounded-xl">
                    Track order
                  </Link>
                  <button
                    onClick={() => setConfirmedOrder(null)}
                    className="text-xs font-semibold text-orange-600 hover:text-orange-700"
                  >
                    Place another order
                  </button>
                </div>
              </div>
            ) : cart.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-slate-400 text-sm">Your cart is currently empty.</p>
                <p className="text-slate-300 text-xs mt-1">Click "Pre-Order" on any item to add it here.</p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                  {cart.map((cartItem) => (
                    <div key={cartItem.id} className="py-3 flex items-center justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900">{cartItem.name}</h4>
                        <span className="text-[11px] text-slate-500">
                          {formatPrice(cartItem.price)} × {cartItem.quantity}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-900">{formatPrice(cartItem.price * cartItem.quantity)}</span>
                        <button
                          onClick={() => removeFromCart(cartItem.id)}
                          aria-label={`Remove ${cartItem.name}`}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <CheckoutForm customerName={user?.name ?? ''} totalPrice={totalPrice} isSubmitting={isPlacingOrder} error={orderError} onSubmit={handlePlaceOrder} />
              </div>
            )}
          </div>
          )}
        </div>

      </div>

      {/* Announcements: loaded from the API and updated live over Socket.IO */}
      <LiveAnnouncements />
    </div>
  );
};