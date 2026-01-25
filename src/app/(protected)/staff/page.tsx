import { StaffList } from '@/features/staff/components/StaffList';

export default function StaffPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Staff Management</h2>
                <p className="text-muted-foreground">Manage your team and their availability.</p>
            </div>
            <StaffList />
        </div>
    );
}
