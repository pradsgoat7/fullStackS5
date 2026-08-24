import React from 'react';
import { Users, Clock, Armchair, ArrowUpRight, Flame, BellRing } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
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
        {/* Queue Length Card */}
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

        {/* Estimated Waiting Time Card */}
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

        {/* Seat Availability Card */}
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

      {/* Featured Food Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Popular Quick Bites
          </h3>
          <button className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1">
            View Full Menu <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Peri Peri Masala Fries',
              price: '₹70',
              time: '5 mins',
              tag: 'Bestseller',
              image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&h=300&fit=crop',
            },
            {
              name: 'Cold Coffee with Ice Cream',
              price: '₹90',
              time: '3 mins',
              tag: 'Refreshing',
              image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&h=300&fit=crop',
            },
            {
              name: 'Paneer Cheese Burger',
              price: '₹120',
              time: '8 mins',
              tag: 'Chef Choice',
              image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop',
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                {/* Dish Image */}
                <div className="h-40 w-full overflow-hidden relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-3 left-3 text-[10px] font-bold tracking-wider uppercase bg-white/90 backdrop-blur-sm text-orange-600 px-2.5 py-1 rounded-full shadow-sm">
                    {item.tag}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-slate-900 text-base">{item.name}</h4>
                  </div>
                  <span className="text-xs font-medium text-slate-400">{item.time} prep time</span>
                </div>
              </div>
              <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                <span className="text-lg font-bold text-slate-900">{item.price}</span>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm shadow-orange-500/20 transition-all">
                  Pre-Order
                </button>
              </div>
            </div>
          ))}
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