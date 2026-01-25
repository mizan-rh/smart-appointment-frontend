import { apiClient } from '@/lib/api-client';
import { Appointment } from '@/types';

export interface CreateAppointmentDto {
    customerName: string;
    serviceId: string;
    staffId?: string;
    appointmentDate: string;
    appointmentTime: string;
}

export interface UpdateAppointmentDto extends Partial<CreateAppointmentDto> {
    status?: string;
}

export const getAppointments = async (date?: string, staffId?: string): Promise<Appointment[]> => {
    const { data } = await apiClient.get<Appointment[]>('/appointments', {
        params: { date, staffId },
    });
    return data;
};

export const createAppointment = async (dto: CreateAppointmentDto): Promise<Appointment> => {
    const { data } = await apiClient.post<Appointment>('/appointments', dto);
    return data;
};

export const updateAppointment = async (id: string, dto: UpdateAppointmentDto): Promise<Appointment> => {
    const { data } = await apiClient.patch<Appointment>(`/appointments/${id}`, dto);
    return data;
};

export const cancelAppointment = async (id: string): Promise<void> => {
    await apiClient.delete(`/appointments/${id}`);
};
