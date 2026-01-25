import { useQuery } from '@tanstack/react-query';
import { getActivityLogs, getActivityStats } from '../api';

export function useActivityLogs(limit?: number, actionType?: string) {
    return useQuery({
        queryKey: ['activity-logs', { limit, actionType }],
        queryFn: () => getActivityLogs(limit, actionType),
    });
}

export function useActivityStats() {
    return useQuery({
        queryKey: ['activity-stats'],
        queryFn: getActivityStats,
    });
}
