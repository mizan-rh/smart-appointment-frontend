import { apiClient } from '@/lib/api-client';
import { AuthResponse, RegisterFormData } from '../types';

export const signup = async (data: RegisterFormData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/signup', data);
    return response.data;
};
