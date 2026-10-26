import React, { useEffect, useState } from 'react';
import { BellRing } from 'lucide-react';
import { useProtectedData } from '../../hooks/useProtectedData';
import { useSocket } from '../../hooks/useSocket';
import type { Announcement } from '../../types/realtime';

const MAX_SHOWN = 3;

const timeAgo = (iso: string) => {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
};

// Latest announcements from the API, plus any pushed live over Socket.IO while the page is open
export const LiveAnnouncements: React.FC = () => {
  const { data, error } = useProtectedData<Announcement[]>('/api/announcements');
  const { socket } = useSocket();
  const [liveItems, setLiveItems] = useState<Announcement[]>([]);

  useEffect(() => {
    if (!socket) return;
    const onAnnouncement = (announcement: Announcement) => setLiveItems((prev) => [announcement, ...prev]);
    socket.on('announcement:new', onAnnouncement);
    return () => {
      socket.off('announcement:new', onAnnouncement);
    };
  }, [socket]);

  const liveIds = new Set(liveItems.map((item) => item._id));
  const items = [...liveItems, ...(data ?? []).filter((item) => !liveIds.has(item._id))].slice(0, MAX_SHOWN);

  return (
    <div className="bg-orange-50/50 border border-orange-100 p-5 rounded-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span className="p-1.5 bg-orange-500 text-white rounded-lg shadow-sm">
            <BellRing className="w-4 h-4" />
          </span>
          Canteen Announcements
        </h3>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </span>
      </div>

      {error ? (
        <p className="text-xs text-red-500 mt-3">{error}</p>
      ) : items.length === 0 ? (
        <p className="text-xs text-slate-500 mt-3">No announcements yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li
              key={item._id}
              className={`bg-white rounded-xl border p-3.5 transition-colors ${liveIds.has(item._id) ? 'border-orange-300 ring-2 ring-orange-500/10' : 'border-orange-100'}`}
            >
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                {liveIds.has(item._id) && (
                  <span className="text-[10px] font-bold uppercase tracking-wide bg-orange-500 text-white px-1.5 py-0.5 rounded-md">New</span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1">{item.body}</p>
              <p className="text-[11px] text-slate-400 mt-2">{item.authorName} · {timeAgo(item.createdAt)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
