import React from 'react';

export const DashboardPage: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Good Morning, Alex 👋
        </h1>
        <p className="text-sm text-gray-500 font-medium mt-1">
          {currentDate} • Check today's queue and order food easily
        </p>
      </div>

      {/* Empty Dashboard Content Area Placeholder */}
      <div className="min-h-[400px] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-white/50">
        <p className="text-gray-400 font-medium text-sm">
          Dashboard widgets and content will be rendered here in subsequent steps.
        </p>
      </div>
    </div>
  );
};
