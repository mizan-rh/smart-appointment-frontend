'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { useActivityLogs } from '@/features/activity/queries/use-activity';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { useState } from 'react';

export default function ActivityPage() {
    const [actionType, setActionType] = useState<string>('all');
    const { data: logs, isLoading } = useActivityLogs(50, actionType === 'all' ? undefined : actionType);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-48" />
                {[...Array(10)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Activity Logs</h2>
                    <p className="text-muted-foreground">Track all changes and actions performed in the system.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="w-full sm:w-62.5">
                        <Select value={actionType} onValueChange={setActionType}>
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Filter by Action" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Actions</SelectItem>
                                <SelectItem value="AUTH_LOGIN">Login</SelectItem>
                                <SelectItem value="STAFF_CREATED">Staff Created</SelectItem>
                                <SelectItem value="STAFF_UPDATED">Staff Updated</SelectItem>
                                <SelectItem value="SERVICE_CREATED">Service Created</SelectItem>
                                <SelectItem value="APPOINTMENT_CREATED">Appointment Created</SelectItem>
                                <SelectItem value="QUEUE_ADDED">Added to Queue</SelectItem>
                                <SelectItem value="QUEUE_ASSIGNED">Assigned from Queue</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {actionType !== 'all' && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setActionType('all')}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>

            <div className="border rounded-lg bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Action</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Date & Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!logs || logs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                    No activity logs found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            logs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell>
                                        <Badge variant="outline">{log.actionType}</Badge>
                                    </TableCell>
                                    <TableCell>{log.description}</TableCell>
                                    <TableCell>
                                        {log.createdAt ? format(new Date(log.createdAt), 'MMM d, yyyy HH:mm:ss') : 'Recently'}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
