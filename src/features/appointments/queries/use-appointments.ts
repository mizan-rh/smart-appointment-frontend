import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cancelAppointment, createAppointment, getAppointments, updateAppointment } from '../api';

export const appointmentKeys = {
    all: ['appointments'] as const,
    lists: () => [...appointmentKeys.all, 'list'] as const,
    list: (date?: string, staffId?: string) => [...appointmentKeys.lists(), { date, staffId }] as const,
};

export function useAppointments(date?: string, staffId?: string) {
    return useQuery({
        queryKey: appointmentKeys.list(date, staffId),
        queryFn: () => getAppointments(date, staffId),
    });
}

export function useCreateAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createAppointment,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
            if (data.status === 'IN_QUEUE') {
                toast.warning('No available staff at this time. Appointment added to the waiting queue.');
            } else {
                toast.success('Appointment created successfully');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create appointment');
        },
    });
}

export function useUpdateAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: any }) => updateAppointment(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
            toast.success('Appointment updated');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update appointment');
        },
    });
}

export function useCancelAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cancelAppointment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
            toast.success('Appointment cancelled');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to cancel appointment');
        },
    });
}
