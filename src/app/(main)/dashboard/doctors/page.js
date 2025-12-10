'use client';
import { useState, useEffect } from 'react';
import { FaUserMd, FaStar, FaMapMarkerAlt, FaMoneyBillWave, FaSearch } from 'react-icons/fa';
import Pagination from '@/components/Pagination';

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [sortBy, setSortBy] = useState('rating');
    const [page, setPage] = useState(1);
    const [limit] = useState(9);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setPage(1); // Reset to page 1 when filters change
    }, [search, specialization, sortBy]);

    useEffect(() => {
        fetchDoctors();
    }, [search, specialization, sortBy, page]);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('query', search);
            if (specialization) params.append('specialization', specialization);
            if (sortBy) params.append('sortBy', sortBy);
            params.append('page', page);
            params.append('limit', limit);

            const url = `${process.env.NEXT_PUBLIC_API_URL}/api/doctors/search?${params.toString()}`;
            const res = await fetch(url);
            const data = await res.json();
            setDoctors(data.doctors || []);
            setPagination(data.pagination || { total: 0, totalPages: 0 });
        } catch (err) {
            console.error('Error fetching doctors:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Find Doctors</h1>

            {/* Search and Filters */}
            <div className="bg-white dark:bg-black rounded-lg shadow p-6 mb-6">
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or specialty..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <select
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                        <option value="">All Specializations</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Dermatology">Dermatology</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Orthopedics">Orthopedics</option>
                        <option value="Neurology">Neurology</option>
                        <option value="General Medicine">General Medicine</option>
                    </select>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                        <option value="rating">Highest Rating</option>
                        <option value="fee_low">Lowest Fee</option>
                        <option value="fee_high">Highest Fee</option>
                        <option value="experience">Most Experience</option>
                    </select>
                </div>
            </div>

            {/* Results Count */}
            {!loading && (
                <div className="mb-4 text-gray-600 dark:text-gray-400">
                    Showing {doctors.length} of {pagination.total} doctors
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading doctors...</p>
                </div>
            ) : (
                /* Doctors Grid */
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-white dark:bg-black rounded-lg">
                            <p className="text-gray-500">No doctors found</p>
                        </div>
                    ) : (
                        doctors.map(doctor => (
                            <div key={doctor.id} className="bg-white dark:bg-black rounded-lg shadow hover:shadow-lg transition p-6">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                        <FaUserMd className="text-3xl text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Dr. {doctor.name}
                                        </h3>
                                        <p className="text-green-600">{doctor.specialization}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <FaStar className="text-yellow-400" />
                                            <span className="text-gray-600">{doctor.rating || 0}/5</span>
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
                                    <p className="text-gray-500">
                                        {doctor.experience} years experience
                                    </p>
                                </div>

                                {doctor.bio && (
                                    <p className="text-gray-600 dark:text-white text-sm mb-4 line-clamp-2">
                                        {doctor.bio}
                                    </p>
                                )}

                                <a
                                    href={`/dashboard/doctors/${doctor.id}`}
                                    className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                >
                                    View Profile & Book
                                </a>
                            </div>
                        ))
                    )}
                </div>
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
