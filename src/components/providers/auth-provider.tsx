'use client';

import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isInitializing, setIsInitializing] = useState(true);
    const { setAccessToken, setUser, logout } = useAuthStore();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const initAuth = async () => {
            // Don't try to refresh on login/signup pages to avoid unnecessary 401s
            if (pathname === '/login' || pathname === '/signup') {
                setIsInitializing(false);
                return;
            }

            try {
                const { data } = await apiClient.post('/auth/refresh');
                setAccessToken(data.accessToken);

                // Also get user profile
                const { data: userData } = await apiClient.get('/auth/me');
                setUser(userData, data.accessToken);
            } catch (error) {
                // If refresh fails, we might not have a session, which is fine if we're on a public page
                // But proxy.ts should have handled the redirect already if needed.
                // We just ensure we're logged out locally.
                logout();
            } finally {
                setIsInitializing(false);
            }
        };

        initAuth();
    }, [setAccessToken, setUser, logout, pathname]);

    if (isInitializing) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium text-muted-foreground">Initializing session...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
