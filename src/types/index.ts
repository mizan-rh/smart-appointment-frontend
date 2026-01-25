export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
}

export type StaffStatus = 'AVAILABLE' | 'ON_LEAVE';

export interface Staff {
    id: string;
    userId: string;
    name: string;
    serviceType: string;
    dailyCapacity: number;
    status: StaffStatus;
    createdAt: string;
    updatedAt: string;
}

export interface StaffWithAvailability extends Staff {
    isAvailable: boolean;
    currentLoad: number;
    availableSlots: number;
    hasConflict: boolean;
}

export type ServiceDuration = 'FIFTEEN_MINUTES' | 'THIRTY_MINUTES' | 'SIXTY_MINUTES';

export interface Service {
    id: string;
    userId: string;
    name: string;
    duration: ServiceDuration;
    requiredStaffType: string;
    createdAt: string;
    updatedAt: string;
}

export type AppointmentStatus =
    | 'SCHEDULED'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'NO_SHOW'
    | 'IN_QUEUE';

export interface Appointment {
    id: string;
    userId: string;
    customerName: string;
    serviceId: string;
    staffId?: string;
    appointmentDate: string;
    appointmentTime: string;
    duration: number;
    status: AppointmentStatus;
    createdAt: string;
    updatedAt: string;
    service?: Service;
    staff?: Staff;
    queue?: QueueEntry;
}

export interface QueueEntry {
    id: string;
    appointmentId: string;
    queuePosition: number;
    addedAt: string;
}

export interface ActivityLog {
    id: string;
    userId: string;
    actionType: string;
    description: string;
    appointmentId?: string;
    staffId?: string;
    createdAt: string;
}
