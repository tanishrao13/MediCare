'use client';
import { useState, useEffect } from 'react';
import { FaCalendarPlus, FaClock, FaTrash, FaEdit } from 'react-icons/fa';
import EditSlotModal from '@/components/EditSlotModal';

export default function AvailabilityPage() {
    const [slots, setSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [loading, setLoading] = useState(true);
    const [editingSlot, setEditingSlot] = useState(null);

    useEffect(() => {
        fetchSlots();
    }, []);

    const fetchSlots = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/slots/doctor/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setSlots(data.slots || []);
        } catch (err) {
            console.error('Error fetching slots:', err);
        } finally {
            setLoading(false);
        }
    };

    const createSlot = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/slots`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    date: selectedDate,
                    slots: [{ startTime, endTime }]
                })
            });

            if (res.ok) {
                alert('Slot created successfully!');
                fetchSlots();
                setSelectedDate('');
                setStartTime('');
                setEndTime('');
            }
        } catch (err) {
            console.error('Error creating slot:', err);
            alert('Failed to create slot');
        }
    };

    const deleteSlot = async (slotId) => {
        if (!confirm('Are you sure you want to delete this slot?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/slots/${slotId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                alert('Slot deleted successfully!');
                fetchSlots();
            }
        } catch (err) {
            console.error('Error deleting slot:', err);
        }
    };

    const handleEdit = (slot) => {
        setEditingSlot(slot);
    };

    const handleCloseEdit = () => {
        setEditingSlot(null);
    };

    const handleUpdateSuccess = () => {
        fetchSlots();
    };

    if (loading) {
        return <div className="p-8">Loading availability...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Manage Availability</h1>

            {/* Create Slot Form */}
            <div className="bg-white dark:bg-black rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-2">Create Time Slots</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Create multiple 30-minute slots automatically by selecting a time range
                </p>
                <form onSubmit={createBulkSlots} className="grid md:grid-cols-4 gap-4">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-black dark:border-white dark:text-white"
                    />
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        placeholder="Start Time"
                        required
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-black dark:border-white dark:text-white"
                    />
                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        placeholder="End Time"
                        required
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-black dark:border-white dark:text-white"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 font-medium"
                    >
                        <FaCalendarPlus /> Create Slots
                    </button>
                </form>
            </div>

            {/* Slots List */}
            <div className="bg-white dark:bg-black rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Your Availability Slots</h2>
                <div className="space-y-3">
                    {slots.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No slots created yet</p>
                    ) : (
                        slots.map(slot => (
                            <div key={slot.id} className="flex justify-between items-center p-4 border rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="text-gray-700 dark:text-white">
                                        <strong>{new Date(slot.date).toLocaleDateString()}</strong>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FaClock />
                                        <span>{slot.startTime} - {slot.endTime}</span>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm ${slot.isAvailable
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {slot.isAvailable ? 'Available' : 'Booked'}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    {slot.isAvailable && (
                                        <button
                                            onClick={() => handleEdit(slot)}
                                            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            title="Edit Slot"
                                        >
                                            <FaEdit />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteSlot(slot.id)}
                                        className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                        title="Delete Slot"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Edit Slot Modal */}
            {editingSlot && (
                <EditSlotModal
                    slot={editingSlot}
                    onClose={handleCloseEdit}
                    onUpdate={handleUpdateSuccess}
                />
            )}
        </div>
    );
}
