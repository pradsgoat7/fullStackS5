import { createContext } from 'react';
import type { Socket } from 'socket.io-client';
import type { ConnectionStatus } from '../types/realtime';

export interface SocketContextValue {
    /** The connected socket, or null until the first successful connection */
    socket: Socket | null;
    status: ConnectionStatus;
    error: string | null;
}

export const SocketContext = createContext<SocketContextValue>({ socket: null, status: 'disconnected', error: null });
