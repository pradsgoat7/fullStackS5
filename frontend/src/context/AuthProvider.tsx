import React, { useCallback, useEffect, useState } from 'react';
import { AuthContext } from './authContext';
import { ApiError, apiRequest } from '../lib/api';
import type { AuthResponse, AuthUser } from '../types/auth';

const TOKEN_KEY = 'campuseats.token';

// localStorage can throw in private windows, so every access is guarded
const readStoredToken = () => {
    try {
        return localStorage.getItem(TOKEN_KEY);
    } catch {
        return null;
    }
};

const storeToken = (token: string | null) => {
    try {
        if (token) localStorage.setItem(TOKEN_KEY, token);
        else localStorage.removeItem(TOKEN_KEY);
    } catch {
        // Session simply won't survive a reload
    }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(readStoredToken);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(() => readStoredToken() !== null);
    const [notice, setNotice] = useState<string | null>(null);

    const logout = useCallback((message?: string) => {
        storeToken(null);
        setToken(null);
        setUser(null);
        setNotice(message ?? null);
    }, []);

    // Restore the session from a saved token when the app first loads
    useEffect(() => {
        const savedToken = readStoredToken();
        if (!savedToken) return;

        let isActive = true;
        apiRequest<{ user: AuthUser }>('/api/auth/profile', { token: savedToken })
            .then(({ user: profile }) => {
                if (isActive) setUser(profile);
            })
            .catch((error: unknown) => {
                if (isActive) logout(error instanceof ApiError ? error.message : undefined);
            })
            .finally(() => {
                if (isActive) setIsLoading(false);
            });

        return () => {
            isActive = false;
        };
    }, [logout]);

    const startSession = ({ token: newToken, user: newUser }: AuthResponse) => {
        storeToken(newToken);
        setToken(newToken);
        setUser(newUser);
        setNotice(null);
    };

    const login = async (email: string, password: string) => {
        startSession(await apiRequest<AuthResponse>('/api/auth/login', { method: 'POST', body: { email, password } }));
    };

    const register = async (name: string, email: string, password: string) => {
        startSession(await apiRequest<AuthResponse>('/api/auth/register', { method: 'POST', body: { name, email, password } }));
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, notice, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
