import Navbar from '../components/Navbar';
import { FaCalendarCheck, FaUserMd, FaBell } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            MediLink
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Book Doctor Appointments Online - Connect with Healthcare Professionals Seamlessly
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/signup" className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Get Started
            </a>
            <a href="/login" className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Sign In
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <FaUserMd className="text-5xl text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Find Doctors</h3>
            <p className="text-gray-600">Search by specialty, location, and availability</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <FaCalendarCheck className="text-5xl text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Book Appointments</h3>
            <p className="text-gray-600">Schedule appointments 24/7 online with ease</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <FaBell className="text-5xl text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Reminders</h3>
            <p className="text-gray-600">Receive automated email and SMS notifications</p>
          </div>
        </div>
      </main>
    </div>
  );
}
