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
import { Label } from '@/components/ui/label';
import { useAvailableStaff } from '@/features/staff/queries/use-staff';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { assignFromQueue } from '../api';

interface ManualAssignModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    queueEntry: any;
}

export function ManualAssignModal({ open, onOpenChange, queueEntry }: ManualAssignModalProps) {
    const queryClient = useQueryClient();
    const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

    const { data: availableStaff, isLoading } = useAvailableStaff(
        {
            serviceType: queueEntry?.appointment?.service?.requiredStaffType || '',
            date: queueEntry?.appointment?.appointmentDate || '',
            time: queueEntry?.appointment?.appointmentTime || '',
            duration:
                queueEntry?.appointment?.service?.duration === 'SIXTY_MINUTES' ? 60 :
                    queueEntry?.appointment?.service?.duration === 'THIRTY_MINUTES' ? 30 :
                        15,
        },
        { enabled: !!queueEntry && open }
    );

    const assignMutation = useMutation({
        mutationFn: (staffId: string) => assignFromQueue(queueEntry.id, staffId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['queue'] });
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            toast.success('Staff assigned successfully');
            onOpenChange(false);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to assign staff');
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-112.5">
                <DialogHeader>
                    <DialogTitle>Manual Staff Assignment</DialogTitle>
                    <DialogDescription>
                        Assign a staff member to the appointment for {queueEntry?.appointment?.customerName}.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <Label>Select Available Staff</Label>
                    {isLoading ? (
                        <p className="text-sm text-muted-foreground animate-pulse">Checking availability...</p>
                    ) : availableStaff && availableStaff.length > 0 ? (
                        <div className="grid gap-2">
                            {availableStaff.map((staff) => (
                                <div
                                    key={staff.id}
                                    onClick={() => staff.isAvailable && setSelectedStaffId(staff.id)}
                                    className={`p-3 border rounded-lg transition-colors ${!staff.isAvailable
                                        ? 'opacity-50 cursor-not-allowed bg-slate-50'
                                        : selectedStaffId === staff.id
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
                                        <p className="text-[10px] text-destructive mt-1">Has time conflict or at capacity</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-destructive">No staff members found for this service type.</p>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        onClick={() => selectedStaffId && assignMutation.mutate(selectedStaffId)}
                        disabled={!selectedStaffId || assignMutation.isPending}
                    >
                        {assignMutation.isPending ? 'Assigning...' : 'Assign Staff'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
