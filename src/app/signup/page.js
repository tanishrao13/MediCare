'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MdPerson, MdEmail, MdPhone, MdLock } from 'react-icons/md';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const router = useRouter();

  const validateForm = () => {
    const errors = {};
    
    if (!name.trim()) {
      errors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      errors.name = 'Name can only contain letters and spaces';
    }
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(phoneNumber.replace(/\s/g, ''))) {
      errors.phoneNumber = 'Phone number must be exactly 10 digits';
    }
    
    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phoneNumber, password, confirmPassword, role }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/login');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">MediLink</h1>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <div className="relative">
                <MdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-900 ${
                    fieldErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                  }`}
                  placeholder="Rahul Sharma"
                  maxLength="50"
                />
              </div>
              {fieldErrors.name && <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-900 ${
                    fieldErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                  }`}
                  placeholder="rahul.sharma@example.com"
                />
              </div>
              {fieldErrors.email && <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <div className="relative">
                <MdPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-900 ${
                    fieldErrors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                  }`}
                  placeholder="9876543210"
                  maxLength="10"
                />
              </div>
              {fieldErrors.phoneNumber && <p className="text-red-500 text-sm mt-1">{fieldErrors.phoneNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                required
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-900 ${
                    fieldErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {fieldErrors.password && <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-900 ${
                    fieldErrors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {fieldErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{fieldErrors.confirmPassword}</p>}
            </div>

            <button type="submit" className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Create Account
            </button>
          </form>

          <p className="text-center mt-4 text-gray-600 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-green-600 hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
