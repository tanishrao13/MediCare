'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaUserMd, FaStar, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaCalendarCheck } from 'react-icons/fa';

export default function DoctorDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [doctor, setDoctor] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        fetchDoctorDetails();
        fetchAvailability();
    }, [id]);

    const fetchDoctorDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctors/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setDoctor(data.doctor);
        } catch (err) {
            console.error('Error fetching doctor details:', err);
        }
    };

    const fetchAvailability = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/slots/doctor/${id}?available=true`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setAvailableSlots(data.slots || []);
        } catch (err) {
            console.error('Error fetching slots:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!selectedSlot) return;

        setBookingLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    doctorId: id,
                    appointmentDate: selectedSlot.date,
                    appointmentTime: selectedSlot.startTime,
                    duration: 30, // Default duration
                    reason
                })
            });

            if (res.ok) {
                alert('Appointment booked successfully!');
                router.push('/dashboard/appointments');
            } else {
                const data = await res.json();
                alert(data.message || 'Booking failed');
            }
        } catch (err) {
            console.error('Booking error:', err);
            alert('Failed to book appointment');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <div className="p-8">Loading doctor details...</div>;
    if (!doctor) return <div className="p-8">Doctor not found</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Doctor Profile Header */}
            <div className="bg-white dark:bg-black rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="p-8 flex flex-col md:flex-row gap-8">
                    <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
                        <FaUserMd className="text-5xl text-green-600" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dr. {doctor.name}</h1>
                        <p className="text-xl text-green-600 font-medium mb-4">{doctor.specialization}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-white">
                            <div className="flex items-center gap-2 justify-center md:justify-start">
                                <FaStar className="text-yellow-400" />
                                <span>{doctor.rating || 0}/5 Rating</span>
                            </div>
                            <div className="flex items-center gap-2 justify-center md:justify-start">
                                <FaClock />
                                <span>{doctor.experience} Years Exp.</span>
                            </div>
                            <div className="flex items-center gap-2 justify-center md:justify-start">
                                <FaMapMarkerAlt />
                                <span>{doctor.location || 'Online'}</span>
                            </div>
                            <div className="flex items-center gap-2 justify-center md:justify-start">
                                <FaMoneyBillWave />
                                <span>₹{doctor.consultationFee}</span>
                            </div>
                        </div>

                        {doctor.bio && (
                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white">
                                <h3 className="text-lg font-semibold mb-2">About</h3>
                                <p className="text-gray-600 dark:text-white">{doctor.bio}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Booking Section */}
            <div className="bg-white dark:bg-black rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <FaCalendarCheck className="text-green-600" />
                    Book Appointment
                </h2>

                <form onSubmit={handleBooking}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                            Select Available Slot
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {availableSlots.length === 0 ? (
                                <p className="col-span-full text-gray-500 italic">No available slots found.</p>
                            ) : (
                                availableSlots.map(slot => (
                                    <button
                                        key={slot.id}
                                        type="button"
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${selectedSlot?.id === slot.id
                                                ? 'bg-green-600 text-white border-green-600 shadow-md'
                                                : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-green-500'
                                            }`}
                                    >
                                        <div className="text-xs opacity-75">{new Date(slot.date).toLocaleDateString()}</div>
                                        <div className="text-lg">{slot.startTime}</div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                            Reason for Visit
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-black dark:border-white"
                            rows="3"
                            placeholder="Briefly describe your symptoms or reason for consultation..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!selectedSlot || bookingLoading}
                        className={`w-full py-4 rounded-lg font-bold text-lg text-white transition-all ${!selectedSlot || bookingLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl'
                            }`}
                    >
                        {bookingLoading ? 'Confirming Booking...' : 'Confirm Appointment'}
                    </button>
                </form>
            </div>
        </div>
    );
}
