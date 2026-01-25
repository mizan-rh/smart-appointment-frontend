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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateStaff } from '../queries/use-staff';

const staffSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    serviceType: z.string().min(1, 'Service type is required'),
    dailyCapacity: z.number().min(1, 'Capacity must be at least 1').max(5, 'Max capacity is 5'),
});

type StaffFormData = z.infer<typeof staffSchema>;

interface AddStaffModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddStaffModal({ open, onOpenChange }: AddStaffModalProps) {
    const createStaffMutation = useCreateStaff();

    const form = useForm<StaffFormData>({
        resolver: zodResolver(staffSchema),
        defaultValues: {
            name: '',
            serviceType: '',
            dailyCapacity: 5,
        },
    });

    const onSubmit = async (data: StaffFormData) => {
        try {
            await createStaffMutation.mutateAsync(data);
            form.reset();
            onOpenChange(false);
        } catch (error) {
            // Error handled by mutation toast
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Staff Member</DialogTitle>
                    <DialogDescription>
                        Create a new staff member to manage appointments.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            placeholder="Dr. Alice Smith"
                            {...form.register('name')}
                        />
                        {form.formState.errors.name && (
                            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="serviceType">Service Type (Specialty)</Label>
                        <Input
                            id="serviceType"
                            placeholder="CONSULTATION"
                            {...form.register('serviceType')}
                        />
                        {form.formState.errors.serviceType && (
                            <p className="text-sm text-destructive">{form.formState.errors.serviceType.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dailyCapacity">Daily Capacity</Label>
                        <Input
                            id="dailyCapacity"
                            type="number"
                            {...form.register('dailyCapacity', { valueAsNumber: true })}
                        />
                        {form.formState.errors.dailyCapacity && (
                            <p className="text-sm text-destructive">{form.formState.errors.dailyCapacity.message}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={createStaffMutation.isPending}>
                            {createStaffMutation.isPending ? 'Saving...' : 'Add Staff'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
