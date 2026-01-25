import { apiClient } from '@/lib/api-client';

export interface DashboardMetrics {
    totalAppointments: number;
    totalStaff: number;
    totalServices: number;
    queueSize: number;
    appointmentsByStatus: Record<string, number>;
    todayAppointments: number;
    appointments: {
        totalToday: number;
        completed: number;
        pending: number;
        cancelled: number;
        noShow: number;
        completionRate: number;
    };
    queue: {
        totalInQueue: number;
        oldestWaitTime: string;
        averageWaitTime: string;
    };
    staff: {
        totalStaff: number;
        available: number;
        onLeave: number;
        loadSummary: Array<{
            id: string;
            name: string;
            currentLoad: number;
            capacity: number;
            percentage: number;
            status: string;
        }>;
    };
}

export const getDashboardMetrics = async (date?: string): Promise<DashboardMetrics> => {
    const { data } = await apiClient.get<DashboardMetrics>('/dashboard/metrics', {
        params: { date },
    });
    return data;
};
