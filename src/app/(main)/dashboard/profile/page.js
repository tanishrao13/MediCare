'use client';
import { useState, useEffect } from 'react';
import { MdPerson, MdEmail, MdPhone, MdEdit, MdSave } from 'react-icons/md';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileSidebar from '@/components/ProfileSidebar';
import { useProfile } from '@/hooks/useProfile';

export default function ProfilePage() {
    const { userData, loading, error: fetchError, refetch } = useProfile();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (userData) {
            setFormData({
                name: userData.name || '',
                phoneNumber: userData.phoneNumber || '',
                specialization: userData.specialization || '',
                qualification: userData.qualification || '',
                experience: userData.experience || '',
                consultationFee: userData.consultationFee || '',
                bio: userData.bio || ''
            });
        }
        if (fetchError) {
            setError(fetchError);
        }
    }, [userData, fetchError]);

    const handleSave = async () => {
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
                method: 'PUT',
                headers,
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const data = await res.json();
                refetch(); // Refresh profile data
                setIsEditing(false);
                setSuccess('Profile updated successfully!');
                localStorage.setItem('userName', data.name);
                setTimeout(() => setSuccess(''), 3000);
            } else {
                const data = await res.json();
                setError(data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Failed to update profile');
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center py-10 text-gray-500">Loading profile...</div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center py-10 text-red-500">Failed to load profile</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                <p className="text-gray-600 mt-1">Manage your account and preferences</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                    {success}
                </div>
            )}

            {/* Profile Header */}
            <ProfileHeader userData={userData} />

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column - Navigation */}
                <div className="space-y-4">
                    <ProfileSidebar active="personal" />
                </div>

                {/* Right Column - Content */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                            <button
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isEditing ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {isEditing ? <><MdSave /> Save Changes</> : <><MdEdit /> Edit</>}
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <div className="relative">
                                        <MdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            disabled={!isEditing}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <div className="relative">
                                        <MdPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                                        <input
                                            type="tel"
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                            disabled={!isEditing}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                                    <input
                                        type="email"
                                        value={userData.email}
                                        disabled={true}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {userData.role === 'doctor' ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                                            <input
                                                type="text"
                                                value={formData.specialization || ''}
                                                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                                disabled={!isEditing}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500"
                                                placeholder="e.g. Cardiology"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
                                            <input
                                                type="text"
                                                value={formData.qualification || ''}
                                                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                                                disabled={!isEditing}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500"
                                                placeholder="e.g. MBBS, MD"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                                            <input
                                                type="number"
                                                value={formData.experience || ''}
                                                onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) })}
                                                disabled={!isEditing}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee (₹)</label>
                                            <input
                                                type="number"
                                                value={formData.consultationFee || ''}
                                                onChange={(e) => setFormData({ ...formData, consultationFee: parseInt(e.target.value) })}
                                                disabled={!isEditing}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                            <textarea
                                                value={formData.bio || ''}
                                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                disabled={!isEditing}
                                                rows="3"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500"
                                                placeholder="Tell patients about yourself..."
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                            <select
                                                disabled={!isEditing}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500"
                                            >
                                                <option>Male</option>
                                                <option>Female</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                            <input
                                                type="date"
                                                disabled={!isEditing}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}
