import { useQuery } from '@tanstack/react-query';
import { getDashboardMetrics } from '../api';

export function useDashboardMetrics(date?: string) {
    return useQuery({
        queryKey: ['dashboard', 'metrics', date],
        queryFn: () => getDashboardMetrics(date),
    });
}
