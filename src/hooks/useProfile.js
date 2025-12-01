import { useState, useEffect } from 'react';

export function useProfile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        // Mock profile data for demo
        setUserData({
            name: 'John Doe',
            email: 'john@example.com',
            role: 'patient',
            phone: '+1234567890'
        });
        setLoading(false);
    };

    return { userData, loading, error, refetch: fetchProfile };
}
