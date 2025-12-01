'use client';

export default function ProfileHeader({ userData }) {
    if (!userData) return null;

    return (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
                <div className="w-32 h-32 rounded-full bg-green-600 flex items-center justify-center text-white text-5xl font-bold border-4 border-white shadow-lg">
                    {userData.name ? userData.name.charAt(0).toUpperCase() : '?'}
                </div>
            </div>
            <div className="text-center md:text-left flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
                <p className="text-gray-500">
                    Member since {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '...'}
                </p>
                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Active User</span>
                </div>
            </div>
        </div>
    );
}
