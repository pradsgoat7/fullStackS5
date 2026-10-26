export type Role = 'student' | 'staff' | 'admin';

export interface AuthUser {
    _id: string;
    name: string;
    email: string;
    role: Role;
    createdAt: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    user: AuthUser;
}
