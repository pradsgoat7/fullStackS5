import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Utensils, 
  ShoppingBag, 
  Clock, 
  User, 
  X,
  Flame,
  ShieldCheck,
  MessagesSquare
} from 'lucide-react';
import type { NavItem } from '../../types/navigation';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    id: 'menu',
    label: 'Menu',
    path: '/menu',
    icon: Utensils,
  },
  {
    id: 'chat',
    label: 'Live Chat',
    path: '/chat',
    icon: MessagesSquare,
  },
  {
    id: 'my-orders',
    label: 'My Orders',
    path: '/my-orders',
    icon: ShoppingBag,
  },
  {
    id: 'order-history',
    label: 'Order History',
    path: '/order-history',
    icon: Clock,
  },
  {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: User,
  },
  {
    id: 'admin',
    label: 'Admin Panel',
    path: '/admin',
    icon: ShieldCheck,
    roles: ['admin'],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { user } = useAuth();
  const { activeOrders } = useOrders();
  const visibleItems = navItems.filter((item) => !item.roles || (user && item.roles.includes(user.role)));

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-60 bg-white border-r border-gray-100 flex flex-col justify-between
          transition-transform duration-300 ease-in-out
          md:translate-x-0 md:sticky md:h-screen md:z-auto
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand Header */}
        <div>
          <div className="h-16 px-6 flex items-center justify-between border-b border-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-sm shadow-orange-200">
                <Flame className="w-6 h-6 fill-current" />
              </div>
              <div>
                <span className="font-bold text-gray-900 text-lg leading-tight block">CampusEats</span>
                <span className="text-[11px] text-gray-400 font-medium block">Smart Canteen</span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button 
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 md:hidden transition-colors"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5">
            {visibleItems.map((navItem) => {
              // My Orders shows how many orders are still in progress
              const item = navItem.id === 'my-orders' && activeOrders.length > 0 ? { ...navItem, badge: activeOrders.length } : navItem;
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) => `
                    group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' 
                      : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-orange-500'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`
                          px-2 py-0.5 text-xs font-semibold rounded-full
                          ${isActive 
                            ? 'bg-white/20 text-white' 
                            : 'bg-orange-100 text-orange-600'
                          }
                        `}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Info / Operating Status */}
        <div className="p-4 m-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-gray-700">Canteen Open</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Peak Hours: 12:30 PM - 2:00 PM</p>
        </div>
      </aside>
    </>
  );
};
