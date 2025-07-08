export default function Header() {
  return (
    <header className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 py-4 shadow">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="text-gray-900 text-2xl font-bold tracking-tight">
          Complaint<span className="text-indigo-700">Hub</span>
        </div>
        <nav className="space-x-4">
          <a href="/" className="text-gray-900 hover:text-indigo-700 font-medium">Home</a>
          <a href="/submit" className="text-gray-900 hover:text-indigo-700 font-medium">Submit</a>
          <a href="/admin" className="text-gray-900 hover:text-indigo-700 font-medium">Admin</a>
        </nav>
      </div>
    </header>
  );
}
