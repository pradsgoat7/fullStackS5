import React from 'react';
import { Flame, Clock, Ticket, Armchair } from 'lucide-react';

interface AuthLayoutProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

const highlights = [
  { icon: Clock, text: 'Pre-order before the break and skip the queue' },
  { icon: Ticket, text: 'Get a pickup token the moment you order' },
  { icon: Armchair, text: 'See live crowd and seat availability' },
];

export const AuthLayout: React.FC<AuthLayoutProps> = ({ eyebrow, title, subtitle, children, footer }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Brand panel (desktop only) */}
      <aside className="hidden lg:flex w-[44%] max-w-xl flex-col justify-between bg-orange-500 text-white p-12 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-orange-600/40" />

        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white text-orange-500 flex items-center justify-center shadow-sm">
            <Flame className="w-6 h-6 fill-current" />
          </div>
          <div>
            <span className="font-bold text-xl leading-tight block">CampusEats</span>
            <span className="text-xs text-orange-100 font-medium block">Smart Canteen</span>
          </div>
        </div>

        <div className="relative">
          <h1 className="text-4xl font-bold leading-tight tracking-tight">
            Your break is short.<br />Your canteen queue shouldn't be.
          </h1>
          <ul className="mt-8 space-y-4">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm font-medium text-orange-50">
                <span className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-orange-100">© 2026 CampusEats · College Canteen Queue & Ordering System</p>
      </aside>

      {/* Form panel */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-sm shadow-orange-200">
              <Flame className="w-6 h-6 fill-current" />
            </div>
            <span className="font-bold text-xl text-gray-900">CampusEats</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
            <span className="text-[11px] font-bold tracking-wider uppercase text-orange-600">{eyebrow}</span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">{title}</h2>
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
            <div className="mt-6">{children}</div>
          </div>

          <p className="text-sm text-slate-500 text-center mt-6">{footer}</p>
        </div>
      </main>
    </div>
  );
};
