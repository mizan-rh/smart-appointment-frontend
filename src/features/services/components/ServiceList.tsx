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
import { Service } from '@/types';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useDeleteService, useServices } from '../queries/use-services';
import { AddServiceModal } from './AddServiceModal';
import { EditServiceModal } from './EditServiceModal';

export function ServiceList() {
    const { data: services, isLoading } = useServices();
    const deleteMutation = useDeleteService();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
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
                <h3 className="text-lg font-medium">Available Services</h3>
                <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                </Button>
            </div>

            <AddServiceModal
                open={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
            />

            <EditServiceModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                service={selectedService}
            />

            <div className="border rounded-lg bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Service Name</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Staff Type Required</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    No services found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            services?.map((service) => (
                                <TableRow key={service.id}>
                                    <TableCell className="font-medium">{service.name}</TableCell>
                                    <TableCell>{service.duration.replace('_', ' ')}</TableCell>
                                    <TableCell>{service.requiredStaffType}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setSelectedService(service);
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
                                                if (confirm('Are you sure you want to delete this service?')) {
                                                    deleteMutation.mutate(service.id);
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
