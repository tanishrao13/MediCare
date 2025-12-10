'use client';
import { useState, useEffect } from 'react';
import { FaUser, FaSearch, FaCalendarAlt, FaEye } from 'react-icons/fa';
import Link from 'next/link';

export default function PatientsListPage() {
    const [patients, setPatients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalPatients: 0,
        appointmentsThisMonth: 0,
        activePatients: 0
    });

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            // Fetch all appointments for this doctor
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            const appointments = data.appointments || [];

            // Extract unique patients with their stats
            const patientMap = new Map();
            const now = new Date();
            const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

            appointments.forEach(appointment => {
                const patientId = appointment.patient.id;

                if (!patientMap.has(patientId)) {
                    patientMap.set(patientId, {
                        ...appointment.patient,
                        totalAppointments: 0,
                        lastVisit: null,
                        appointmentsThisMonth: 0
                    });
                }

                const patient = patientMap.get(patientId);
                patient.totalAppointments++;

                // Track last visit
                const appointmentDate = new Date(appointment.appointmentDate);
                if (!patient.lastVisit || appointmentDate > new Date(patient.lastVisit)) {
                    patient.lastVisit = appointment.appointmentDate;
                }

                // Count this month's appointments
                if (appointmentDate >= thisMonthStart) {
                    patient.appointmentsThisMonth++;
                }
            });

            const patientsList = Array.from(patientMap.values());
            setPatients(patientsList);

            // Calculate stats
            const appointmentsThisMonth = appointments.filter(
                a => new Date(a.appointmentDate) >= thisMonthStart
            ).length;

            const activePatients = patientsList.filter(
                p => p.appointmentsThisMonth > 0
            ).length;

            setStats({
                totalPatients: patientsList.length,
                appointmentsThisMonth,
                activePatients
            });

        } catch (err) {
            console.error('Error fetching patients:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <div className="p-8">Loading patients...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">My Patients</h1>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-black rounded-lg shadow p-6 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Patients</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                {stats.totalPatients}
                            </p>
                        </div>
                        <FaUser className="text-4xl text-green-600" />
                    </div>
                </div>

                <div className="bg-white dark:bg-black rounded-lg shadow p-6 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Active This Month</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                {stats.activePatients}
                            </p>
                        </div>
                        <FaUser className="text-4xl text-blue-600" />
                    </div>
                </div>

                <div className="bg-white dark:bg-black rounded-lg shadow p-6 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Appointments This Month</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                {stats.appointmentsThisMonth}
                            </p>
                        </div>
                        <FaCalendarAlt className="text-4xl text-purple-600" />
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white dark:bg-black rounded-lg shadow p-6 mb-6">
                <div className="relative">
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-black dark:border-white dark:text-white"
                    />
                </div>
            </div>

            {/* Patients List */}
            <div className="bg-white dark:bg-black rounded-lg shadow">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Patient
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Last Visit
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Total Visits
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        {searchQuery ? 'No patients found matching your search' : 'No patients yet'}
                                    </td>
                                </tr>
                            ) : (
                                filteredPatients.map(patient => (
                                    <tr key={patient.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                    <FaUser className="text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{patient.name}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">ID: {patient.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-900 dark:text-white">{patient.email}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{patient.phoneNumber}</p>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 dark:text-white">
                                            {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                {patient.totalAppointments} visits
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/dashboard/patients/${patient.id}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                                            >
                                                <FaEye /> View Profile
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
