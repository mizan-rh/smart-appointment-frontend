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
import { useAvailableStaff } from '@/features/staff/queries/use-staff';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateAppointment } from '../queries/use-appointments';

const bookingSchema = z.object({
    customerName: z.string().min(1, 'Name is required'),
    serviceId: z.string().uuid('Please select a service'),
    appointmentDate: z.string().min(1, 'Date is required'),
    appointmentTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'),
    staffId: z.string().uuid().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function BookingModal({ open, onOpenChange }: BookingModalProps) {
    const { data: services } = useServices();
    const createAppointmentMutation = useCreateAppointment();
    const [step, setStep] = useState(1);

    const form = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            customerName: '',
            serviceId: '',
            appointmentDate: format(new Date(), 'yyyy-MM-dd'),
            appointmentTime: '09:00',
        },
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
        { enabled: !!selectedService && !!selectedDate && !!selectedTime && step === 2 }
    );

    const onSubmit = async (data: BookingFormData) => {
        try {
            await createAppointmentMutation.mutateAsync(data);
            form.reset();
            setStep(1);
            onOpenChange(false);
        } catch (error) {
            // Handled by mutation
        }
    };

    const handleNext = async () => {
        const isValid = await form.trigger(['customerName', 'serviceId', 'appointmentDate', 'appointmentTime']);
        if (isValid) setStep(2);
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            onOpenChange(val);
            if (!val) {
                setStep(1);
                form.reset();
            }
        }}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Book Appointment</DialogTitle>
                    <DialogDescription>
                        {step === 1 ? 'Details for the appointment' : 'Choose available staff'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    {step === 1 && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="customerName">Customer Name</Label>
                                <Input
                                    id="customerName"
                                    placeholder="John Doe"
                                    {...form.register('customerName')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="service">Service</Label>
                                <Select onValueChange={(val) => form.setValue('serviceId', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select service" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {services?.map(s => (
                                            <SelectItem key={s.id} value={s.id}>
                                                {s.name} ({s.duration.replace('_', ' ').toLowerCase()})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        {...form.register('appointmentDate')}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="time">Time</Label>
                                    <Input
                                        id="time"
                                        type="time"
                                        {...form.register('appointmentTime')}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <Label>Available Staff</Label>
                            {isLoadingStaff ? (
                                <p className="text-sm text-muted-foreground animate-pulse">Checking availability...</p>
                            ) : availableStaff && availableStaff.length > 0 ? (
                                <div className="grid gap-2">
                                    {availableStaff.map((staff) => (
                                        <div
                                            key={staff.id}
                                            onClick={() => staff.isAvailable && form.setValue('staffId', staff.id)}
                                            className={`p-3 border rounded-lg transition-colors ${!staff.isAvailable
                                                ? 'opacity-50 cursor-not-allowed bg-slate-50'
                                                : form.watch('staffId') === staff.id
                                                    ? 'border-primary bg-primary/5 cursor-pointer'
                                                    : 'hover:border-primary/50 cursor-pointer'
                                                }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <p className="font-medium">{staff.name}</p>
                                                {staff.isAvailable ? (
                                                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase font-bold">Available</span>
                                                ) : (
                                                    <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full uppercase font-bold">Conflict</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground">Load: {staff.currentLoad}/{staff.dailyCapacity}</p>
                                            {!staff.isAvailable && (
                                                <p className="text-[10px] text-destructive mt-1">
                                                    {staff.hasConflict ? 'Time conflict' : 'Daily capacity reached'}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                    <div
                                        onClick={() => form.setValue('staffId', undefined)}
                                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${!form.watch('staffId')
                                            ? 'border-primary bg-primary/5'
                                            : 'hover:border-primary/50'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <p className="font-medium text-orange-600">Assign to Queue</p>
                                            <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full uppercase font-bold">Queue</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">No specific staff required</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                    <p className="text-sm text-orange-800">No staff members found for this service type. Appointment will be added to the queue.</p>
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter className="flex justify-between sm:justify-between">
                        {step === 2 && (
                            <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                                Back
                            </Button>
                        )}
                        {step === 1 ? (
                            <Button type="button" onClick={handleNext} className="ml-auto">
                                Next
                            </Button>
                        ) : (
                            <Button type="submit" disabled={createAppointmentMutation.isPending}>
                                {createAppointmentMutation.isPending ? 'Booking...' : 'Confirm Appointment'}
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
