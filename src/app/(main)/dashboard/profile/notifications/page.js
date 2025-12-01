'use client';
import { useState } from 'react';
import { MdNotifications, MdEmail, MdSmartphone } from 'react-icons/md';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileSidebar from '@/components/ProfileSidebar';
import { useProfile } from '@/hooks/useProfile';

export default function NotificationsPage() {
    const { userData, loading } = useProfile();
    const [emailSettings, setEmailSettings] = useState({
        news: true,
        account: true,
        marketing: false
    });
    const [pushSettings, setPushSettings] = useState({
        reminders: true,
        goals: true,
        achievements: true
    });

    const toggleEmail = (key) => setEmailSettings(prev => ({ ...prev, [key]: !prev[key] }));
    const togglePush = (key) => setPushSettings(prev => ({ ...prev, [key]: !prev[key] }));

    if (loading) return <div className="max-w-4xl mx-auto py-10 text-center text-gray-500">Loading...</div>;
    if (!userData) return <div className="max-w-4xl mx-auto py-10 text-center text-red-500">Failed to load profile</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                <p className="text-gray-600 mt-1">Manage your account and preferences</p>
            </div>

            <ProfileHeader userData={userData} />

            <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-4">
                    <ProfileSidebar active="notifications" />
                </div>

                <div className="md:col-span-2 space-y-6">
                    {/* Email Notifications */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <MdEmail className="text-xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Email Notifications</h3>
                        </div>

                        <div className="space-y-4">
                            {[
                                { id: 'news', label: 'News & Updates', desc: 'Stay up to date with the latest features' },
                                { id: 'account', label: 'Account Activity', desc: 'Get notified about sign-ins and changes' },
                                { id: 'marketing', label: 'Marketing', desc: 'Receive special offers and promotions' }
                            ].map((item) => (
                                <div key={item.id} className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="font-medium text-gray-900">{item.label}</p>
                                        <p className="text-sm text-gray-500">{item.desc}</p>
                                    </div>
                                    <button
                                        onClick={() => toggleEmail(item.id)}
                                        className={`w-12 h-6 rounded-full transition-colors relative ${emailSettings[item.id] ? 'bg-green-600' : 'bg-gray-200'}`}
                                    >
                                        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${emailSettings[item.id] ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Push Notifications */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                <MdSmartphone className="text-xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Push Notifications</h3>
                        </div>

                        <div className="space-y-4">
                            {[
                                { id: 'reminders', label: 'Reminders', desc: 'Get reminded to log your activities' },
                                { id: 'goals', label: 'Goal Progress', desc: 'Updates on your daily and weekly goals' },
                                { id: 'achievements', label: 'Achievements', desc: 'Celebrate your milestones' }
                            ].map((item) => (
                                <div key={item.id} className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="font-medium text-gray-900">{item.label}</p>
                                        <p className="text-sm text-gray-500">{item.desc}</p>
                                    </div>
                                    <button
                                        onClick={() => togglePush(item.id)}
                                        className={`w-12 h-6 rounded-full transition-colors relative ${pushSettings[item.id] ? 'bg-green-600' : 'bg-gray-200'}`}
                                    >
                                        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${pushSettings[item.id] ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
