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
import { Service, ServiceDuration } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useUpdateService } from '../queries/use-services';

const serviceSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    duration: z.enum(['FIFTEEN_MINUTES', 'THIRTY_MINUTES', 'SIXTY_MINUTES'] as const),
    requiredStaffType: z.string().min(1, 'Staff type is required'),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface EditServiceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    service: Service | null;
}

export function EditServiceModal({ open, onOpenChange, service }: EditServiceModalProps) {
    const updateServiceMutation = useUpdateService();

    const form = useForm<ServiceFormData>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            name: '',
            duration: 'THIRTY_MINUTES',
            requiredStaffType: '',
        },
    });

    useEffect(() => {
        if (service) {
            form.reset({
                name: service.name,
                duration: service.duration as ServiceDuration,
                requiredStaffType: service.requiredStaffType,
            });
        }
    }, [service, form]);

    const onSubmit = async (data: ServiceFormData) => {
        if (!service) return;
        try {
            await updateServiceMutation.mutateAsync({ id: service.id, dto: data });
            onOpenChange(false);
        } catch (error) {
            // Handled
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Service</DialogTitle>
                    <DialogDescription>
                        Update the configuration for {service?.name}.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-service-name">Service Name</Label>
                        <Input
                            id="edit-service-name"
                            {...form.register('name')}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-service-duration">Duration</Label>
                        <Select
                            onValueChange={(value) => form.setValue('duration', value as ServiceDuration)}
                            value={form.watch('duration')}
                        >
                            <SelectTrigger id="edit-service-duration">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="FIFTEEN_MINUTES">15 Minutes</SelectItem>
                                <SelectItem value="THIRTY_MINUTES">30 Minutes</SelectItem>
                                <SelectItem value="SIXTY_MINUTES">60 Minutes</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-service-requiredStaffType">Required Staff Type</Label>
                        <Input
                            id="edit-service-requiredStaffType"
                            {...form.register('requiredStaffType')}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={updateServiceMutation.isPending}>
                            {updateServiceMutation.isPending ? 'Updating...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
