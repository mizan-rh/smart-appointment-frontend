import { apiClient } from '@/lib/api-client';
import { ActivityLog } from '@/types';

export const getActivityLogs = async (limit: number = 20, actionType?: string): Promise<ActivityLog[]> => {
    const { data } = await apiClient.get<ActivityLog[]>('/activity-logs', {
        params: { limit, actionType },
    });
    return data;
};

export const getActivityStats = async (): Promise<any> => {
    const { data } = await apiClient.get('/activity-logs/stats');
    return data;
};
