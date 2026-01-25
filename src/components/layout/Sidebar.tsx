'use client';

import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import {
    Activity,
    Briefcase,
    Calendar,
    LayoutDashboard,
    ListOrdered,
    LogOut,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Staff', href: '/staff', icon: Users },
    { name: 'Services', href: '/services', icon: Briefcase },
    { name: 'Appointments', href: '/appointments', icon: Calendar },
    { name: 'Queue', href: '/queue', icon: ListOrdered },
    { name: 'Activity', href: '/activity', icon: Activity },
];

export function Sidebar() {
    const pathname = usePathname();
    const logout = useAuthStore((state) => state.logout);

    return (
        <div className="flex flex-col w-64 border-r bg-white h-full">
            <div className="p-6">
                <h1 className="text-xl font-bold text-primary">Smart Appoint</h1>
            </div>
            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                        >
                            <item.icon className="w-4 h-4" />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t">
                <button
                    onClick={() => logout()}
                    className="flex items-center space-x-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}
