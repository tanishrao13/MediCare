'use client';
import { useState } from 'react';
import { MdColorLens, MdDarkMode, MdLightMode, MdSettingsSystemDaydream } from 'react-icons/md';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileSidebar from '@/components/ProfileSidebar';
import { useProfile } from '@/hooks/useProfile';
import { useTheme } from '@/context/ThemeContext';

export default function AppearancePage() {
    const { userData, loading } = useProfile();
    const { theme, setTheme } = useTheme();
    const [compactMode, setCompactMode] = useState(false);

    if (loading) return <div className="max-w-4xl mx-auto py-10 text-center text-gray-500">Loading...</div>;
    if (!userData) return <div className="max-w-4xl mx-auto py-10 text-center text-red-500">Failed to load profile</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
                <p className="text-gray-600 dark:text-white mt-1">Manage your account and preferences</p>
            </div>

            <ProfileHeader userData={userData} />

            <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-4">
                    <ProfileSidebar active="appearance" />
                </div>

                <div className="md:col-span-2 space-y-6">
                    {/* Theme Settings */}
                    <div className="bg-white dark:bg-black rounded-xl p-6 shadow-sm border border-gray-100 dark:border-white">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                <MdColorLens className="text-xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Theme Preferences</h3>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <button
                                onClick={() => setTheme('light')}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${theme === 'light' ? 'border-green-600 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-white hover:border-gray-300 dark:hover:border-gray-600'}`}
                            >
                                <MdLightMode className={`text-2xl ${theme === 'light' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-white'}`} />
                                <span className={`font-medium ${theme === 'light' ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-white'}`}>Light</span>
                            </button>
                            <button
                                onClick={() => setTheme('dark')}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${theme === 'dark' ? 'border-green-600 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-white hover:border-gray-300 dark:hover:border-gray-600'}`}
                            >
                                <MdDarkMode className={`text-2xl ${theme === 'dark' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-white'}`} />
                                <span className={`font-medium ${theme === 'dark' ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-white'}`}>Dark</span>
                            </button>
                            <button
                                onClick={() => setTheme('system')}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${theme === 'system' ? 'border-green-600 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-white hover:border-gray-300 dark:hover:border-gray-600'}`}
                            >
                                <MdSettingsSystemDaydream className={`text-2xl ${theme === 'system' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-white'}`} />
                                <span className={`font-medium ${theme === 'system' ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-white'}`}>System</span>
                            </button>
                        </div>
                    </div>

                    {/* Interface Settings */}
                    <div className="bg-white dark:bg-black rounded-xl p-6 shadow-sm border border-gray-100 dark:border-white">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Interface Settings</h3>
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Compact Mode</p>
                                <p className="text-sm text-gray-500 dark:text-white">Reduce whitespace and increase information density</p>
                            </div>
                            <button
                                onClick={() => setCompactMode(!compactMode)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${compactMode ? 'bg-green-600' : 'bg-gray-200 dark:bg-black'}`}
                            >
                                <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${compactMode ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
