import { createContext } from 'react';
import type { AuthUser } from '../types/auth';

export interface AuthContextValue {
    user: AuthUser | null;
    token: string | null;
    isLoading: boolean;
    /** Message to show on the login screen, e.g. after a session expires */
    notice: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: (notice?: string) => void;
    /** Replace the stored user after a profile update */
    updateUser: (user: AuthUser) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
