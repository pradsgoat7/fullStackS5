import React from 'react';
import { Search, Bell, MessageSquare, Menu, ChevronDown } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-100 px-4 md:px-8 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Menu Trigger + Search Bar */}
      <div className="flex items-center space-x-3 flex-1 max-w-xl">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 md:hidden transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search food, snacks, drinks..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>
      </div>

      {/* Right: Notification, Messages, User Profile */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Messages Action */}
        <button
          className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-slate-100 relative transition-colors"
          aria-label="View Messages"
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        {/* Notification Action */}
        <button
          className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-slate-100 relative transition-colors"
          aria-label="View Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white" />
        </button>

        <div className="h-6 w-px bg-gray-200 hidden sm:block" />

        {/* User Profile */}
        <div className="flex items-center space-x-3 pl-1 cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 font-semibold flex items-center justify-center border border-orange-200 text-sm shadow-xs">
            AS
          </div>
          <div className="hidden lg:block text-left">
            <span className="text-sm font-semibold text-gray-900 block leading-tight group-hover:text-orange-600 transition-colors">
              Alex Student
            </span>
            <span className="text-[11px] text-gray-400 font-medium block">Computer Eng.</span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 hidden lg:block group-hover:text-gray-600 transition-colors" />
        </div>
      </div>
    </header>
  );
};
