'use client';
import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaUserMd, FaClock, FaCheckCircle } from 'react-icons/fa';
import AppointmentCard from '@/components/AppointmentCard';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        upcomingAppointments: 0,
        totalDoctors: 0,
        completedAppointments: 0
    });
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [userRole, setUserRole] = useState('patient');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const role = localStorage.getItem('role') || 'patient';
        setUserRole(role);
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role') || 'patient';

            const [appointmentsRes, doctorsRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctors`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            const appointmentsData = await appointmentsRes.json();
            const doctorsData = await doctorsRes.json();

            const appointments = appointmentsData.appointments || [];

            // Calculate stats
            const upcoming = appointments.filter(a => new Date(a.appointmentDate) >= new Date() && a.status !== 'cancelled');
            const completed = appointments.filter(a => a.status === 'completed');

            // For doctors, calculate unique patients count
            let thirdStat = doctorsData.doctors?.length || 0;
            if (role === 'doctor') {
                const uniquePatients = new Set(appointments.map(a => a.patient?.id).filter(Boolean));
                thirdStat = uniquePatients.size;
            }

            setStats({
                upcomingAppointments: upcoming.length,
                completedAppointments: completed.length,
                totalDoctors: thirdStat
            });

            // Show next 3 upcoming appointments
            setUpcomingAppointments(upcoming.slice(0, 3));

        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8">Loading dashboard...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {userRole === 'doctor' ? 'Doctor Dashboard' : 'Patient Dashboard'}
            </h1>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-black rounded-lg shadow p-6 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Upcoming Appointments</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                {stats.upcomingAppointments}
                            </p>
                        </div>
                        <FaCalendarAlt className="text-4xl text-green-600" />
                    </div>
                </div>

                <div className="bg-white dark:bg-black rounded-lg shadow p-6 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Completed</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                {stats.completedAppointments}
                            </p>
                        </div>
                        <FaCheckCircle className="text-4xl text-green-600" />
                    </div>
                </div>

                <div className="bg-white dark:bg-black rounded-lg shadow p-6 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">
                                {userRole === 'doctor' ? 'Total Patients' : 'Available Doctors'}
                            </p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                {stats.totalDoctors}
                            </p>
                        </div>
                        <FaUserMd className="text-4xl text-blue-600" />
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                {userRole === 'patient' ? (
                    <>
                        <a
                            href="/dashboard/doctors"
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow p-6 hover:from-green-600 hover:to-green-700 transition"
                        >
                            <h3 className="text-xl font-semibold mb-2">Find Doctors</h3>
                            <p className="text-green-100">Search and book appointments with healthcare professionals</p>
                        </a>
                        <a
                            href="/dashboard/appointments"
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow p-6 hover:from-blue-600 hover:to-blue-700 transition"
                        >
                            <h3 className="text-xl font-semibold mb-2">My Appointments</h3>
                            <p className="text-blue-100">View and manage your scheduled appointments</p>
                        </a>
                    </>
                ) : (
                    <>
                        <a
                            href="/dashboard/availability"
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow p-6 hover:from-green-600 hover:to-green-700 transition"
                        >
                            <h3 className="text-xl font-semibold mb-2">Manage Availability</h3>
                            <p className="text-green-100">Set your available time slots for appointments</p>
                        </a>
                        <a
                            href="/dashboard/appointments"
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow p-6 hover:from-blue-600 hover:to-blue-700 transition"
                        >
                            <h3 className="text-xl font-semibold mb-2">My Schedule</h3>
                            <p className="text-blue-100">View and manage your appointment schedule</p>
                        </a>
                    </>
                )}
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white dark:bg-black rounded-lg shadow p-6 border border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
                {upcomingAppointments.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
                ) : (
                    <div className="space-y-3">
                        {upcomingAppointments.map(appointment => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                userRole={userRole}
                                simpleView={true}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
