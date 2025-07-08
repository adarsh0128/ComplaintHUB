"use client";

import ComplaintsTable from '@/components/ComplaintsTable';
import AnalyticsCard from '@/components/AnalyticsCard';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [analytics, setAnalytics] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  });

  useEffect(() => {
    fetch('/api/complaints/analytics')
      .then(res => res.json())
      .then(data => {
        if (data.success) setAnalytics(data.data);
      });
  }, []);

  // Redirect if not authenticated
  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  if (!session) {
    if (typeof window !== 'undefined') router.replace('/admin/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, Admin ({session?.user?.email || "-"})</span>
              <Link href="/admin/login?logout=1" className="text-sm text-red-600 font-semibold hover:underline bg-red-50 px-3 py-1 rounded transition">Logout</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <AnalyticsCard title="Total Complaints" value={analytics.total} icon={<span className="text-blue-500">📋</span>} color="border-blue-500" />
          <AnalyticsCard title="Open" value={analytics.open} icon={<span className="text-yellow-500">🟡</span>} color="border-yellow-400" />
          <AnalyticsCard title="In Progress" value={analytics.inProgress} icon={<span className="text-blue-600">🔵</span>} color="border-blue-600" />
          <AnalyticsCard title="Resolved" value={analytics.resolved} icon={<span className="text-green-600">✅</span>} color="border-green-600" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <AnalyticsCard title="Critical" value={analytics.critical} icon={<span className="text-red-600">⛔</span>} color="border-red-600" />
          <AnalyticsCard title="High" value={analytics.high} icon={<span className="text-orange-500">⚠️</span>} color="border-orange-500" />
          <AnalyticsCard title="Medium" value={analytics.medium} icon={<span className="text-yellow-500">🟠</span>} color="border-yellow-500" />
          <AnalyticsCard title="Low" value={analytics.low} icon={<span className="text-green-500">🟢</span>} color="border-green-500" />
        </div>
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Complaints Management</h2>
            <p className="text-sm text-gray-500">Manage and track all customer complaints</p>
          </div>
          <ComplaintsTable />
        </div>
      </div>
    </div>
  );
}
