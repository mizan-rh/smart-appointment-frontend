'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { useServices } from '@/features/services/queries/use-services';
import { useAvailableStaff, useStaff } from '@/features/staff/queries/use-staff';
import { Appointment, AppointmentStatus } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useUpdateAppointment } from '../queries/use-appointments';

const editAppointmentSchema = z.object({
    customerName: z.string().min(1, 'Name is required'),
    serviceId: z.string().uuid('Please select a service'),
    staffId: z.string().uuid().optional(),
    appointmentDate: z.string().min(1, 'Date is required'),
    appointmentTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'),
    status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'IN_QUEUE']),
});

type EditAppointmentFormData = z.infer<typeof editAppointmentSchema>;

interface EditAppointmentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    appointment: Appointment | null;
}

export function EditAppointmentModal({ open, onOpenChange, appointment }: EditAppointmentModalProps) {
    const updateMutation = useUpdateAppointment();
    const { data: services } = useServices();
    const { data: staffList } = useStaff();

    const form = useForm<EditAppointmentFormData>({
        resolver: zodResolver(editAppointmentSchema),
        values: appointment ? {
            customerName: appointment.customerName,
            serviceId: appointment.serviceId,
            staffId: appointment.staffId || undefined,
            appointmentDate: appointment.appointmentDate,
            appointmentTime: appointment.appointmentTime,
            status: appointment.status,
        } : undefined,
    });

    const selectedServiceId = form.watch('serviceId');
    const selectedDate = form.watch('appointmentDate');
    const selectedTime = form.watch('appointmentTime');

    const selectedService = services?.find(s => s.id === selectedServiceId);

    const { data: availableStaff, isLoading: isLoadingStaff } = useAvailableStaff(
        {
            serviceType: selectedService?.requiredStaffType || '',
            date: selectedDate,
            time: selectedTime,
            duration: selectedService?.duration === 'FIFTEEN_MINUTES' ? 15 : selectedService?.duration === 'THIRTY_MINUTES' ? 30 : 60,
        },
        { enabled: !!selectedService && !!selectedDate && !!selectedTime && open }
    );

    const onSubmit = async (data: EditAppointmentFormData) => {
        if (!appointment) return;
        try {
            await updateMutation.mutateAsync({
                id: appointment.id,
                dto: {
                    ...data,
                    appointmentDate: new Date(data.appointmentDate),
                    staffId: data.staffId === 'unassigned' ? null : data.staffId,
                },
            });
            onOpenChange(false);
        } catch (error) {
            // Error handled by mutation
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-125">
                <DialogHeader>
                    <DialogTitle>Edit Appointment</DialogTitle>
                    <DialogDescription>
                        Update appointment details and status.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="customerName">Customer Name</Label>
                        <Input id="customerName" {...form.register('customerName')} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" type="date" {...form.register('appointmentDate')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="time">Time</Label>
                            <Input id="time" type="time" {...form.register('appointmentTime')} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="service">Service</Label>
                        <Select
                            onValueChange={(val) => form.setValue('serviceId', val)}
                            value={form.watch('serviceId')}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select service" />
                            </SelectTrigger>
                            <SelectContent>
                                {services?.map(s => (
                                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Assigned Staff</Label>
                        {isLoadingStaff ? (
                            <p className="text-sm text-muted-foreground animate-pulse">Checking availability...</p>
                        ) : availableStaff && availableStaff.length > 0 ? (
                            <div className="grid gap-2 overflow-y-auto max-h-48 pr-2">
                                {availableStaff.map((staff) => (
                                    <div
                                        key={staff.id}
                                        onClick={() => staff.isAvailable && form.setValue('staffId', staff.id)}
                                        className={`p-2 border rounded-md transition-colors ${!staff.isAvailable
                                            ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400'
                                            : form.watch('staffId') === staff.id
                                                ? 'border-primary bg-primary/5 cursor-pointer'
                                                : 'hover:border-primary/50 cursor-pointer'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">{staff.name}</span>
                                            {staff.isAvailable ? (
                                                <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full uppercase font-bold">OK</span>
                                            ) : (
                                                <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full uppercase font-bold">Conflict</span>
                                            )}
                                        </div>
                                        <p className="text-[10px]">Load: {staff.currentLoad}/{staff.dailyCapacity}</p>
                                    </div>
                                ))}
                                <div
                                    onClick={() => form.setValue('staffId', undefined)}
                                    className={`p-2 border rounded-md cursor-pointer transition-colors ${!form.watch('staffId')
                                        ? 'border-primary bg-primary/5'
                                        : 'hover:border-primary/50'
                                        }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-orange-600">Unassigned (Queue)</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-destructive">No staff found for this service type.</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            onValueChange={(val) => form.setValue('status', val as AppointmentStatus)}
                            value={form.watch('status')}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                <SelectItem value="NO_SHOW">No-Show</SelectItem>
                                <SelectItem value="IN_QUEUE">In Queue</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
