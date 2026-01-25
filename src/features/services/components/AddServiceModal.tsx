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
import { ServiceDuration } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateService } from '../queries/use-services';

const serviceSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    duration: z.enum(['FIFTEEN_MINUTES', 'THIRTY_MINUTES', 'SIXTY_MINUTES'] as const),
    requiredStaffType: z.string().min(1, 'Staff type is required'),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface AddServiceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddServiceModal({ open, onOpenChange }: AddServiceModalProps) {
    const createServiceMutation = useCreateService();

    const form = useForm<ServiceFormData>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            name: '',
            duration: 'THIRTY_MINUTES',
            requiredStaffType: '',
        },
    });

    const onSubmit = async (data: ServiceFormData) => {
        try {
            await createServiceMutation.mutateAsync(data);
            form.reset();
            onOpenChange(false);
        } catch (error) {
            // Error handled by mutation toast
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Service</DialogTitle>
                    <DialogDescription>
                        Define a new service that customers can book.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Service Name</Label>
                        <Input
                            id="name"
                            placeholder="Deep Cleaning"
                            {...form.register('name')}
                        />
                        {form.formState.errors.name && (
                            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="duration">Duration</Label>
                        <Select
                            onValueChange={(value) => form.setValue('duration', value as ServiceDuration)}
                            defaultValue={form.getValues('duration')}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="FIFTEEN_MINUTES">15 Minutes</SelectItem>
                                <SelectItem value="THIRTY_MINUTES">30 Minutes</SelectItem>
                                <SelectItem value="SIXTY_MINUTES">60 Minutes</SelectItem>
                            </SelectContent>
                        </Select>
                        {form.formState.errors.duration && (
                            <p className="text-sm text-destructive">{form.formState.errors.duration.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="requiredStaffType">Required Staff Type</Label>
                        <Input
                            id="requiredStaffType"
                            placeholder="e.g., CONSULTATION, TREATMENT"
                            {...form.register('requiredStaffType')}
                        />
                        {form.formState.errors.requiredStaffType && (
                            <p className="text-sm text-destructive">{form.formState.errors.requiredStaffType.message}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={createServiceMutation.isPending}>
                            {createServiceMutation.isPending ? 'Saving...' : 'Add Service'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
