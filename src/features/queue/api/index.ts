import { apiClient } from '@/lib/api-client';
import { Appointment, QueueEntry } from '@/types';

export interface QueueEntryWithAppointment extends QueueEntry {
    appointment: Appointment;
}

export const getQueue = async (): Promise<QueueEntryWithAppointment[]> => {
    const { data } = await apiClient.get<QueueEntryWithAppointment[]>('/queue');
    return data;
};

export const assignFromQueue = async (queueEntryId: string, staffId: string): Promise<Appointment> => {
    const { data } = await apiClient.post<Appointment>(`/queue/assign/${queueEntryId}`, { staffId });
    return data;
};

export const autoAssignQueue = async (): Promise<{ assigned: number; failed: number }> => {
    const { data } = await apiClient.post('/queue/auto-assign');
    return data;
};
