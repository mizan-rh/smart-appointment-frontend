import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { autoAssignQueue, getQueue } from '../api';

export const queueKeys = {
    all: ['queue'] as const,
};

export function useQueue() {
    return useQuery({
        queryKey: queueKeys.all,
        queryFn: getQueue,
    });
}

export function useAutoAssign() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: autoAssignQueue,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['queue'] });
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            toast.success(`Auto-assigned: ${data.assigned}, Failed: ${data.failed}`);
        },
        onError: () => {
            toast.error('Failed to auto-assign queue');
        },
    });
}
