'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useStaff } from '@/features/staff/queries/use-staff';
import { Appointment } from '@/types';
import { format } from 'date-fns';
import { CalendarPlus, Edit, X, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useAppointments, useCancelAppointment } from '../queries/use-appointments';
import { BookingModal } from './BookingModal';
import { EditAppointmentModal } from './EditAppointmentModal';

export function AppointmentList() {
    const [dateFilter, setDateFilter] = useState<string>('');
    const [staffFilter, setStaffFilter] = useState<string>('all');

    const { data: appointments, isLoading } = useAppointments(
        dateFilter || undefined,
        staffFilter === 'all' ? undefined : staffFilter
    );
    const { data: staffList } = useStaff();
    const cancelMutation = useCancelAppointment();
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Scheduled Appointments</h3>
                <Button size="sm" onClick={() => setIsBookingModalOpen(true)}>
                    <CalendarPlus className="w-4 h-4 mr-2" />
                    Book Appointment
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1 flex gap-2">
                    <div className="w-full sm:w-50">
                        <Input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="bg-white"
                        />
                    </div>
                    <div className="w-full sm:w-62.5">
                        <Select value={staffFilter} onValueChange={setStaffFilter}>
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Filter by Staff" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Staff</SelectItem>
                                {staffList?.map((s) => (
                                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {(dateFilter || staffFilter !== 'all') && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setDateFilter('');
                                setStaffFilter('all');
                            }}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>

            <BookingModal
                open={isBookingModalOpen}
                onOpenChange={setIsBookingModalOpen}
            />

            <EditAppointmentModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                appointment={selectedAppointment}
            />

            <div className="border rounded-lg bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Staff</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {appointments?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No appointments found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            appointments?.map((app) => (
                                <TableRow key={app.id}>
                                    <TableCell className="font-medium">{app.customerName}</TableCell>
                                    <TableCell>{app.service?.name}</TableCell>
                                    <TableCell>{app.staff?.name || 'Unassigned'}</TableCell>
                                    <TableCell>
                                        {format(new Date(app.appointmentDate), 'MMM d, yyyy')} at {app.appointmentTime}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                app.status === 'SCHEDULED' ? 'default' :
                                                    app.status === 'COMPLETED' ? 'secondary' :
                                                        app.status === 'NO_SHOW' ? 'outline' :
                                                            'destructive'
                                            }
                                        >
                                            {app.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right flex justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setSelectedAppointment(app);
                                                setIsEditModalOpen(true);
                                            }}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        {app.status === 'SCHEDULED' && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive"
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to cancel this appointment?')) {
                                                        cancelMutation.mutate(app.id);
                                                    }
                                                }}
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </Button>
                                        )}
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
