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
import { Staff } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useUpdateStaff } from '../queries/use-staff';

const staffSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    serviceType: z.string().min(1, 'Service type is required'),
    dailyCapacity: z.number().min(1, 'Capacity must be at least 1').max(100),
    status: z.enum(['AVAILABLE', 'ON_LEAVE']),
});

type StaffFormData = z.infer<typeof staffSchema>;

interface EditStaffModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    staff: Staff | null;
}

export function EditStaffModal({ open, onOpenChange, staff }: EditStaffModalProps) {
    const updateStaffMutation = useUpdateStaff();

    const form = useForm<StaffFormData>({
        resolver: zodResolver(staffSchema),
        defaultValues: {
            name: '',
            serviceType: '',
            dailyCapacity: 5,
            status: 'AVAILABLE',
        },
    });

    useEffect(() => {
        if (staff) {
            form.reset({
                name: staff.name,
                serviceType: staff.serviceType,
                dailyCapacity: staff.dailyCapacity,
                status: staff.status === 'ON_LEAVE' ? 'ON_LEAVE' : 'AVAILABLE',
            });
        }
    }, [staff, form]);

    const onSubmit = async (data: StaffFormData) => {
        if (!staff) return;
        try {
            await updateStaffMutation.mutateAsync({ id: staff.id, dto: data });
            onOpenChange(false);
        } catch (error) {
            // Handled by toast
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>Edit Staff Member</DialogTitle>
                    <DialogDescription>
                        Update details for {staff?.name}.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Full Name</Label>
                        <Input
                            id="edit-name"
                            {...form.register('name')}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-serviceType">Service Type</Label>
                        <Input
                            id="edit-serviceType"
                            {...form.register('serviceType')}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-dailyCapacity">Daily Capacity</Label>
                            <Input
                                id="edit-dailyCapacity"
                                type="number"
                                {...form.register('dailyCapacity', { valueAsNumber: true })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-status">Status</Label>
                            <Select
                                onValueChange={(val) => form.setValue('status', val as any)}
                                value={form.watch('status')}
                            >
                                <SelectTrigger id="edit-status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="AVAILABLE">Available</SelectItem>
                                    <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={updateStaffMutation.isPending}>
                            {updateStaffMutation.isPending ? 'Updating...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
