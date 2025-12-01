'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';

export default function PatientProfilePage() {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPatientDetails();
        fetchPatientAppointments();
    }, [id]);

    const fetchPatientDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setPatient(data);
        } catch (err) {
            console.error('Error fetching patient details:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPatientAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const doctorId = localStorage.getItem('userId');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments?patientId=${id}&doctorId=${doctorId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setAppointments(data.appointments || []);
        } catch (err) {
            console.error('Error fetching appointments:', err);
        }
    };

    if (loading) {
        return <div className="p-8">Loading patient profile...</div>;
    }

    if (!patient) {
        return <div className="p-8">Patient not found</div>;
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Patient Profile</h1>

            {/* Patient Information Card */}
            <div className="bg-white dark:bg-black rounded-xl shadow-lg p-8 mb-6 border border-gray-100 dark:border-gray-800">
                <div className="flex items-start gap-6">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaUser className="text-4xl text-green-600" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{patient.name}</h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 text-gray-600 dark:text-white">
                                <FaEnvelope className="text-gray-400" />
                                <span>{patient.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 dark:text-white">
                                <FaPhone className="text-gray-400" />
                                <span>{patient.phoneNumber}</span>
                            </div>
                            {patient.dateOfBirth && (
                                <div className="flex items-center gap-3 text-gray-600 dark:text-white">
                                    <FaCalendar className="text-gray-400" />
                                    <span>DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}</span>
                                </div>
                            )}
                            {patient.address && (
                                <div className="flex items-center gap-3 text-gray-600 dark:text-white">
                                    <FaMapMarkerAlt className="text-gray-400" />
                                    <span>{patient.address}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Appointment History */}
            <div className="bg-white dark:bg-black rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Appointment History</h3>

                {appointments.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No appointments found</p>
                ) : (
                    <div className="space-y-3">
                        {appointments.map(appointment => (
                            <div key={appointment.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                                        </p>
                                        {appointment.reason && (
                                            <p className="text-sm text-gray-600 dark:text-white mt-1">
                                                <strong>Reason:</strong> {appointment.reason}
                                            </p>
                                        )}
                                        {appointment.notes && (
                                            <p className="text-sm text-gray-600 dark:text-white mt-1">
                                                <strong>Notes:</strong> {appointment.notes}
                                            </p>
                                        )}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                            appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                        }`}>
                                        {appointment.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
