'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useActivityLogs } from '@/features/activity/queries/use-activity';
import { useAppointments } from '@/features/appointments/queries/use-appointments';
import { DashboardCharts } from '@/features/dashboard/components/DashboardCharts';
import { useDashboardMetrics } from '@/features/dashboard/queries/use-dashboard';
import { format } from 'date-fns';
import { Briefcase, Calendar, ListOrdered, Users } from 'lucide-react';

export default function DashboardPage() {
    const { data: metrics, isLoading } = useDashboardMetrics();
    const { data: recentLogs, isLoading: isLoadingLogs } = useActivityLogs(5);
    const { data: upcomingAppointments, isLoading: isLoadingApps } = useAppointments();

    const stats = [
        { name: 'Total Appointments', value: metrics?.appointments?.totalToday ?? 0, icon: Calendar, color: 'text-blue-600' },
        { name: 'Completed Today', value: metrics?.appointments?.completed ?? 0, icon: Users, color: 'text-green-600' },
        { name: 'Pending Today', value: metrics?.appointments?.pending ?? 0, icon: Briefcase, color: 'text-purple-600' },
        { name: 'Waiting Queue', value: metrics?.queue?.totalInQueue ?? 0, icon: ListOrdered, color: 'text-orange-600' },
    ];

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Welcome back! Here's an overview of your activity.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.name}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <DashboardCharts metrics={metrics} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Staff Load Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!metrics?.staff?.loadSummary || metrics.staff.loadSummary.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No staff data available.</p>
                        ) : (
                            metrics.staff.loadSummary.map((staff: any) => (
                                <div key={staff.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200">
                                    <span className="text-sm font-medium">
                                        {staff.name} — {staff.currentLoad} / {staff.capacity} ({staff.status})
                                    </span>
                                    <div className={`h-2.5 w-2.5 rounded-full ${staff.currentLoad >= staff.capacity ? 'bg-red-500' : 'bg-green-500'}`} />
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isLoadingLogs ? (
                            <Skeleton className="h-20 w-full" />
                        ) : !recentLogs || recentLogs.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No recent activity found.</p>
                        ) : (
                            recentLogs.map((log) => (
                                <div key={log.id} className="flex justify-between items-start border-b pb-2 last:border-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{log.description}</p>
                                        <p className="text-[10px] text-muted-foreground">
                                            {log.createdAt ? format(new Date(log.createdAt), 'MMM d, HH:mm') : 'Recently'}
                                        </p>
                                    </div>
                                    <Badge variant="outline" className="text-[10px] uppercase h-5 px-1.5">
                                        {log.actionType.replace(/_/g, ' ')}
                                    </Badge>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Upcoming Appointments</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isLoadingApps ? (
                            <Skeleton className="h-20 w-full" />
                        ) : !upcomingAppointments || upcomingAppointments.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No upcoming appointments.</p>
                        ) : (
                            upcomingAppointments.slice(0, 5).map((app) => (
                                <div key={app.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{app.customerName}</p>
                                        <p className="text-[10px] text-muted-foreground">{app.service?.name} • {app.appointmentTime}</p>
                                    </div>
                                    <Badge variant={app.status === 'SCHEDULED' ? 'default' : 'secondary'} className="text-[10px] h-5">
                                        {app.status}
                                    </Badge>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
