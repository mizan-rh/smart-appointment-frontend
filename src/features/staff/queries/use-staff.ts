import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createStaff, deleteStaff, getAvailableStaff, getStaff, updateStaff } from '../api';

export const staffKeys = {
    all: ['staff'] as const,
    lists: () => [...staffKeys.all, 'list'] as const,
    list: (date?: string) => [...staffKeys.lists(), { date }] as const,
    available: (params: any) => [...staffKeys.all, 'available', params] as const,
};

import { StaffWithAvailability } from '@/types';

export function useStaff(date?: string) {
    return useQuery({
        queryKey: staffKeys.list(date),
        queryFn: () => getStaff(date),
    });
}

export function useAvailableStaff(params: any, options: { enabled?: boolean } = {}) {
    return useQuery<StaffWithAvailability[]>({
        queryKey: staffKeys.available(params),
        queryFn: () => getAvailableStaff(params),
        ...options,
    });
}

export function useCreateStaff() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createStaff,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: staffKeys.all });
            toast.success('Staff member created');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create staff member');
        },
    });
}

export function useUpdateStaff() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: any }) => updateStaff(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: staffKeys.all });
            toast.success('Staff member updated');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update staff member');
        },
    });
}

export function useDeleteStaff() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteStaff,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: staffKeys.all });
            toast.success('Staff member deleted');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete staff member');
        },
    });
}
