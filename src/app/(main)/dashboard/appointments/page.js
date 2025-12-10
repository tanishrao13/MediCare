'use client';
import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaUserMd, FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';
import AppointmentCard from '@/components/AppointmentCard';
import EditAppointmentModal from '@/components/EditAppointmentModal';
import AppointmentNotesModal from '@/components/AppointmentNotesModal';
import Pagination from '@/components/Pagination';

export default function AppointmentsPage() {
    const [userRole, setUserRole] = useState('patient');
    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
    const [loading, setLoading] = useState(true);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [notesAppointment, setNotesAppointment] = useState(null);

    useEffect(() => {
        const role = localStorage.getItem('role') || 'patient';
        setUserRole(role);
    }, []);

    useEffect(() => {
        setPage(1); // Reset to page 1 when filter changes
    }, [filter]);

    useEffect(() => {
        fetchAppointments();
    }, [filter, page]);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams();
            if (filter !== 'all') params.append('status', filter);
            params.append('page', page);
            params.append('limit', limit);

            const url = `${process.env.NEXT_PUBLIC_API_URL}/api/appointments?${params.toString()}`;
            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setAppointments(data.appointments || []);
            setPagination(data.pagination || { total: 0, totalPages: 0 });
        } catch (err) {
            console.error('Error fetching appointments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                // Refresh appointments
                fetchAppointments();
            } else {
                alert('Failed to update status');
            }
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    const handleCancel = async (id) => {
        if (!confirm('Are you sure you want to cancel this appointment?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                fetchAppointments();
            } else {
                alert('Failed to cancel appointment');
            }
        } catch (err) {
            console.error('Error cancelling appointment:', err);
        }
    };

    const handleEdit = (appointment) => {
        setEditingAppointment(appointment);
    };

    const handleCloseEdit = () => {
        setEditingAppointment(null);
    };

    const handleUpdateSuccess = () => {
        fetchAppointments(); // Refresh the list
    };

    const handleAddNotes = (appointment) => {
        setNotesAppointment(appointment);
    };

    const handleCloseNotes = () => {
        setNotesAppointment(null);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed': return <FaCheckCircle className="text-green-500" />;
            case 'pending': return <FaHourglassHalf className="text-yellow-500" />;
            case 'cancelled': return <FaTimesCircle className="text-red-500" />;
            case 'completed': return <FaCheckCircle className="text-blue-500" />;
            default: return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {userRole === 'doctor' ? 'My Schedule' : 'My Appointments'}
                </h1>
                {userRole === 'patient' && (
                    <a href="/dashboard/appointments/book" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        Book New Appointment
                    </a>
                )}
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg capitalize ${filter === status
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Results Count */}
            {!loading && (
                <div className="mb-4 text-gray-600 dark:text-gray-400">
                    Showing {appointments.length} of {pagination.total} appointments
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading appointments...</p>
                </div>
            ) : (
                /* Appointments List */
                <div className="space-y-4">
                    {appointments.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-black rounded-lg">
                            <p className="text-gray-500">No appointments found</p>
                        </div>
                    ) : (
                        appointments.map(appointment => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                userRole={userRole}
                                onStatusUpdate={handleStatusUpdate}
                                onCancel={handleCancel}
                                onEdit={handleEdit}
                                onAddNotes={handleAddNotes}
                            />
                        ))
                    )}
                </div>
            )}

            {/* Edit Appointment Modal */}
            {editingAppointment && (
                <EditAppointmentModal
                    appointment={editingAppointment}
                    onClose={handleCloseEdit}
                    onUpdate={handleUpdateSuccess}
                />
            )}

            {/* Appointment Notes Modal */}
            {notesAppointment && (
                <AppointmentNotesModal
                    appointment={notesAppointment}
                    onClose={handleCloseNotes}
                    onUpdate={handleUpdateSuccess}
                />
            )}

            {/* Pagination */}
            {!loading && (
                <Pagination
                    currentPage={page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}
