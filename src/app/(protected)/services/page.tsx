import { ServiceList } from '@/features/services/components/ServiceList';

export default function ServicesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Services</h2>
                <p className="text-muted-foreground">Define the services you offer and their requirements.</p>
            </div>
            <ServiceList />
        </div>
    );
}
