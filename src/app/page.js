import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">MediCare</h1>
          <div className="space-x-4">
            <Link href="/login" className="text-green-600 hover:text-green-700">
              Login
            </Link>
            <Link href="/signup" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
      
    </div>
  );
}
