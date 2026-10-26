import React, { useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { SocketContext } from './socketContext';
import { API_URL } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import type { ConnectionStatus } from '../types/realtime';

// Errors from the server's auth middleware that mean the session itself is no longer valid
const SESSION_ERRORS = ['Token has expired', 'Invalid or malformed token', 'no longer exists'];

// One Socket.IO connection per logged-in session, authenticated with the user's JWT
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token, logout } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [status, setStatus] = useState<ConnectionStatus>('connecting');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;

        // API_URL is empty when nginx serves the app: connect to the same origin
        const client = io(API_URL || undefined, {
            auth: { token },
            transports: ['websocket', 'polling'],
        });

        client.on('connect', () => {
            setSocket(client);
            setStatus('connected');
            setError(null);
        });
        client.on('disconnect', () => setStatus('disconnected'));
        client.io.on('reconnect_attempt', () => setStatus('connecting'));
        client.on('connect_error', (err) => {
            setStatus('disconnected');
            setError(err.message);
            if (SESSION_ERRORS.some((text) => err.message.includes(text))) {
                logout(err.message);
            }
        });

        return () => {
            client.removeAllListeners();
            client.disconnect();
        };
    }, [token, logout]);

    return (
        <SocketContext.Provider value={{ socket: token ? socket : null, status, error }}>
            {children}
        </SocketContext.Provider>
    );
};
