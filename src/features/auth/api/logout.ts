import { apiClient } from '@/lib/api-client';

export const logoutApi = async (): Promise<void> => {
    try {
        await apiClient.post('/auth/logout');
    } catch (error) {
        // Even if the API call fails, we still want to clear local state
        console.warn('Logout API call failed, clearing local state anyway');
    }
};
