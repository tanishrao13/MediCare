'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { MdDashboard, MdPerson } from 'react-icons/md';
import { FaCalendarAlt, FaUserMd, FaClock, FaBell } from 'react-icons/fa';

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState('patient');

  useEffect(() => {
    // Get user role from localStorage
    const role = localStorage.getItem('role') || 'patient';
    setUserRole(role);
  }, []);

  // Role-based navigation items
  const getNavItems = () => {
    const commonItems = [
      { name: 'Dashboard', href: '/dashboard', icon: MdDashboard },
    ];

    const patientItems = [
      { name: 'My Appointments', href: '/dashboard/appointments', icon: FaCalendarAlt },
      { name: 'Find Doctors', href: '/dashboard/doctors', icon: FaUserMd },
    ];

    const doctorItems = [
      { name: 'My Schedule', href: '/dashboard/appointments', icon: FaCalendarAlt },
      { name: 'Availability', href: '/dashboard/availability', icon: FaClock },
    ];

    const bottomItems = [
      { name: 'Notifications', href: '/dashboard/notifications', icon: FaBell },
      { name: 'Profile', href: '/dashboard/profile', icon: MdPerson },
    ];

    if (userRole === 'doctor') {
      return [...commonItems, ...doctorItems, ...bottomItems];
    }
    return [...commonItems, ...patientItems, ...bottomItems];
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-screen w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-white transition-transform duration-300 ease-in-out md:translate-x-0 md:fixed md:top-16 md:h-[calc(100vh-4rem)] ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-white md:hidden">
          <span className="text-xl font-bold text-green-600 dark:text-green-400">MediLink</span>
        </div>

        <nav className="p-4 space-y-1 mt-16 md:mt-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-medium'
                  : 'text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
              >
                <Icon className="text-xl" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
