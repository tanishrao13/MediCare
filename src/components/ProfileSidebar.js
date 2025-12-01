'use client';
import Link from 'next/link';
import { MdPerson, MdNotifications, MdColorLens, MdSecurity } from 'react-icons/md';

export default function ProfileSidebar({ active }) {
    const navItems = [
        { name: 'Personal Info', href: '/dashboard/profile', icon: MdPerson, id: 'personal' },
        { name: 'Notifications', href: '/dashboard/profile/notifications', icon: MdNotifications, id: 'notifications' },
        { name: 'Appearance', href: '/dashboard/profile/appearance', icon: MdColorLens, id: 'appearance' },
        { name: 'Security', href: '/dashboard/profile/security', icon: MdSecurity, id: 'security' },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <nav className="flex flex-col">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = active === item.id;
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`flex items-center gap-3 px-6 py-4 transition-colors ${isActive
                                    ? 'bg-green-50 text-green-700 font-medium border-l-4 border-green-600'
                                    : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                                }`}
                        >
                            <Icon className="text-xl" /> {item.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
