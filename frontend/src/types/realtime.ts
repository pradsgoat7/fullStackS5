import type { Role } from './auth';

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

export interface ChatMessage {
    _id: string;
    user: string;
    name: string;
    role: Role;
    text: string;
    createdAt: string;
}

export interface OnlineUser {
    id: string;
    name: string;
    role: Role;
}

export interface Announcement {
    _id: string;
    title: string;
    body: string;
    authorName: string;
    createdAt: string;
}
