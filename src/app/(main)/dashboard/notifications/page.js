'use client';
import { useState, useEffect } from 'react';
import { FaBell, FaEnvelope, FaMobileAlt, FaInfoCircle } from 'react-icons/fa';
import Pagination from '@/components/Pagination';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, [page]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams();
            params.append('page', page);
            params.append('limit', limit);

            const url = `${process.env.NEXT_PUBLIC_API_URL}/api/notifications?${params.toString()}`;
            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setNotifications(data.notifications || []);
            setPagination(data.pagination || { total: 0, totalPages: 0 });
        } catch (err) {
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getIcon = (type) => {
        switch (type) {
            case 'email': return <FaEnvelope className="text-blue-500" />;
            case 'sms': return <FaMobileAlt className="text-green-500" />;
            default: return <FaInfoCircle className="text-green-500" />;
        }
    };

    if (loading && notifications.length === 0) return <div className="p-8">Loading notifications...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <FaBell className="text-green-600" />
                    Notifications
                </h1>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {pagination.total} Total
                </span>
            </div>

            {/* Results Count */}
            {!loading && (
                <div className="mb-4 text-gray-600 dark:text-gray-400">
                    Showing {notifications.length} of {pagination.total} notifications
                </div>
            )}

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-black rounded-xl shadow-sm">
                        <FaBell className="text-4xl text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No new notifications</p>
                    </div>
                ) : (
                    notifications.map(notification => (
                        <div key={notification.id} className="bg-white dark:bg-black p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-green-500">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 text-xl bg-gray-50 p-2 rounded-full">
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                                        {notification.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-white mb-2">
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}
