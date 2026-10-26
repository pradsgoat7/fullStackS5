import { useEffect, useState } from 'react';
import { ApiError, apiRequest } from '../lib/api';
import { useAuth } from './useAuth';

// Fetches a JWT-protected endpoint. A 401 (expired/invalid token) logs the user
// out with the server's message so the login page can explain what happened.
export const useProtectedData = <T>(path: string) => {
    const { token, logout } = useAuth();
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;

        apiRequest<T>(path, { token })
            .then((result) => {
                if (isActive) setData(result);
            })
            .catch((err: unknown) => {
                if (!isActive) return;
                if (err instanceof ApiError && err.status === 401) {
                    logout(err.message);
                    return;
                }
                setError(err instanceof Error ? err.message : 'Something went wrong');
            });

        return () => {
            isActive = false;
        };
    }, [path, token, logout]);

    return { data, error, isLoading: data === null && error === null };
};
