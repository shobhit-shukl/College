"use client";

import { useEffect, useState } from "react";
import LeaveCard from "@/app/Components/LeaveCard";
import LeaveFilter from "@/app/Components/LeaveFilter";
import DownloadReportButton from "@/app/Components/DownloadReportButton";


import Pagination from "@/app/Components/Pagination";


export default function LeaveManagement() {
  const [filter, setFilter] = useState("All");
  const [leaves, setLeaves] = useState([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 10
  });

  const fetchLeaves = async (page = 1) => {
    try {
      // If sorting or filtering is needed server-side, it should be passed here.
      // For now, client-side filtering is used for "status". 
      // This means pagination might be weird (pagination is across ALL leaves, then filtered client side).
      // Ideally, pass filter to API. But keeping it simple as per request to add pagination.
      const res = await fetch(`/api/leaves?page=${page}&limit=10`);
      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();
      if (data.pagination) {
        setLeaves(data.data);
        setPagination(data.pagination);
      } else {
        setLeaves(data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchLeaves(1);
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/leaves`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (response.ok) {
        // Update local state only if DB update was successful
        setLeaves(prev =>
          prev.map(leave =>
            leave.id === id ? { ...leave, status: newStatus } : leave
          )
        );
      } else {
        alert("Failed to update status in database");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };
  // Filter leaves based on current filter
  const filteredLeaves =
    filter === "All" ? leaves : leaves.filter(leave => leave.status === filter);

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-center">Leave Management</h1>
        <DownloadReportButton
          apiEndpoint="/api/leaves"
          fileName="Leaves_Report"
        />
      </div>

      {/* Pagination */}
      <div className="mt-8 pb-8">
        {leaves.length > 0 && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={(page) => fetchLeaves(page)}
          />
        )}
      </div>

      {/* Filter Buttons */}
      <LeaveFilter currentFilter={filter} setFilter={setFilter} />

      {/* Leave Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredLeaves.length > 0 ? (
          filteredLeaves.map(leave => (
            <LeaveCard
              key={leave.id}
              leave={leave}
              onStatusChange={handleStatusChange}
            />
          ))
        ) : (
          <p className="text-center col-span-full text-white font-semibold">
            No leaves found for "{filter}"
          </p>
        )}
      </div>
    </div>
  );
}
