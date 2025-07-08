import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center py-12">
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight drop-shadow-lg">
            Complaint<span className="text-blue-600">Hub</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Submit and track complaints efficiently with our comprehensive management system
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center hover:scale-105 transition-transform">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Submit Complaint</h2>
            <p className="text-gray-600 mb-6 text-center">
              File a new complaint and get instant confirmation with tracking details.
            </p>
            <Link href="/submit">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors">
                New Complaint
              </button>
            </Link>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center hover:scale-105 transition-transform">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Admin Dashboard</h2>
            <p className="text-gray-600 mb-6 text-center">
              Manage and track all complaints with status updates and filtering options.
            </p>
            <Link href="/admin">
              <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-green-700 transition-colors">
                Admin Panel
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
