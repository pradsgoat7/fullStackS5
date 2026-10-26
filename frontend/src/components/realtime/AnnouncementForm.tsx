import React, { useState } from 'react';
import { Megaphone, Loader2, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import type { Announcement } from '../../types/realtime';

// Admin-only: posts an announcement; the server pushes it live to every connected client
export const AnnouncementForm: React.FC = () => {
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setResult({ ok: false, message: 'Title and message are both required.' });
      return;
    }
    setIsSending(true);
    setResult(null);
    try {
      const sent = await apiRequest<Announcement>('/api/announcements', {
        method: 'POST',
        token,
        body: { title: title.trim(), body: body.trim() },
      });
      setResult({ ok: true, message: `"${sent.title}" was sent to everyone online.` });
      setTitle('');
      setBody('');
    } catch (error) {
      setResult({ ok: false, message: error instanceof Error ? error.message : 'Could not send the announcement' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div>
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-orange-500" />
          Broadcast an announcement
        </h3>
        <p className="text-xs text-slate-500 mt-1">Appears instantly on every student's dashboard (Socket.IO).</p>
      </div>
      <div>
        <label htmlFor="announcement-title" className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Title</label>
        <input
          id="announcement-title"
          value={title}
          maxLength={80}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Today's Special"
          className="mt-1 w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        />
      </div>
      <div>
        <label htmlFor="announcement-body" className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Message</label>
        <textarea
          id="announcement-body"
          value={body}
          maxLength={300}
          rows={3}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What should students know?"
          className="mt-1 w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSending}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm shadow-orange-500/25 transition-all"
        >
          {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Megaphone className="w-4 h-4" />}
          Send to everyone
        </button>
        {result && (
          <p className={`text-xs font-medium flex items-center gap-1.5 ${result.ok ? 'text-emerald-600' : 'text-red-500'}`}>
            {result.ok && <CheckCircle2 className="w-4 h-4" />}
            {result.message}
          </p>
        )}
      </div>
    </form>
  );
};
