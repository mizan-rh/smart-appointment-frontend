import { logoutApi } from '@/features/auth/api/logout';
import { User } from '@/types';
import { create } from 'zustand';

interface AuthState {
    user: User | null;
    accessToken: string | null; // in-memory only
    setUser: (user: User, token: string) => void;
    setAccessToken: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    setUser: (user, token) => set({ user, accessToken: token }),
    setAccessToken: (token) => set({ accessToken: token }),
    logout: () => {
        // Call backend to clear cookie, then clear local state
        logoutApi().finally(() => {
            set({ user: null, accessToken: null });
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        });
    },
}));
