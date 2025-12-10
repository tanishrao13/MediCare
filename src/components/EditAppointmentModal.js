'use client';
import { useState, useEffect } from 'react';
import { FaTimes, FaCalendarAlt, FaClock, FaUserMd } from 'react-icons/fa';

export default function EditAppointmentModal({ appointment, onClose, onUpdate }) {
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [reason, setReason] = useState(appointment?.reason || '');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (appointment) {
            setReason(appointment.reason || '');
            fetchAvailableSlots();
        }
    }, [appointment]);

    const fetchAvailableSlots = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/slots/doctor/${appointment.doctorId}?available=true`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            const data = await res.json();
            setAvailableSlots(data.slots || []);
        } catch (err) {
            console.error('Error fetching slots:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        setUpdating(true);
        try {
            const token = localStorage.getItem('token');
            const updateData = {
                reason
            };

            // Only include date/time if a new slot was selected
            if (selectedSlot) {
                updateData.appointmentDate = selectedSlot.date;
                updateData.appointmentTime = selectedSlot.startTime;
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${appointment.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updateData)
                }
            );

            const data = await res.json();

            if (res.ok) {
                alert('✅ Appointment updated successfully!');
                onUpdate(); // Refresh the appointments list
                onClose(); // Close the modal
            } else {
                alert(data.message || 'Failed to update appointment');
            }
        } catch (err) {
            console.error('Update error:', err);
            alert('Failed to update appointment');
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
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Appointment</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                    >
                        <FaTimes className="text-xl text-gray-600 dark:text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Current Appointment Info */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Current Appointment</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <FaUserMd className="text-green-600" />
                                <span className="font-medium">Dr. {appointment.doctor.name}</span>
                                <span className="text-sm text-gray-500">({appointment.doctor.specialization})</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <FaCalendarAlt className="text-gray-400" />
                                <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <FaClock className="text-gray-400" />
                                <span>{appointment.appointmentTime}</span>
                            </div>
                        </div>
                    </div>

                    {/* Edit Form */}
                    <form onSubmit={handleUpdate}>
                        {/* Available Slots */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-3">
                                Change Time Slot (Optional)
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                Leave unselected to keep the current time slot
                            </p>
                            {loading ? (
                                <p className="text-gray-500 italic">Loading available slots...</p>
                            ) : availableSlots.length === 0 ? (
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
                                    <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                                        No other available slots found for this doctor.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                                    {availableSlots.map(slot => {
                                        const isCurrent =
                                            new Date(slot.date).toDateString() === new Date(appointment.appointmentDate).toDateString() &&
                                            slot.startTime === appointment.appointmentTime;

                                        return (
                                            <button
                                                key={slot.id}
                                                type="button"
                                                onClick={() => setSelectedSlot(slot)}
                                                disabled={isCurrent}
                                                className={`p-3 rounded-lg border text-sm font-medium transition-all ${isCurrent
                                                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600 cursor-not-allowed'
                                                        : selectedSlot?.id === slot.id
                                                            ? 'bg-green-600 text-white border-green-600 shadow-md'
                                                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-white border-gray-200 dark:border-gray-600 hover:border-green-500'
                                                    }`}
                                            >
                                                <div className="text-xs opacity-75">
                                                    {new Date(slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </div>
                                                <div className="text-base font-bold">{slot.startTime}</div>
                                                {isCurrent && <div className="text-xs mt-1">(Current)</div>}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Reason for Visit */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                                Reason for Visit *
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                                rows="4"
                                placeholder="Briefly describe your symptoms or reason for consultation..."
                                required
                            />
                        </div>

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
                                {updating ? 'Updating...' : 'Update Appointment'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
