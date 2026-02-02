import { FaCalendarAlt } from "react-icons/fa";

export default function Schedule() {
  const schedules = [
    { id: 1, day: "Monday", work: "CS101 Lecture – 9 AM to 11 AM" },
    { id: 2, day: "Wednesday", work: "Lab Session – 1 PM to 4 PM" },
  ];

  return (
    <section className="bg-white p-8 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700 flex items-center">
        <FaCalendarAlt /> Work Schedule
      </h2>

      {schedules.map((s) => (
        <div
          key={s.id}
          className="p-4 bg-gray-50 rounded-xl shadow mb-4 flex justify-between"
        >
          <strong>{s.day}</strong>
          <span>{s.work}</span>
        </div>
      ))}
    </section>
  );
}
