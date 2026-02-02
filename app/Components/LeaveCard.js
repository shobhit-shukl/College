"use client";

import { FaCheckCircle, FaTimesCircle, FaUserTie } from "react-icons/fa";
import StatusBadge from "./StatusBadge";

export default function LeaveCard({ leave, onStatusChange }) {
  return (
    <div className="bg-white text-gray-800 rounded-xl shadow-2xl p-6 hover:scale-105 transform transition duration-300">
      <div className="flex items-center gap-4 mb-4">
        <FaUserTie className="text-blue-500 text-3xl" />
        <div>
          <h2 className="text-xl font-semibold">{leave.name}</h2>
          <h3 className="text-xl font-semibold">{leave.employee}</h3>
          <p className="text-gray-500">{leave.leave_type}</p>
        </div>
      </div>

      <p className="mb-4">
        Starting-Date: <span className="font-semibold">{leave.start_date}</span>
      </p>

      <p className="mb-4">
        Ending-Date: <span className="font-semibold">{leave.end_date}</span>
      </p>

      <div className="flex items-center justify-between mb-4">
        <StatusBadge status={leave.status} />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onStatusChange(leave.id, "Approved")}
          className="flex-1 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white py-2 rounded-lg shadow-md flex items-center justify-center gap-2 transition transform hover:scale-105"
        >
          <FaCheckCircle /> Approve
        </button>
        <button
          onClick={() => onStatusChange(leave.id, "Declined")}
          className="flex-1 bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white py-2 rounded-lg shadow-md flex items-center justify-center gap-2 transition transform hover:scale-105"
        >
          <FaTimesCircle /> Decline
        </button>
      </div>
    </div>
  );
}
