import { FaCalendarAlt, FaUserMd, FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaEye } from 'react-icons/fa';
import Link from 'next/link';

export default function AppointmentCard({ appointment, userRole, onStatusUpdate, onCancel, simpleView = false }) {
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
        <div className="bg-white dark:bg-black rounded-lg shadow p-6 border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <FaUserMd className="text-green-600 text-xl" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {userRole === 'doctor'
                                ? appointment.patient.name
                                : `Dr. ${appointment.doctor.name}`}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                        </span>
                        {userRole === 'doctor' && !simpleView && (
                            <Link
                                href={`/dashboard/patients/${appointment.patientId}`}
                                className="ml-auto px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 text-sm"
                            >
                                <FaEye /> View Profile
                            </Link>
                        )}
                    </div>
                    <p className="text-gray-600 dark:text-white mb-2">
                        {userRole === 'doctor'
                            ? `Patient ID: ${appointment.patientId}`
                            : appointment.doctor.specialization}
                    </p>
                    <div className="flex items-center gap-4 text-gray-600 dark:text-white">
                        <div className="flex items-center gap-2">
                            <FaCalendarAlt />
                            <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaClock />
                            <span>{appointment.appointmentTime}</span>
                        </div>
                    </div>
                    {appointment.reason && !simpleView && (
                        <p className="mt-2 text-gray-700 dark:text-white">
                            <strong>Reason:</strong> {appointment.reason}
                        </p>
                    )}
                </div>

                {!simpleView && (
                    <div className="flex gap-2">
                        {appointment.status === 'pending' && (
                            <>
                                {userRole === 'doctor' ? (
                                    <>
                                        <button
                                            onClick={() => onStatusUpdate(appointment.id, 'confirmed')}
                                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => onStatusUpdate(appointment.id, 'cancelled')}
                                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            Reject
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => onCancel(appointment.id)}
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
