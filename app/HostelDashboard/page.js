"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBed,
  FaUsers,
  FaMoneyBill,
  FaSignOutAlt,
  FaUserGraduate,
  FaExclamationCircle,
} from "react-icons/fa";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function HostelDashboard() {
  const [active, setActive] = useState("overview");
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [Complaints, setComplaints] = useState([]);
  const [openRoomForm, setOpenRoomForm] = useState(false);
  const [roomNo, setRoomNo] = useState("");
  const [roomType, setRoomType] = useState("");
  const [openStudentForm, setOpenStudentForm] = useState(false);

  const [studentData, setStudentData] = useState({
    Student_id: "",
    RoomNo: "",
    fee_status: "Pending",
  });


  useEffect(() => {
    const fetchStudents = async () => {
      const res = await fetch("/api/HostelStudents");
      const data = await res.json();
      setStudents(data);
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      const res = await fetch("/api/HostelRooms");
      const data = await res.json();
      setRooms(data);
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchComplaints = async () => {
      const res = await fetch("/api/HostelComplaints");
      const data = await res.json();
      setComplaints(data);
    };
    fetchComplaints();
  }, []);

  const handleAddRoom = async () => {
    try {
      const res = await fetch("/api/HostelRooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_no: roomNo,
          room_type: roomType,
          Status: "Available",
        }),
      });

      if (!res.ok) throw new Error("Failed");

      const newRoom = await res.json();
      setRooms((prev) => [...prev, newRoom]);

      toast.success("Room Successfully Added 🏠");

      setRoomNo("");
      setRoomType("");
      setOpenRoomForm(false);
    } catch (err) {
      toast.error("Error adding room ❌");
    }
  };

  const handleAddStudent = async () => {
    try {
      const res = await fetch("/api/HostelStudents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });

      if (!res.ok) throw new Error("Failed");

      const newStudent = await res.json();
      setStudents((prev) => [...prev, newStudent]);

      toast.success("Student Assigned Successfully 🎓");

      setStudentData({
        Student_id: "",
        RoomNo: "",
        fee_status: "Pending",
      });

      setOpenStudentForm(false);
    } catch (err) {
      toast.error("Error adding student ❌");
    }
  };


  /* ===== STATS ===== */
  const stats = [
    { title: "Total Rooms", value: 120, icon: <FaBed /> },
    { title: "Students", value: students.length, icon: <FaUsers /> },
    { title: "Monthly Fees", value: "₹2,50,000", icon: <FaMoneyBill /> },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* SIDEBAR */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 bg-gradient-to-b from-indigo-600 to-purple-600 text-white p-6 shadow-2xl"
      >
        <h1 className="text-2xl font-extrabold mb-10 tracking-wide">
          🏨 Hostel Admin
        </h1>

        {["overview", "students", "rooms", "complaints"].map((item) => (
          <motion.button
            key={item}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActive(item)}
            className={`w-full text-left px-4 py-3 mb-3 rounded-xl font-semibold transition-all ${active === item
                ? "bg-white text-indigo-600 shadow-lg"
                : "hover:bg-white/20"
              }`}
          >
            {item.toUpperCase()}
          </motion.button>
        ))}

        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('profileUrl');
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            window.location.href = '/';
          }}
          className="flex items-center gap-2 mt-10 px-4 py-2 hover:bg-white/20 rounded-xl"
        >
          <FaSignOutAlt /> Logout
        </button>
      </motion.aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">
        <AnimatePresence mode="wait">

          {/* OVERVIEW */}
          {active === "overview" && (
            <motion.section
              key="overview"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-4xl font-bold mb-8 text-indigo-700">
                Hostel Overview
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.title}
                    whileHover={{ scale: 1.07 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-xl"
                  >
                    <div className="text-4xl text-indigo-600 mb-2">
                      {s.icon}
                    </div>
                    <h3 className="text-gray-500">{s.title}</h3>
                    <p className="text-3xl font-bold text-indigo-700">
                      {s.value}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* STUDENTS (FULL ORIGINAL DATA) */}
          {active === "students" && (
            <motion.section
              key="students"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-4xl font-bold mb-8 text-indigo-700">
                Students
              </h2>
              <div className="flex justify-between items-center mb-8">

                <button
                  onClick={() => setOpenStudentForm(true)}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:bg-indigo-700"
                >
                  + Add Student
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students.map((s) => (
                  <motion.div
                    key={s.Student_id}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-2xl shadow-xl p-6 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100 rounded-full -mr-10 -mt-10"></div>

                    <div className="flex items-center gap-3 mb-4">
                      <FaUserGraduate className="text-3xl text-indigo-600" />
                      <div>
                        <h3 className="text-xl font-bold">{s.name}</h3>
                        <p className="text-sm text-gray-500">
                          ID: {s.Student_id}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1 text-gray-700">
                      <p>🏫 Course: <b>{s.course}</b></p>
                      <p>📚 Department: <b>{s.department}</b></p>
                      <p>🎓 Semester: <b>{s.semester}</b></p>
                      <p>📅 Year: <b>{s.year}</b></p>
                      <p>🛏 Room No: <b>{s.RoomNo}</b></p>
                    </div>

                    <span
                      className={`inline-block mt-4 px-4 py-1 rounded-full text-sm font-bold ${s.fee_status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      Fee: {s.fee_status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          <AnimatePresence>
            {openStudentForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  className="bg-white rounded-2xl p-8 w-[90%] max-w-md shadow-2xl"
                >
                  <h3 className="text-2xl font-bold mb-6 text-indigo-700">
                    Assign Student to Room
                  </h3>

                  <input
                    placeholder="Student ID"
                    value={studentData.Student_id}
                    onChange={(e) =>
                      setStudentData({ ...studentData, Student_id: e.target.value })
                    }
                    className="w-full mb-4 px-4 py-2 border rounded-xl"
                  />

                  <input
                    placeholder="Room Number"
                    value={studentData.RoomNo}
                    onChange={(e) =>
                      setStudentData({ ...studentData, RoomNo: e.target.value })
                    }
                    className="w-full mb-4 px-4 py-2 border rounded-xl"
                  />

                  <select
                    value={studentData.fee_status}
                    onChange={(e) =>
                      setStudentData({ ...studentData, fee_status: e.target.value })
                    }
                    className="w-full mb-6 px-4 py-2 border rounded-xl"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Pending</option>
                  </select>

                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setOpenStudentForm(false)}
                      className="px-4 py-2 rounded-xl bg-gray-200"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleAddStudent}
                      className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                    >
                      Save
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>


          {/* ROOMS */}
          {active === "rooms" && (
            <motion.section
              key="rooms"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-4xl font-bold mb-8 text-indigo-700">
                Rooms
              </h2>

              <div className="flex justify-between items-center mb-8">
                <button
                  onClick={() => setOpenRoomForm(true)}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:bg-indigo-700"
                >
                  + Add Room
                </button>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((r) => (
                  <motion.div
                    key={r.room_no}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-2xl shadow-xl p-6 relative overflow-hidden"
                  >

                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100 rounded-full -mr-10 -mt-10"></div>

                    <div className="flex items-center gap-3 mb-4">
                      <FaBed className="text-3xl text-indigo-600" />
                      <div>
                        <h3 className="text-xl font-bold">
                          Room {r.room_no}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {r.room_type}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${r.Status === "Available"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {r.Status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}


          <AnimatePresence>
            {openRoomForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  className="bg-white rounded-2xl p-8 w-[90%] max-w-md shadow-2xl"
                >
                  <h3 className="text-2xl font-bold mb-6 text-indigo-700">
                    Add New Room
                  </h3>

                  <input
                    type="text"
                    placeholder="Room Number"
                    value={roomNo}
                    onChange={(e) => setRoomNo(e.target.value)}
                    className="w-full mb-4 px-4 py-2 border rounded-xl focus:outline-indigo-500"
                  />

                  <input
                    type="text"
                    placeholder="Room Type (Single / Double)"
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full mb-6 px-4 py-2 border rounded-xl focus:outline-indigo-500"
                  />

                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setOpenRoomForm(false)}
                      className="px-4 py-2 rounded-xl bg-gray-200"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleAddRoom}
                      className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                    >
                      Save
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>


          {/* COMPLAINTS */}
          {active === "complaints" && (
            <motion.section
              key="complaints"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-4xl font-bold mb-8 text-indigo-700">
                Complaints
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Complaints.map((c) => (
                  <motion.div
                    key={c.complaint_title}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-2xl shadow-xl p-6"
                  >
                    <FaExclamationCircle className="text-3xl text-indigo-600 mb-3" />
                    <h3 className="text-2xl font-bold">👨‍🎓 {c.name}</h3>
                    <p className="text-gray-700 text-xl font-bold mb-2">Title - {c.complaint_title}</p>
                    <p className="text-gray-600 mb-4">📝 {c.complaint_desc}</p>

                    <span
                      className={`px-4 py-1 rounded-full text-sm font-bold ${c.status === "Resolved"
                          ? "bg-green-100 text-green-700"
                          : c.Status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {c.Status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

        </AnimatePresence>
      </main>
      <ToastContainer position="top-right" />
    </div>

  );
}



