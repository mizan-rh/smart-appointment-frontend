'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { ManualAssignModal } from '@/features/queue/components/ManualAssignModal';
import { useAutoAssign, useQueue } from '@/features/queue/queries/use-queue';
import { Zap } from 'lucide-react';
import { useState } from 'react';

export default function QueuePage() {
    const { data: queue, isLoading } = useQueue();
    const autoAssignMutation = useAutoAssign();
    const [selectedEntry, setSelectedEntry] = useState<any>(null);
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-48" />
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Queue Manager</h2>
                    <p className="text-muted-foreground">Manage waiting appointments and auto-assign them.</p>
                </div>
                <Button
                    onClick={() => autoAssignMutation.mutate()}
                    disabled={autoAssignMutation.isPending || !queue || queue.length === 0}
                >
                    <Zap className="w-4 h-4 mr-2" />
                    {autoAssignMutation.isPending ? 'Assigning...' : 'Assign From Queue'}
                </Button>
            </div>

            <div className="border rounded-lg bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Position</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Waiting Since</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!queue || queue.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    The queue is currently empty.
                                </TableCell>
                            </TableRow>
                        ) : (
                            queue.map((entry) => (
                                <TableRow key={entry.id}>
                                    <TableCell className="font-bold">
                                        {(() => {
                                            const n = entry.queuePosition;
                                            const s = ["th", "st", "nd", "rd"];
                                            const v = n % 100;
                                            return n + (s[(v - 20) % 10] || s[v] || s[0]);
                                        })()}
                                    </TableCell>
                                    <TableCell>{entry.appointment.customerName}</TableCell>
                                    <TableCell>{entry.appointment.service?.name}</TableCell>
                                    <TableCell>{new Date(entry.addedAt).toLocaleTimeString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedEntry(entry);
                                                setIsManualModalOpen(true);
                                            }}
                                        >
                                            Manual Assign
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <ManualAssignModal
                open={isManualModalOpen}
                onOpenChange={setIsManualModalOpen}
                queueEntry={selectedEntry}
            />
        </div>
    );
}
