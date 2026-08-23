import React from 'react';

interface PlaceholderPageProps {
  title: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-gray-500 font-medium mt-1">
          This section is currently under development.
        </p>
      </div>

      <div className="min-h-[300px] border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center p-8 bg-white/50">
        <p className="text-gray-400 font-medium text-sm">
          {title} view coming soon.
        </p>
      </div>
    </div>
  );
};
