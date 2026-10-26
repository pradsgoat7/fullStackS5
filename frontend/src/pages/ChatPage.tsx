import React, { useEffect, useRef, useState } from 'react';
import { MessagesSquare, Send, Wifi, WifiOff, Loader2, Users, MessageSquare } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import type { ChatMessage, ConnectionStatus, OnlineUser } from '../types/realtime';
import type { Role } from '../types/auth';

const TYPING_IDLE_MS = 2000;
const ACK_TIMEOUT_MS = 5000;

const initialsOf = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('');

const timeOf = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });

const roleBadge: Partial<Record<Role, string>> = {
  admin: 'bg-orange-100 text-orange-700',
  staff: 'bg-sky-50 text-sky-700',
};

const statusPill: Record<ConnectionStatus, { label: string; className: string; icon: React.ReactNode }> = {
  connected: { label: 'Connected', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <Wifi className="w-3.5 h-3.5" /> },
  connecting: { label: 'Connecting...', className: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Loader2 className="w-3.5 h-3.5 animate-spin" /> },
  disconnected: { label: 'Disconnected', className: 'bg-red-50 text-red-600 border-red-200', icon: <WifiOff className="w-3.5 h-3.5" /> },
};

interface SyncResponse {
  ok: boolean;
  history?: ChatMessage[];
  online?: OnlineUser[];
  error?: string;
}

export const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const { socket, status, error: connectionError } = useSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [online, setOnline] = useState<OnlineUser[]>([]);
  const [typing, setTyping] = useState<Record<string, string>>({});
  const [text, setText] = useState('');
  const [sendError, setSendError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<number | undefined>(undefined);
  const isTypingSent = useRef(false);

  // Load history + presence when the page opens (and again after a reconnect), then listen for live events
  useEffect(() => {
    if (!socket) return;

    const sync = () => {
      socket.timeout(ACK_TIMEOUT_MS).emit('chat:sync', (err: Error | null, res: SyncResponse) => {
        if (err || !res.ok) return;
        setMessages(res.history ?? []);
        setOnline(res.online ?? []);
      });
    };
    const onMessage = (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
      setTyping((prev) => {
        const next = { ...prev };
        delete next[message.user];
        return next;
      });
    };
    const onPresence = (users: OnlineUser[]) => setOnline(users);
    const onTyping = ({ id, name, isTyping }: { id: string; name: string; isTyping: boolean }) => {
      setTyping((prev) => {
        const next = { ...prev };
        if (isTyping) next[id] = name;
        else delete next[id];
        return next;
      });
    };

    if (socket.connected) sync();
    socket.on('connect', sync);
    socket.on('chat:message', onMessage);
    socket.on('presence', onPresence);
    socket.on('chat:typing', onTyping);
    return () => {
      socket.off('connect', sync);
      socket.off('chat:message', onMessage);
      socket.off('presence', onPresence);
      socket.off('chat:typing', onTyping);
    };
  }, [socket]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages]);

  const setTypingState = (isTyping: boolean) => {
    if (!socket || isTypingSent.current === isTyping) return;
    isTypingSent.current = isTyping;
    socket.emit('chat:typing', isTyping);
  };

  const handleChange = (value: string) => {
    setText(value);
    setSendError(null);
    setTypingState(value.trim().length > 0);
    window.clearTimeout(typingTimer.current);
    typingTimer.current = window.setTimeout(() => setTypingState(false), TYPING_IDLE_MS);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !socket || status !== 'connected') return;

    setIsSending(true);
    setTypingState(false);
    socket.timeout(ACK_TIMEOUT_MS).emit('chat:send', { text: trimmed }, (err: Error | null, res: { ok: boolean; error?: string }) => {
      setIsSending(false);
      if (err) {
        setSendError('The server did not respond. Please try again.');
      } else if (!res.ok) {
        setSendError(res.error ?? 'Message could not be sent');
      } else {
        setText('');
      }
    });
  };

  const typingNames = Object.values(typing);
  const pill = statusPill[status];
  const canSend = status === 'connected' && text.trim().length > 0 && !isSending;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6 pb-6">
      {/* Chat panel */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[calc(100vh-9rem)] min-h-[480px]">
        <header className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessagesSquare className="w-5 h-5 text-orange-500" />
              Canteen Live Chat
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Ask the canteen team anything. Messages appear instantly for everyone online.</p>
          </div>
          <span className={`self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${pill.className}`}>
            {pill.icon} {pill.label}
          </span>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4" aria-live="polite">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="font-semibold text-slate-900 mt-3">No messages yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">Say hello! Your message is delivered live to everyone in the chat over a WebSocket.</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = message.user === user?._id;
              return (
                <div key={message._id} className={`flex items-end gap-2.5 ${isOwn ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold ${isOwn ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {initialsOf(message.name)}
                  </div>
                  <div className={`max-w-[75%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs font-semibold text-slate-700">{isOwn ? 'You' : message.name}</span>
                      {roleBadge[message.role] && (
                        <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${roleBadge[message.role]}`}>
                          {message.role}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">{timeOf(message.createdAt)}</span>
                    </div>
                    <p className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                      isOwn ? 'bg-orange-500 text-white rounded-br-md' : 'bg-slate-100 text-slate-800 rounded-bl-md'
                    }`}>
                      {message.text}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={endRef} />
        </div>

        <footer className="px-6 pb-5 pt-2 border-t border-slate-100">
          <p className="h-5 text-xs text-slate-400 italic">
            {typingNames.length > 0 && `${typingNames.join(', ')} ${typingNames.length === 1 ? 'is' : 'are'} typing...`}
          </p>
          <form onSubmit={handleSend} className="flex items-center gap-3">
            <input
              type="text"
              value={text}
              onChange={(e) => handleChange(e.target.value)}
              maxLength={500}
              placeholder={status === 'connected' ? 'Write a message... (Enter to send)' : 'Waiting for connection...'}
              disabled={status !== 'connected'}
              aria-label="Message"
              className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 disabled:opacity-60 transition-all"
            />
            <button
              type="submit"
              disabled={!canSend}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm shadow-orange-500/25 transition-all"
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send
            </button>
          </form>
          {(sendError || (status === 'disconnected' && connectionError)) && (
            <p className="text-xs text-red-500 mt-2">{sendError ?? connectionError}</p>
          )}
        </footer>
      </section>

      {/* Who's online */}
      <aside className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 h-fit">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-4 h-4 text-orange-500" />
          Online now
          <span className="ml-auto bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">{online.length}</span>
        </h3>
        <ul className="mt-4 space-y-3">
          {online.map((person) => (
            <li key={person.id} className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[11px] font-bold">
                  {initialsOf(person.name)}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {person.name}{person.id === user?._id && <span className="text-slate-400 font-normal"> (you)</span>}
                </p>
                <p className="text-[11px] text-slate-400 capitalize">{person.role}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-5 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
          Transport: <span className="font-semibold text-slate-500">{socket?.io.engine?.transport.name ?? '—'}</span>
        </p>
      </aside>
    </div>
  );
};
