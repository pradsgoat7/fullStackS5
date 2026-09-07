import React, { useState } from 'react';
import { Users, Clock, Armchair, ArrowUpRight, Flame, BellRing, Search, ShoppingBag, Trash2, CheckCircle2 } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useMenuItems } from '../hooks/useMenuItems';
import { CheckoutForm, type CheckoutFormValues } from '../components/cart/CheckoutForm';

export const DashboardPage: React.FC = () => {
  const { cart, addToCart, removeFromCart, clearCart, totalItemsCount, totalPrice } = useCart();
  const { items: menuItems, isLoading, error } = useMenuItems();
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{ token: string; name: string } | null>(null);

  const handlePlaceOrder = (values: CheckoutFormValues) => {
    setIsPlacingOrder(true);
    setTimeout(() => {
      const token = `CE-${Math.floor(1000 + Math.random() * 9000)}`;
      setConfirmedOrder({ token, name: values.name.trim() });
      setIsPlacingOrder(false);
      clearCart();
    }, 700);
  };

  const quickBites = menuItems.filter((item) => item.category === 'Quick Bites' || item.category === 'Beverages');

  const filteredBites = quickBites.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Welcome back, Pradnyesh! 👋</h2>
          <p className="text-slate-500 text-sm mt-1">Here is the live status of the college canteen right now.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Canteen Open • Closes at 5:00 PM
          </div>
        </div>
      </div>

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
            <span className="text-3xl font-bold text-slate-900">14</span>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Moderate Rush</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">~6 orders ahead of your typical spot</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Est. Waiting Time</span>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">12</span>
            <span className="text-sm font-semibold text-slate-600">mins</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Based on current kitchen load</p>
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
            <button className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1">
              View Full Menu <ArrowUpRight className="w-4 h-4" />
            </button>
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
              filteredBites.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <div className="h-36 w-full overflow-hidden relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      <span className="absolute top-3 left-3 text-[10px] font-bold tracking-wider uppercase bg-white/90 backdrop-blur-sm text-orange-600 px-2.5 py-1 rounded-full shadow-sm">
                        {item.tag}
                      </span>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-slate-900 text-sm">{item.name}</h4>
                      <span className="text-xs font-medium text-slate-400">{item.time} prep time</span>
                    </div>
                  </div>
                  <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                    <span className="text-base font-bold text-slate-900">{item.price}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm shadow-orange-500/25 transition-all active:scale-95"
                    >
                      Pre-Order
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 col-span-2 text-center py-8">No quick bites match your search.</p>
            )}
          </div>
        </div>

        {/* Right 1 Column: Live Pre-Order Cart State */}
        <div className="space-y-4">
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
                <p className="text-sm font-semibold text-slate-900 mt-3">Thanks, {confirmedOrder.name}!</p>
                <p className="text-xs text-slate-500 mt-1">Your pre-order is confirmed. Show this token at pickup.</p>
                <p className="text-2xl font-bold text-orange-600 mt-3 tracking-wide">{confirmedOrder.token}</p>
                <button
                  onClick={() => setConfirmedOrder(null)}
                  className="mt-5 text-xs font-semibold text-orange-600 hover:text-orange-700"
                >
                  Place another order
                </button>
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
                          ₹{cartItem.price} × {cartItem.quantity}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-900">₹{cartItem.price * cartItem.quantity}</span>
                        <button
                          onClick={() => removeFromCart(cartItem.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <CheckoutForm totalPrice={totalPrice} isSubmitting={isPlacingOrder} onSubmit={handlePlaceOrder} />
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Announcements Section */}
      <div className="bg-orange-50/50 border border-orange-100 p-5 rounded-2xl flex items-start gap-4">
        <div className="p-2 bg-orange-500 text-white rounded-xl shadow-sm">
          <BellRing className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">Canteen Broadcast Announcement</h4>
          <p className="text-xs text-slate-600 mt-1">
            "Special South Indian Thali available today between 1:00 PM and 2:30 PM. Pre-orders are now live!"
          </p>
        </div>
      </div>
    </div>
  );
};