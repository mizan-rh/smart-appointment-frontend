import { apiClient } from '@/lib/api-client';
import { AuthResponse, LoginFormData } from '../types';

export const login = async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
};
