import { apiClient } from '@/lib/api-client';
import { Staff } from '@/types';

export interface CreateStaffDto {
    name: string;
    serviceType: string;
    dailyCapacity: number;
}

export interface UpdateStaffDto extends Partial<CreateStaffDto> {
    status?: 'AVAILABLE' | 'ON_LEAVE';
}

export const getStaff = async (date?: string): Promise<Staff[]> => {
    const { data } = await apiClient.get<Staff[]>('/staff', {
        params: { date },
    });
    console.log(data);
    return data;
};

export const createStaff = async (dto: CreateStaffDto): Promise<Staff> => {
    const { data } = await apiClient.post<Staff>('/staff', dto);
    return data;
};

export const updateStaff = async (id: string, dto: UpdateStaffDto): Promise<Staff> => {
    const { data } = await apiClient.patch<Staff>(`/staff/${id}`, dto);
    return data;
};

export const deleteStaff = async (id: string): Promise<void> => {
    await apiClient.delete(`/staff/${id}`);
};

export interface AvailableStaffParams {
    serviceType: string;
    date: string;
    time: string;
    duration: number;
}

import { StaffWithAvailability } from '@/types';

export const getAvailableStaff = async (params: AvailableStaffParams): Promise<StaffWithAvailability[]> => {
    const { data } = await apiClient.get<StaffWithAvailability[]>('/staff/available', {
        params,
    });
    return data;
};
