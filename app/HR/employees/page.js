"use client";

import Loader from "@/app/Components/Loader";
import DownloadReportButton from "@/app/Components/DownloadReportButton";
import Pagination from "@/app/Components/Pagination";
import { useEffect, useState } from "react";

export default function EmployeesPage() {
  const [employees, setemployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 10
  });

  const fetchEmployees = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/employees?page=${page}&limit=10`);

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      if (data.pagination) {
        setemployees(data.data);
        setPagination(data.pagination);
      } else {
        setemployees(data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(1);
  }, []);
  // DELETE EMPLOYEE
  const handleDeleteEmployee = async (Staff_id) => {
    // Confirm deletion
    if (!confirm("Are you sure you want to delete this staff?")) return;

    try {
      const res = await fetch("/api/staff", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: Staff_id }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Delete failed: " + (err.error || "Unknown error"));
        return;
      }


      alert("Deleted successfully!");
    } catch (err) {
      console.error("Fetch DELETE error:", err);
      alert("Error deleting staff");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen p-10 text-white bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">

      {/* Page Title */}
      <h1 className="text-4xl font-bold mb-8 drop-shadow-md">Employees Management</h1>

      {/* Table Container Card */}
      <div className="bg-white/10 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-white/20">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Employee List</h2>
          <DownloadReportButton
            apiEndpoint="/api/employees"
            fileName="Employees_Report"
            className="bg-green-600 hover:bg-green-700 shadow-md"
          />
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/20">
          <table className="min-w-full bg-white/10 backdrop-blur-md">
            <thead className="bg-white/20">
              <tr className="uppercase text-sm tracking-wider text-gray-200">
                <th className="py-4 px-6 text-left">ID</th>
                <th className="py-4 px-6 text-left">Name</th>
                <th className="py-4 px-6 text-left">Email ID</th>
                <th className="py-4 px-6 text-left">PH No</th>
                <th className="py-4 px-6 text-left">Designation</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((emp, index) => (
                <tr
                  key={emp.Staff_id}
                  className={`transition-all ${index % 2 === 0 ? "bg-white/10" : "bg-white/5"
                    } hover:bg-white/20`}
                >
                  <td className="py-4 px-6">{emp.Staff_id}</td>
                  <td className="py-4 px-6">{emp.Staff_name}</td>
                  <td className="py-4 px-6">{emp.Staff_email}</td>
                  <td className="py-4 px-6">{emp.Phone}</td>
                  <td className="py-4 px-6">{emp.Staff_type}</td>


                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleDeleteEmployee(emp.Staff_id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-red-600/50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

          <div className="p-4 border-t border-white/20">
            {employees.length > 0 && pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={(page) => fetchEmployees(page)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
