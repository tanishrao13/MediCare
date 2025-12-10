'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserMd, FaStar, FaMapMarkerAlt, FaMoneyBillWave, FaSearch, FaClock, FaCalendarCheck, FaArrowLeft } from 'react-icons/fa';

export default function BookAppointmentPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Select Doctor, 2: Select Slot & Details

    // Doctor selection state
    const [doctors, setDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [loading, setLoading] = useState(true);

    // Booking state
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [reason, setReason] = useState('');
    const [duration, setDuration] = useState(30);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [slotsLoading, setSlotsLoading] = useState(false);

    useEffect(() => {
        fetchDoctors();
    }, [searchQuery, specialization]);

    const fetchDoctors = async () => {
        try {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/api/doctors?`;
            if (searchQuery) url += `search=${searchQuery}&`;
            if (specialization) url += `specialization=${specialization}`;

            const res = await fetch(url);
            const data = await res.json();
            setDoctors(data.doctors || []);
        } catch (err) {
            console.error('Error fetching doctors:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectDoctor = async (doctor) => {
        setSelectedDoctor(doctor);
        setSlotsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/slots/doctor/${doctor.id}?available=true`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setAvailableSlots(data.slots || []);
            setStep(2);
        } catch (err) {
            console.error('Error fetching slots:', err);
            alert('Failed to fetch available slots');
        } finally {
            setSlotsLoading(false);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();

        if (!selectedSlot) {
            alert('Please select a time slot');
            return;
        }

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
                    doctorId: selectedDoctor.id,
                    appointmentDate: selectedSlot.date,
                    appointmentTime: selectedSlot.startTime,
                    duration: parseInt(duration),
                    reason
                })
            });

            const data = await res.json();

            if (res.ok) {
                alert('✅ Appointment booked successfully!');
                router.push('/dashboard/appointments');
            } else {
                alert(data.message || 'Booking failed');
            }
        } catch (err) {
            console.error('Booking error:', err);
            alert('Failed to book appointment');
        } finally {
            setBookingLoading(false);
        }
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
            setSelectedDoctor(null);
            setSelectedSlot(null);
            setAvailableSlots([]);
        } else {
            router.push('/dashboard/appointments');
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={handleBack}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                >
                    <FaArrowLeft className="text-xl text-gray-600 dark:text-white" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Book Appointment</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {step === 1 ? 'Step 1: Select a Doctor' : 'Step 2: Choose Time & Details'}
                    </p>
                </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center gap-4 mb-8">
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                        1
                    </div>
                    <span className="font-medium">Select Doctor</span>
                </div>
                <div className="flex-1 h-1 bg-gray-200">
                    <div className={`h-full ${step >= 2 ? 'bg-green-600' : 'bg-gray-200'} transition-all`} style={{ width: step >= 2 ? '100%' : '0%' }}></div>
                </div>
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                        2
                    </div>
                    <span className="font-medium">Book Slot</span>
                </div>
            </div>

            {/* Step 1: Doctor Selection */}
            {step === 1 && (
                <div>
                    {/* Search and Filters */}
                    <div className="bg-white dark:bg-black rounded-lg shadow p-6 mb-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or specialty..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-black dark:border-white dark:text-white"
                                />
                            </div>
                            <select
                                value={specialization}
                                onChange={(e) => setSpecialization(e.target.value)}
                                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-black dark:border-white dark:text-white"
                            >
                                <option value="">All Specializations</option>
                                <option value="Cardiology">Cardiology</option>
                                <option value="Dermatology">Dermatology</option>
                                <option value="Pediatrics">Pediatrics</option>
                                <option value="Orthopedics">Orthopedics</option>
                                <option value="Neurology">Neurology</option>
                                <option value="General Medicine">General Medicine</option>
                            </select>
                        </div>
                    </div>

                    {/* Doctors Grid */}
                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Loading doctors...</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {doctors.length === 0 ? (
                                <div className="col-span-full text-center py-12 bg-white dark:bg-black rounded-lg">
                                    <p className="text-gray-500">No doctors found</p>
                                </div>
                            ) : (
                                doctors.map(doctor => (
                                    <div key={doctor.id} className="bg-white dark:bg-black rounded-lg shadow hover:shadow-lg transition p-6 border border-gray-100 dark:border-gray-800">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <FaUserMd className="text-3xl text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                    Dr. {doctor.name}
                                                </h3>
                                                <p className="text-green-600">{doctor.specialization}</p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <FaStar className="text-yellow-400" />
                                                    <span className="text-gray-600 dark:text-white text-sm">{doctor.rating || 0}/5</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-white">
                                            <div className="flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-gray-400" />
                                                <span>{doctor.location || 'Location not specified'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaMoneyBillWave className="text-gray-400" />
                                                <span>₹{doctor.consultationFee || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaClock className="text-gray-400" />
                                                <span>{doctor.experience} years experience</span>
                                            </div>
                                        </div>

                                        {doctor.bio && (
                                            <p className="text-gray-600 dark:text-white text-sm mb-4 line-clamp-2">
                                                {doctor.bio}
                                            </p>
                                        )}

                                        <button
                                            onClick={() => handleSelectDoctor(doctor)}
                                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                                        >
                                            Select Doctor
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Step 2: Slot Selection & Booking Details */}
            {step === 2 && selectedDoctor && (
                <div className="max-w-3xl mx-auto">
                    {/* Selected Doctor Info */}
                    <div className="bg-white dark:bg-black rounded-lg shadow p-6 mb-6">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Selected Doctor</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <FaUserMd className="text-2xl text-green-600" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Dr. {selectedDoctor.name}</h4>
                                <p className="text-green-600">{selectedDoctor.specialization}</p>
                            </div>
                            <div className="ml-auto text-right">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Consultation Fee</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">₹{selectedDoctor.consultationFee}</p>
                            </div>
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div className="bg-white dark:bg-black rounded-lg shadow p-6">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <FaCalendarCheck className="text-green-600" />
                            Complete Booking
                        </h2>

                        <form onSubmit={handleBooking}>
                            {/* Available Slots */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-3">
                                    Select Available Time Slot *
                                </label>
                                {slotsLoading ? (
                                    <p className="text-gray-500 italic">Loading available slots...</p>
                                ) : availableSlots.length === 0 ? (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <p className="text-yellow-800">No available slots found for this doctor.</p>
                                        <p className="text-sm text-yellow-600 mt-1">Please try selecting a different doctor or check back later.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
                                        {availableSlots.map(slot => (
                                            <button
                                                key={slot.id}
                                                type="button"
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`p-3 rounded-lg border text-sm font-medium transition-all ${selectedSlot?.id === slot.id
                                                        ? 'bg-green-600 text-white border-green-600 shadow-md'
                                                        : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-white border-gray-200 dark:border-gray-700 hover:border-green-500'
                                                    }`}
                                            >
                                                <div className="text-xs opacity-75">
                                                    {new Date(slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </div>
                                                <div className="text-base font-bold">{slot.startTime}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Duration */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                                    Duration (minutes) *
                                </label>
                                <select
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-black dark:border-white dark:text-white"
                                    required
                                >
                                    <option value="15">15 minutes</option>
                                    <option value="30">30 minutes</option>
                                    <option value="45">45 minutes</option>
                                    <option value="60">60 minutes</option>
                                </select>
                            </div>

                            {/* Reason for Visit */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                                    Reason for Visit *
                                </label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-black dark:border-white dark:text-white"
                                    rows="4"
                                    placeholder="Briefly describe your symptoms or reason for consultation..."
                                    required
                                />
                            </div>

                            {/* Submit Button */}
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
            )}
        </div>
    );
}
