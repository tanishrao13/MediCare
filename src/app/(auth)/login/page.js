"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://medicare-s009.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        alert('Login successful!');
        router.push('/dashboard');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-green-600">MediCare</Link>
      </nav>
      
      <div className="flex items-center justify-center py-16">
        <div className="w-full max-w-sm bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-6 text-center">Login</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-green-500"
              required
            />
            
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-green-500"
              required
            />
            
            <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              Login
            </button>
          </form>
          
          <p className="text-center mt-4 text-sm">
            <Link href="/signup" className="text-green-600 hover:underline">
              Create account
            </Link>
          </p>
          
          <button 
            onClick={() => window.open('https://medicare-s009.onrender.com', '_blank')}
            className="w-full mt-4 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
          >
            Check Server Status
          </button>
        </div>
      </div>
    </div>
  );
}