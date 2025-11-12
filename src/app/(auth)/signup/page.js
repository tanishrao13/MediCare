"use client";

import Link from "next/link";
import { useState } from "react";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-green-600">MediCare</Link>
      </nav>
      
      <div className="flex items-center justify-center py-16">
        <div className="w-full max-w-sm bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-6 text-center">Sign Up</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-green-500"
              required
            />
            
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-green-500"
              required
            />
            
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-green-500"
              required
            />
            
            <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              Sign Up
            </button>
          </form>
          
          <p className="text-center mt-4 text-sm">
            <Link href="/login" className="text-green-600 hover:underline">
              Already have an account?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}