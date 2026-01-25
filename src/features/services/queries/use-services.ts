import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createService, deleteService, getServices, updateService } from '../api';

export const serviceKeys = {
    all: ['services'] as const,
    lists: () => [...serviceKeys.all, 'list'] as const,
};

export function useServices() {
    return useQuery({
        queryKey: serviceKeys.lists(),
        queryFn: getServices,
    });
}

export function useCreateService() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: serviceKeys.all });
            toast.success('Service created');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create service');
        },
    });
}

export function useUpdateService() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: any }) => updateService(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: serviceKeys.all });
            toast.success('Service updated');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update service');
        },
    });
}

export function useDeleteService() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: serviceKeys.all });
            toast.success('Service deleted');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete service');
        },
    });
}
