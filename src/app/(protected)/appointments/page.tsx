import { AppointmentList } from '@/features/appointments/components/AppointmentList';

export default function AppointmentsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Appointments</h2>
                <p className="text-muted-foreground">Manage and track all scheduled sessions.</p>
            </div>
            <AppointmentList />
        </div>
    );
}
