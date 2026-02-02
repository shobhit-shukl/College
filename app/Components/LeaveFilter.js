"use client";

export default function LeaveFilter({ currentFilter, setFilter }) {
  const filters = ["All", "Pending", "Approved", "Declined"];
  return (
    <div className="flex gap-3 mb-6 justify-center">
      {filters.map(f => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`px-4 py-2 rounded-full font-semibold ${
            currentFilter === f
              ? "bg-white text-gray-800"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
