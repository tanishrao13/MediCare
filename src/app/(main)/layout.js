'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '@/components/DashboardNavbar';
import Sidebar from '@/components/Sidebar';
import HealthChatbot from '@/components/HealthChatbot';

export default function MainLayout({ children }) {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
            <DashboardNavbar onMenuClick={() => setIsMobileMenuOpen(true)} />
            <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
            <main className={`md:ml-64 pt-24 p-8 transition-all duration-300 ${isMobileMenuOpen ? 'blur-sm md:blur-none' : ''}`}>
                {children}
            </main>
            <HealthChatbot />
        </div>
    );
}
