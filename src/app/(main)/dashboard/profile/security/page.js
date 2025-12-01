'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdSecurity, MdLock, MdDelete } from 'react-icons/md';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileSidebar from '@/components/ProfileSidebar';
import { useProfile } from '@/hooks/useProfile';

export default function SecurityPage() {
    const router = useRouter();
    const { userData, loading, error: fetchError } = useProfile();
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [saving, setSaving] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (passwords.newPassword !== passwords.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (passwords.newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                credentials: 'include',
                body: JSON.stringify({
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword
                })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Password updated successfully!');
                setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.message || 'Failed to update password');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setError('Failed to update password');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
                method: 'DELETE',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                }
            });

            if (res.ok) {
                localStorage.removeItem('token');
                localStorage.removeItem('userName');
                router.push('/login');
            } else {
                const data = await res.json();
                setError(data.message || 'Failed to delete account');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            setError('Failed to delete account');
        }
    };

    if (loading) {
        return <div className="max-w-4xl mx-auto py-10 text-center text-gray-500">Loading...</div>;
    }

    if (!userData) {
        return <div className="max-w-4xl mx-auto py-10 text-center text-red-500">Failed to load profile</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
                <p className="text-gray-600 dark:text-white mt-1">Manage your account and preferences</p>
            </div>

            <ProfileHeader userData={userData} />

            <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-4">
                    <ProfileSidebar active="security" />
                </div>

                <div className="md:col-span-2 space-y-6">
                    {/* Change Password */}
                    <div className="bg-white dark:bg-black rounded-xl p-6 shadow-sm border border-gray-100 dark:border-white">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                <MdLock className="text-xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Change Password</h3>
                        </div>

                        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
                        {success && <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">{success}</div>}

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Current Password</label>
                                <input
                                    type="password"
                                    value={passwords.currentPassword}
                                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-white rounded-lg focus:ring-green-500 focus:border-green-500 bg-white dark:bg-black text-gray-900 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-white rounded-lg focus:ring-green-500 focus:border-green-500 bg-white dark:bg-black text-gray-900 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-white rounded-lg focus:ring-green-500 focus:border-green-500 bg-white dark:bg-black text-gray-900 dark:text-white"
                                    required
                                />
                            </div>
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    {saving ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Delete Account */}
                    <div className="bg-white dark:bg-black rounded-xl p-6 shadow-sm border border-gray-100 dark:border-white">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                                <MdDelete className="text-xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Delete Account</h3>
                        </div>
                        <p className="text-gray-600 dark:text-white mb-4">
                            Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <button
                            onClick={handleDeleteAccount}
                            className="px-6 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
