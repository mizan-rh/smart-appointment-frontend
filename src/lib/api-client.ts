import { useAuthStore } from '@/stores/auth-store';
import axios from 'axios';
import { env } from './env';

export const apiClient = axios.create({
    baseURL: env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;
        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;
            try {
                const { data } = await apiClient.post('/auth/refresh');
                useAuthStore.getState().setAccessToken(data.accessToken);

                if (original.headers) {
                    original.headers.Authorization = `Bearer ${data.accessToken}`;
                }

                return apiClient(original);
            } catch (refreshError) {
                useAuthStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
