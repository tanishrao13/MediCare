import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-green-600">
            MediLink
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-700 hover:text-green-600 transition-colors">
              Login
            </Link>
            <Link href="/signup" className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}