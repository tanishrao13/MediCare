'use client';
import { useState, useEffect } from 'react';
import { FaTimes, FaUserMd, FaCalendarAlt, FaClock, FaNotesMedical, FaCheckCircle } from 'react-icons/fa';

export default function AppointmentNotesModal({ appointment, onClose, onUpdate }) {
    const [notes, setNotes] = useState(appointment?.notes || '');
    const [updating, setUpdating] = useState(false);
    const [markAsCompleted, setMarkAsCompleted] = useState(false);

    useEffect(() => {
        if (appointment) {
            setNotes(appointment.notes || '');
        }
    }, [appointment]);

    const handleSave = async (e) => {
        e.preventDefault();

        setUpdating(true);
        try {
            const token = localStorage.getItem('token');
            const updateData = {
                notes,
                status: markAsCompleted ? 'completed' : appointment.status
            };

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${appointment.id}/status`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updateData)
                }
            );

            const data = await res.json();

            if (res.ok) {
                alert(markAsCompleted ? '✅ Appointment completed successfully!' : '✅ Notes saved successfully!');
                onUpdate(); // Refresh the appointments list
                onClose(); // Close the modal
            } else {
                alert(data.message || 'Failed to save notes');
            }
        } catch (err) {
            console.error('Save notes error:', err);
            alert('Failed to save notes');
        } finally {
            setUpdating(false);
        }
    };

    if (!appointment) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <FaNotesMedical className="text-green-600" />
                        Appointment Notes
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                    >
                        <FaTimes className="text-xl text-gray-600 dark:text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Appointment Info */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Appointment Details</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <FaUserMd className="text-green-600" />
                                <span className="font-medium">{appointment.patient.name}</span>
                                <span className="text-sm text-gray-500">({appointment.patient.email})</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <FaCalendarAlt className="text-gray-400" />
                                <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <FaClock className="text-gray-400" />
                                <span>{appointment.appointmentTime}</span>
                            </div>
                            {appointment.reason && (
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Reason for Visit:</p>
                                    <p className="text-gray-900 dark:text-white mt-1">{appointment.reason}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Notes Form */}
                    <form onSubmit={handleSave}>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                                Doctor's Notes / Prescription *
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                                rows="8"
                                placeholder="Enter diagnosis, prescription, recommendations, or any notes about this appointment..."
                                required
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                Include diagnosis, medications prescribed, follow-up instructions, etc.
                            </p>
                        </div>

                        {/* Mark as Completed Checkbox */}
                        {appointment.status !== 'completed' && (
                            <div className="mb-6">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={markAsCompleted}
                                        onChange={(e) => setMarkAsCompleted(e.target.checked)}
                                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    />
                                    <span className="text-gray-700 dark:text-white font-medium flex items-center gap-2">
                                        <FaCheckCircle className="text-green-600" />
                                        Mark this appointment as completed
                                    </span>
                                </label>
                                <p className="text-xs text-gray-500 dark:text-gray-400 ml-8 mt-1">
                                    This will update the appointment status to completed
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={updating}
                                className={`flex-1 px-4 py-3 rounded-lg font-medium text-white transition ${updating
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                {updating ? 'Saving...' : markAsCompleted ? 'Save & Complete' : 'Save Notes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
