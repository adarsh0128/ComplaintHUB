"use client";

import React, { useEffect, useState } from "react";
import { ComplaintFormData, IComplaint, ApiResponse } from "@/types";
import { saveAs } from "file-saver";

const statusColors: Record<string, string> = {
  Open: "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Resolved: "bg-green-100 text-green-800",
  Closed: "bg-gray-200 text-gray-700",
};

const priorityColors: Record<string, string> = {
  Critical: "bg-red-100 text-red-700 border border-red-300",
  High: "bg-orange-100 text-orange-700 border border-orange-300",
  Medium: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  Low: "bg-green-100 text-green-700 border border-green-300",
};

function ComplaintDetailsModal({ complaint, onClose }: { complaint: IComplaint | null, onClose: () => void }) {
  if (!complaint) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative animate-fade-in">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        <h3 className="text-2xl font-bold mb-2 text-gray-900">{complaint.title}</h3>
        <div className="mb-2 text-gray-900">{complaint.description}</div>
        <div className="grid grid-cols-2 gap-2 text-sm mb-2 text-gray-900">
          <div><span className="font-semibold">Category:</span> {complaint.category}</div>
          <div><span className="font-semibold">Priority:</span> {complaint.priority}</div>
          <div><span className="font-semibold">Status:</span> {complaint.status}</div>
          <div><span className="font-semibold">Created:</span> {new Date(complaint.createdAt).toLocaleString()}</div>
          <div><span className="font-semibold">Customer:</span> {complaint.customerName}</div>
          <div><span className="font-semibold">Email:</span> {complaint.customerEmail}</div>
          {complaint.customerPhone && <div><span className="font-semibold">Phone:</span> {complaint.customerPhone}</div>}
        </div>
        {complaint.notes && complaint.notes.length > 0 && (
          <div className="mt-2">
            <div className="font-semibold mb-1 text-gray-900">Notes:</div>
            <ul className="list-disc list-inside text-gray-900">
              {complaint.notes.map((note, i) => <li key={i}>{note}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComplaintsTable() {
  const [complaints, setComplaints] = useState<IComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState<IComplaint | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const limit = 10;

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line
  }, [statusFilter, search, page]);

  async function fetchComplaints() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (search) params.append("search", search);
      params.append("page", String(page));
      params.append("limit", String(limit));
      const res = await fetch(`/api/complaints?${params.toString()}`);
      const data: ApiResponse = await res.json();
      if (data.success) {
        setComplaints(data.data.complaints);
        setTotalPages(data.data.pagination.pages);
      } else {
        setError(data.error || "Failed to fetch complaints");
      }
    } catch (e) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/complaints/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data: ApiResponse = await res.json();
      if (data.success) {
        setComplaints((prev) =>
          prev.map((c) => (c._id === id ? { ...c, status: status as IComplaint["status"] } : c))
        );
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch {
      alert("Network error");
    }
  }

  async function deleteComplaint(id: string) {
    if (!window.confirm("Are you sure you want to delete this complaint? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/complaints/${id}`, { method: "DELETE" });
      const data: ApiResponse = await res.json();
      if (data.success) {
        setComplaints((prev) => prev.filter((c) => c._id !== id));
      } else {
        alert(data.error || "Failed to delete complaint");
      }
    } catch {
      alert("Network error");
    }
  }

  function exportToCSV() {
    if (!complaints.length) return;
    const header = [
      "Title","Description","Category","Priority","Status","Customer Name","Customer Email","Created At"
    ];
    const rows = complaints.map(c => [
      c.title,
      c.description,
      c.category,
      c.priority,
      c.status,
      c.customerName,
      c.customerEmail,
      new Date(c.createdAt).toLocaleString()
    ]);
    const csv = [header, ...rows].map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `complaints_page${page}.csv`);
  }

  // Split complaints into active and closed
  const activeComplaints = complaints.filter(c => c.status !== "Closed");
  const closedComplaints = complaints.filter(c => c.status === "Closed");

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex gap-2">
          <select
            className="border rounded px-3 py-2 text-sm text-gray-900 bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <input
            type="text"
            placeholder="Search by title, name, email..."
            className="border rounded px-3 py-2 text-sm text-gray-900 bg-white placeholder-gray-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          className="ml-auto bg-green-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-green-700 transition"
          onClick={exportToCSV}
          disabled={complaints.length === 0}
        >
          Export CSV
        </button>
      </div>
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading complaints...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <>
          {/* Active complaints table */}
          {activeComplaints.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No open, in progress, or resolved complaints found.</div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Title</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Customer</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Category</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Priority</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Status</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Created</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activeComplaints.map((c) => (
                    <React.Fragment key={c._id}>
                      <tr className="hover:bg-blue-50 group cursor-pointer" onClick={() => setExpandedId(expandedId === c._id ? null : c._id ?? null)}>
                        <td className="px-3 py-2 max-w-xs truncate" title={c.title}>
                          <span className="group-hover:underline text-blue-700 font-medium">{c.title}</span>
                        </td>
                        <td className="px-3 py-2">
                          <div className="font-medium text-gray-900">{c.customerName}</div>
                          <div className="text-xs text-gray-500">{c.customerEmail}</div>
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900">{c.category}</td>
                        <td className="px-3 py-2 text-sm text-gray-900">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${priorityColors[c.priority] || 'bg-gray-100 text-gray-700 border border-gray-200'}`}>{c.priority}</span>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[c.status] || "bg-gray-100 text-gray-700"}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</td>
                        <td className="px-3 py-2">
                          <select
                            className="border rounded px-2 py-1 text-xs mr-2 text-gray-900 bg-white"
                            value={c.status}
                            onChange={(e) => updateStatus(c._id!, e.target.value)}
                          >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Closed">Closed</option>
                          </select>
                          <button
                            className="ml-2 text-red-600 hover:underline text-xs"
                            onClick={() => deleteComplaint(c._id!)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                      {expandedId === c._id && (
                        <tr>
                          <td colSpan={7} className="p-0 border-none">
                            <div className="bg-white rounded-lg shadow-lg my-4 mx-2 p-6 border border-blue-200 animate-fade-in transition-all duration-300">
                              <div className="text-gray-900 text-base mb-2"><span className="font-semibold">Description:</span> {c.description}</div>
                              <div className="grid grid-cols-2 gap-2 text-sm text-gray-900">
                                <div><span className="font-semibold">Category:</span> {c.category}</div>
                                <div><span className="font-semibold">Priority:</span> {c.priority}</div>
                                <div><span className="font-semibold">Status:</span> {c.status}</div>
                                <div><span className="font-semibold">Created:</span> {new Date(c.createdAt).toLocaleString()}</div>
                                <div><span className="font-semibold">Customer:</span> {c.customerName}</div>
                                <div><span className="font-semibold">Email:</span> {c.customerEmail}</div>
                                {c.customerPhone && <div><span className="font-semibold">Phone:</span> {c.customerPhone}</div>}
                              </div>
                              {c.notes && c.notes.length > 0 && (
                                <div className="mt-2">
                                  <div className="font-semibold mb-1 text-gray-900">Notes:</div>
                                  <ul className="list-disc list-inside text-gray-900">
                                    {c.notes.map((note, i) => <li key={i}>{note}</li>)}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  className="px-3 py-1 rounded border bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">Page {page} of {totalPages}</span>
                <button
                  className="px-3 py-1 rounded border bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
          {/* Closed complaints table */}
          {closedComplaints.length > 0 && (
            <div className="mt-12">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Closed Complaints</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Title</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Customer</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Category</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Priority</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Status</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Created</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {closedComplaints.map((c) => (
                    <React.Fragment key={c._id}>
                      <tr className="hover:bg-gray-50 group cursor-pointer" onClick={() => setExpandedId(expandedId === c._id ? null : c._id ?? null)}>
                        <td className="px-3 py-2 max-w-xs truncate" title={c.title} onClick={() => setSelectedComplaint(c)}>
                          <span className="group-hover:underline text-blue-700 font-medium">{c.title}</span>
                        </td>
                        <td className="px-3 py-2">
                          <div className="font-medium text-gray-900">{c.customerName}</div>
                          <div className="text-xs text-gray-500">{c.customerEmail}</div>
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900">{c.category}</td>
                        <td className="px-3 py-2 text-sm text-gray-900">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${priorityColors[c.priority] || 'bg-gray-100 text-gray-700 border border-gray-200'}`}>{c.priority}</span>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[c.status] || "bg-gray-100 text-gray-700"}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</td>
                        <td className="px-3 py-2">
                          <button
                            className="ml-2 text-red-600 hover:underline text-xs"
                            onClick={() => deleteComplaint(c._id!)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                      {expandedId === c._id && (
                        <tr>
                          <td colSpan={7} className="p-0 border-none">
                            <div className="bg-white rounded-lg shadow-lg my-4 mx-2 p-6 border border-gray-200 animate-fade-in transition-all duration-300">
                              <div className="text-gray-900 text-base mb-2"><span className="font-semibold">Description:</span> {c.description}</div>
                              <div className="grid grid-cols-2 gap-2 text-sm text-gray-900">
                                <div><span className="font-semibold">Category:</span> {c.category}</div>
                                <div><span className="font-semibold">Priority:</span> {c.priority}</div>
                                <div><span className="font-semibold">Status:</span> {c.status}</div>
                                <div><span className="font-semibold">Created:</span> {new Date(c.createdAt).toLocaleString()}</div>
                                <div><span className="font-semibold">Customer:</span> {c.customerName}</div>
                                <div><span className="font-semibold">Email:</span> {c.customerEmail}</div>
                                {c.customerPhone && <div><span className="font-semibold">Phone:</span> {c.customerPhone}</div>}
                              </div>
                              {c.notes && c.notes.length > 0 && (
                                <div className="mt-2">
                                  <div className="font-semibold mb-1 text-gray-900">Notes:</div>
                                  <ul className="list-disc list-inside text-gray-900">
                                    {c.notes.map((note, i) => <li key={i}>{note}</li>)}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      <ComplaintDetailsModal complaint={selectedComplaint} onClose={() => setSelectedComplaint(null)} />
    </div>
  );
}
