import { apiClient } from '@/lib/api-client';
import { Service, ServiceDuration } from '@/types';

export interface CreateServiceDto {
    name: string;
    duration: ServiceDuration;
    requiredStaffType: string;
}

export interface UpdateServiceDto extends Partial<CreateServiceDto> { }

export const getServices = async (): Promise<Service[]> => {
    const { data } = await apiClient.get<Service[]>('/services');
    return data;
};

export const createService = async (dto: CreateServiceDto): Promise<Service> => {
    const { data } = await apiClient.post<Service>('/services', dto);
    return data;
};

export const updateService = async (id: string, dto: UpdateServiceDto): Promise<Service> => {
    const { data } = await apiClient.patch<Service>(`/services/${id}`, dto);
    return data;
};

export const deleteService = async (id: string): Promise<void> => {
    await apiClient.delete(`/services/${id}`);
};
