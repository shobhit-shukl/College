"use client";

export default function StatusBadge({ status }) {
  const colors = {
    Approved: "bg-green-100 text-green-800",
    Declined: "bg-red-100 text-red-800",
    Pending: "bg-yellow-100 text-yellow-800",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors[status]}`}>
      {status}
    </span>
  );
}
