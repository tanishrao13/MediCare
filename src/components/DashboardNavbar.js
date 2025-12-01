'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdMenu } from 'react-icons/md';
import Link from 'next/link';

export default function DashboardNavbar({ onMenuClick }) {
  const [userName, setUserName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (name) setUserName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    router.push('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-black border-b border-gray-200 dark:border-white z-40 transition-colors duration-300">
      <div className="px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <MdMenu className="text-2xl" />
            </button>
            <Link href="/dashboard" className="text-xl font-bold text-green-600 dark:text-green-400 md:ml-0">
              MediLink
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 dark:text-white">{userName}</span>
            <button onClick={handleLogout} className="text-gray-700 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
