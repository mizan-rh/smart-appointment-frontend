'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Staff } from '@/types';
import { Edit, Trash2, UserPlus, X } from 'lucide-react';
import { useState } from 'react';
import { useDeleteStaff, useStaff } from '../queries/use-staff';
import { AddStaffModal } from './AddStaffModal';
import { EditStaffModal } from './EditStaffModal';

export function StaffList() {
    const [dateFilter, setDateFilter] = useState<string>('');
    const { data: staff, isLoading } = useStaff(dateFilter || undefined);
    const deleteMutation = useDeleteStaff();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
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
                <h3 className="text-lg font-medium">Staff Members</h3>
                <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Staff
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1 flex gap-2 items-center">
                    <Label htmlFor="staff-date" className="text-sm whitespace-nowrap">Load for Date:</Label>
                    <div className="w-50 relative">
                        <Input
                            id="staff-date"
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="bg-white"
                        />
                    </div>
                    {dateFilter && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDateFilter('')}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>

            <AddStaffModal
                open={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
            />

            <EditStaffModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                staff={selectedStaff}
            />

            <div className="border rounded-lg bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Service Type</TableHead>
                            <TableHead>Daily Capacity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {staff?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No staff members found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            staff?.map((s) => (
                                <TableRow key={s.id}>
                                    <TableCell className="font-medium">{s.name}</TableCell>
                                    <TableCell>{s.serviceType}</TableCell>
                                    <TableCell>{s.dailyCapacity}</TableCell>
                                    <TableCell>
                                        <Badge variant={s.status === 'AVAILABLE' ? 'default' : 'secondary'}>
                                            {s.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setSelectedStaff(s);
                                                setIsEditModalOpen(true);
                                            }}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive"
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this staff member?')) {
                                                    deleteMutation.mutate(s.id);
                                                }
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
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
