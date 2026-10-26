export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5001';

export interface FieldError {
    field: string;
    message: string;
}

export class ApiError extends Error {
    status: number;
    fieldErrors: FieldError[];

    constructor(status: number, message: string, fieldErrors: FieldError[] = []) {
        super(message);
        this.status = status;
        this.fieldErrors = fieldErrors;
    }
}

interface RequestOptions {
    method?: string;
    body?: unknown;
    token?: string | null;
}

export const apiRequest = async <T>(path: string, { method = 'GET', body, token }: RequestOptions = {}): Promise<T> => {
    const headers: Record<string, string> = {};
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (token) headers.Authorization = `Bearer ${token}`;

    let response: Response;
    try {
        response = await fetch(`${API_URL}${path}`, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
    } catch {
        throw new ApiError(0, 'Cannot reach the server. Please make sure the backend is running.');
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new ApiError(response.status, data.message ?? 'Something went wrong', data.errors ?? []);
    }
    return data as T;
};
