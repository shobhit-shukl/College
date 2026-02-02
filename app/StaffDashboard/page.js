"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { FaCalendarAlt } from "react-icons/fa";

import {
  FaUser,
  FaClipboardList,
  FaUsers,
  FaCalendarTimes,
  FaBed,
  FaMoneyCheckAlt,
  FaEdit,
  FaSignOutAlt,
  FaLaptopCode,
  FaCheckCircle,
  FaPlus,
  FaPrint,
  FaSearch,
  FaBook,
} from "react-icons/fa";
import { FaFileAlt } from "react-icons/fa";


import { Briefcase, AlertCircle, Clock, CheckCircle2 } from 'lucide-react'; // Optional icons

export default function StaffDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StaffDashboardContent />
    </Suspense>
  );
}

function StaffDashboardContent() {
  const [activeSection, setActiveSection] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [Staff, setStaff] = useState([]);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [timetableFile, setTimetableFile] = useState(null);
  const [staffTimetables, setStaffTimetables] = useState([]);
  const [studentTimetables, setStudentTimetables] = useState([]);
  const [tasks, settasks] = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(false);
  const [loadingTimetable, setLoadingTimetable] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // To store "Success" or "Error"
  const [responseData, setResponseData] = useState(null); // To store the actual record from DB
  const [notices, setNotices] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(false);
  const [teamTasks, setTeamTasks] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [timetables, setTimetables] = useState([]);
  const [loadingTimetables, setLoadingTimetables] = useState(false);


  const searchParams = useSearchParams();
  const id = searchParams.get("staff_id");

  const Staff_details = Staff?.[0] || {};
  const department = Staff_details?.Staff_dept;


  useEffect(() => {
    console.log("ID from state:", id);

    if (!id) return;

    fetch("/api/AuthStaffs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setStaff(data);
      })
      .catch((err) => console.error(err));
  }, [id]);


  useEffect(() => {
    const fetchLeaveHistory = async () => {
      setLoadingLeaves(true);
      try {
        const res = await fetch("/api/LeaveUpdates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        })


        const data = await res.json();
        setLeaveHistory(data);
      } catch (error) {
        console.error("Failed to fetch leave history", error);
      } finally {
        setLoadingLeaves(false);
      }
    };

    if (activeSection === "timeOff") {
      fetchLeaveHistory();
    }
  }, [activeSection]);




  useEffect(() => {
    if (!department) return;

    setLoadingTimetables(true);

    fetch(
      `/api/timetable?department=${encodeURIComponent(
        department
      )}&timetable_type=staff`
    )
      .then((res) => res.json())
      .then((data) => {
        setTimetables(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to fetch timetables", err);
        setTimetables([]);
      })
      .finally(() => {
        setLoadingTimetables(false);
      });
  }, [department]);




  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/Task", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ department }),
        })
        const data = await res.json();
        settasks(data);
      } catch (error) {
        console.error("Failed to fetch Task history", error);
      }
    };

    if (activeSection === "tasks") {
      fetchTasks();
    }
  }, [activeSection]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoadingNotices(true);
        const res = await fetch("/api/DisplayStaffNotices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ department }),
        });

        const data = await res.json();
        setNotices(data);
      } catch (err) {
        console.error("Failed to fetch notices", err);
      } finally {
        setLoadingNotices(false);
      }
    };

    if (activeSection === "notices" && department) {
      fetchNotices();
    }
  }, [activeSection, department]);




  const submitLeaveRequest = async () => {
    try {
      if (!leaveForm.start_date || !leaveForm.end_date || !leaveForm.reason) {
        alert("Please fill all fields");
        return;
      }

      const response = await fetch('/api/leaves', { // Added leading slash for safety
        method: 'POST',
        headers:
        {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leave_type: leaveForm.leave_type,
          start_date: leaveForm.start_date,
          end_date: leaveForm.end_date,
          status: "Pending", // Hardcode initial status here
          employee: leaveForm.employee,
          reason: leaveForm.reason
        }),
      });

      // ⬇️ THIS IS THE MISSING LINE ⬇️
      const data = await response.json();

      if (response.ok) {
        setSubmissionStatus("success");
        setResponseData(data); // Now 'data' is defined!
        alert("Request submitted successfully!");

        // Reset form
        setLeaveForm({
          leave_type: "",
          start_date: "",
          end_date: "",
          reason: "",
          employee: leaveForm.employee // Keep the employee ID
        });
      } else {
        setSubmissionStatus("error");
        // Use the error message from the backend if available
        console.error("Submission failed:", data.error || "Unknown error");
      }
    } catch (error) {
      setSubmissionStatus("error");
      console.error("Error making API call:", error);
    }
  };


  // const teamMembers = [
  //   { id: 1, name: "Alice Green", role: "Developer", email: "alice@corp.com" },
  //   { id: 2, name: "Mark Sloan", role: "QA Engineer", email: "mark@corp.com" },
  //   { id: 3, name: "Sarah Connor", role: "Team Lead", email: "sarah@corp.com" },
  // ];



  const payslips = [
    { id: 1, month: "November 2025", netPay: 7200 },
    { id: 2, month: "October 2025", netPay: 7150 },
  ];

  const [leaveForm, setLeaveForm] = useState({
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
    status: "pending",
    employee: id, // Replace with your actual user logic
    employee_name: Staff_details?.Staff_name
  });


  useEffect(() => {
    const fetchTeamTasks = async () => {
      if (!id) return;

      setLoadingTeam(true);
      try {
        const res = await fetch("/api/assignedTeam", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ staff_id: id }),
        });

        const text = await res.text();

        if (!text) {
          setTeamTasks([]);
          return;
        }

        const data = JSON.parse(text);
        setTeamTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch team tasks", err);
        setTeamTasks([]);
      } finally {
        setLoadingTeam(false);
      }
    };

    if (activeSection === "team") {
      fetchTeamTasks();
    }
  }, [activeSection, id]);

  console.log("Team Tasks:", teamTasks);
  /* ---------------- HANDLERS ---------------- */
  const handleProfileChange = (e, field) => {
    setStaff({ ...Staff, [field]: e.target.value });
  };



  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 text-indigo-400">
          <FaLaptopCode /> Staff Portal
        </h2>

        {[
          ["profile", "My Profile", <FaUser />],
          ["tasks", "Tasks", <FaClipboardList />],
          ["team", "Team", <FaUsers />],
          ["timeOff", "Time Off", <FaCalendarTimes />],
          ["payslips", "Payslips", <FaMoneyCheckAlt />],
          ["timetable", "Timetable", <FaCalendarTimes />],
          ["notices", "Notices", <AlertCircle />],
        ].map(([key, label, icon]) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${activeSection === key
              ? "bg-indigo-600"
              : "hover:bg-gray-700"
              }`}
          >
            {icon} {label}
          </button>
        ))}

        {/* Draft Result access - only for coordinator role */}
        {typeof window !== 'undefined' && localStorage.getItem('role') === 'coordinator' && (
          <button
            onClick={() => window.location.href = '/DraftResults'}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold shadow-lg"
          >
            <FaFileAlt /> Draft Results Module
          </button>
        )}

        {/* 
            Role-Specific Dashboards:
            - Professors & Assistant Professors: Restricted to StaffDashboard (default view below)
            - Other roles get additional dashboard buttons:
        */}

        {/* HR Dashboard Button - only visible for HR role */}
        {typeof window !== 'undefined' && localStorage.getItem('role') === 'hr' && (
          <button
            onClick={() => window.location.href = '/HR'}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg"
          >
            <FaUsers /> HR Dashboard
          </button>
        )}

        {/* Library Dashboard Button - only visible for Librarian role */}
        {typeof window !== 'undefined' && localStorage.getItem('role') === 'librarian' && (
          <button
            onClick={() => window.location.href = '/library'}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold shadow-lg"
          >
            <FaBook /> Library Dashboard
          </button>
        )}

        {/* Hostel Dashboard Button - only visible for Warden role */}
        {typeof window !== 'undefined' && localStorage.getItem('role') === 'Warden' && (
          <button
            onClick={() => window.location.href = '/HostelDashboard'}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold shadow-lg"
          >
            <FaBed /> Hostel Dashboard
          </button>
        )}

        {/* Accountant Dashboard Button - only visible for Accountant role */}
        {typeof window !== 'undefined' && localStorage.getItem('role') === 'accountant' && (
          <button
            onClick={() => window.location.href = '/Accounts'}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg"
          >
            <FaMoneyCheckAlt /> Accounts Dashboard
          </button>
        )}

        {/* Owner Dashboard Button - visible to Dean, Admin, and Superadmin */}
        {typeof window !== 'undefined' && ['dean','admin','superadmin'].includes(String(localStorage.getItem('role') || '').toLowerCase()) && (
          <button
            onClick={() => window.location.href = '/Owner'}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-semibold shadow-lg"
          >
            <FaUser /> Owner / Management
          </button>
        )}

        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('profileUrl');
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            window.location.href = '/';
          }}
          className="mt-10 flex items-center gap-3 text-red-400"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* ---------------- MAIN ---------------- */}
      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold mb-8">
          Welcome back, {Staff_details?.Staff_name} 👋
        </h1>

        {/* ---------------- PROFILE ---------------- */}
        {activeSection === "profile" && (
          <section className="bg-white p-8 rounded-xl shadow">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold text-indigo-700">Profile</h2>
              <button
                onClick={() => setEditing(!editing)}
                className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                {editing ? <FaCheckCircle /> : <FaEdit />}
                {editing ? "Save" : "Edit"}
              </button>
            </div>

            <div className="flex gap-8 flex-wrap">
              <img src={Staff_details?.image || " "} className="w-32 h-32 rounded-full" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                <Input label="Name" value={Staff_details?.Staff_name || ""} disabled />
                <Input label="Employee ID" value={Staff_details?.Staff_id || ""} disabled />
                <Input label="Role" value={Staff_details?.Staff_type || ""} disabled />
                <Input label="Department" value={Staff_details?.Staff_dept || ""} disabled />
                <Input
                  label="Email"
                  value={Staff_details?.Staff_email || ""}
                  disabled={!editing}
                />
                <Input
                  label="Phone"
                  value={Staff_details?.Phone || ""}
                  disabled={!editing}
                />

              </div>
            </div>
          </section>
        )}



        {activeSection === "tasks" && (
          <section className="bg-gray-50/50 p-6 md:p-10 rounded-2xl shadow-inner min-h-screen">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Workspace</h2>
                <p className="text-gray-500 mt-1">Manage your department tasks and priorities</p>
              </div>
              <span className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-indigo-200">
                Total: {tasks.length}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {tasks.map((task) => (
                <div
                  key={task?.id}
                  className="group relative bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Priority Indicator Line */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl ${task?.Priority === 'High' ? 'bg-red-500' :
                    task?.Priority === 'Medium' ? 'bg-orange-400' : 'bg-blue-400'
                    }`} />

                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-3 flex-1">
                      {/* Header: Title & Dept */}
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                          {task?.Task_title}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
                          <Briefcase className="w-3 h-3 mr-1" /> {task?.dept}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm leading-relaxed max-w-3xl">
                        {task?.Task_desc}
                      </p>

                      {/* Meta Info: Priority & Date (Example) */}
                      <div className="flex items-center gap-4 pt-2">
                        <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${task?.Priority === 'High' ? 'bg-red-50 text-red-600' :
                          task?.Priority === 'Medium' ? 'bg-orange-50 text-yellow-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                          <AlertCircle className="w-3.5 h-3.5" />
                          {task?.Priority} Priority
                        </div>
                      </div>
                    </div>

                    {/* Status Section */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-8">
                      <div className="text-right hidden lg:block">
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Status</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${task.status === "Completed"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}>
                        {task.status === "Completed" ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        {task?.status || "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ---------------- TEAM ---------------- */}
        {activeSection === "team" && (
          <section className="bg-white p-8 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-6 text-indigo-700">
              My Team Tasks
            </h2>

            {loadingTeam ? (
              <p className="text-gray-500 animate-pulse">Loading team tasks...</p>
            ) : teamTasks.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                🚫 No team assigned to you
              </div>
            ) : (
              <div className="space-y-4">
                {teamTasks.map((task) => (
                  <div
                    key={task.id}
                    className="border border-gray-200 rounded-lg p-5 hover:shadow transition"
                  >
                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-800">
                      {task.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mt-1">
                      {task.title_desc}
                    </p>

                    {/* Assigned Staff */}
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-gray-500 mb-1">
                        Assigned Staff
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(task.staff_id) && task.staff_id.map((sid) => (
                          <span
                            key={sid}
                            className="px-3 py-1 text-xs font-bold bg-indigo-100 text-indigo-700 rounded-full"
                          >
                            {sid}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Date */}
                    <p className="text-xs text-gray-400 mt-4">
                      Assigned on: {new Date(task.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}


        {/* TIMETABLE */}
        {activeSection === "timetable" && (
          <section className="bg-white p-8 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold mb-6 text-indigo-700 flex items-center gap-2">
              <FaCalendarAlt /> Timetables
            </h2>

            {loadingTimetables ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-r-transparent"></div>
                <p className="mt-3 text-gray-600">Loading timetables...</p>
              </div>
            ) : timetables.length === 0 ? (
              <div className="bg-gray-50 p-8 rounded-xl text-center">
                <FaCalendarAlt className="text-gray-400 text-5xl mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  No timetables uploaded yet for your department
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {timetables.map((t) => {
                  const isImage =
                    t.file_url.endsWith(".jpg") ||
                    t.file_url.endsWith(".jpeg") ||
                    t.file_url.endsWith(".png");

                  return (
                    <div
                      key={t.id}
                      className="bg-gray-50 p-4 rounded-xl shadow"
                    >
                      <p className="font-semibold text-lg mb-1">
                        {t.department} Department –{" "}
                        {t.timetable_type === "student" ? "Student" : "Staff"} Timetable
                      </p>

                      <p className="text-sm text-gray-500 mb-3">
                        Uploaded: {new Date(t.uploaded_at).toLocaleDateString()}
                      </p>

                      {isImage ? (
                        <a href={t.file_url} target="_blank" rel="noopener noreferrer">
                          <img
                            src={t.file_url}
                            alt="Timetable"
                            className="w-full h-auto rounded-lg border hover:scale-[1.02] transition"
                          />
                        </a>
                      ) : (
                        <a
                          href={t.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                        >
                          View Timetable
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}


        {/* ---------------- TIME OFF ---------------- */}
        {activeSection === "timeOff" && (
          <section className="bg-gray-50 p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">

            {/* ================= Header ================= */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-indigo-700">
                Time Off Management
              </h2>
              <p className="text-gray-500 mt-1">
                Submit a new leave request and track approval status
              </p>
            </div>

            {/* ================= Leave Request Form ================= */}
            <div className="bg-white p-6 rounded-xl shadow-sm border mb-10">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                New Leave Request
              </h3>

              {/* Leave Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leave Type
                </label>
                <select
                  className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={leaveForm.leave_type}
                  onChange={e => setLeaveForm({ ...leaveForm, leave_type: e.target.value })}
                >
                  <option value="">Select Type</option>
                  <option value="Vacation">Vacation</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Personal">Personal</option>
                  <option value="Maternity/Paternity">Maternity / Paternity</option>
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  value={leaveForm.start_date}
                  onChange={e => setLeaveForm({ ...leaveForm, start_date: e.target.value })}
                />
                <Input
                  label="End Date"
                  type="date"
                  value={leaveForm.end_date}
                  onChange={e => setLeaveForm({ ...leaveForm, end_date: e.target.value })}
                />
              </div>

              {/* Reason */}
              <textarea
                className="w-full p-3 border rounded-lg mt-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Reason for leave..."
                rows="3"
                value={leaveForm.reason}
                onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              />

              <button
                onClick={submitLeaveRequest}
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Submit Leave Request
              </button>

              {/* Success */}
              {submissionStatus === "success" && responseData && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 font-semibold">
                    ✅ Leave request submitted successfully
                  </p>
                  <div className="text-sm text-green-600 mt-2 grid grid-cols-2 gap-2">
                    <span><strong>ID:</strong> {responseData.id}</span>
                    <span><strong>Status:</strong> {responseData.status}</span>
                    <span><strong>Type:</strong> {responseData.leave_type}</span>
                    <span>
                      <strong>Dates:</strong> {responseData.start_date} → {responseData.end_date}
                    </span>
                  </div>
                </div>
              )}

              {/* Error */}
              {submissionStatus === "error" && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  ❌ Something went wrong. Please try again.
                </div>
              )}
            </div>

            {/* ================= Leave History ================= */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Leave Request History
              </h3>

              {loadingLeaves ? (
                <div className="text-center py-8 text-gray-500 animate-pulse">
                  Loading leave history...
                </div>
              ) : leaveHistory.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  📭 No leave requests yet
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border rounded-lg overflow-hidden">
                    <thead className="bg-indigo-50 sticky top-0">
                      <tr>
                        {["Type", "Start", "End", "Status", "Requested On"].map(h => (
                          <th
                            key={h}
                            className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody className="divide-y">
                      {leaveHistory.map(leave => (
                        <tr key={leave.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 text-sm">{leave.leave_type}</td>
                          <td className="px-4 py-3 text-sm">{leave.start_date}</td>
                          <td className="px-4 py-3 text-sm">{leave.end_date}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center
                                  ${leave.status === "Approved"
                                  ? "bg-green-100 text-green-700"
                                  : leave.status === "Rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                            >
                              {leave.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {leave.created_at}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {activeSection === "notices" && (
          <section className="bg-white p-8 rounded-xl shadow max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-indigo-700 mb-6">
              📢 Admin Notices
            </h2>

            {loadingNotices ? (
              <p className="text-gray-500 animate-pulse">Loading notices...</p>
            ) : notices.length === 0 ? (
              <p className="text-gray-500">No notices available</p>
            ) : (
              <div className="space-y-4">
                {notices.map((n) => (
                  <div
                    key={n.id}
                    className="border-l-4 border-indigo-600 bg-indigo-50 p-5 rounded-lg"
                  >
                    <h3 className="text-lg font-bold text-gray-800">
                      {n.title}
                    </h3>
                    <p className="text-gray-700 mt-1">
                      {n.description} {/* Correct field from backend */}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(n.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}



        {/* ---------------- PAYSLIPS ---------------- */}
        {activeSection === "payslips" && (
          <section className="bg-white p-8 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">Payslips</h2>
            {payslips.map(p => (
              <div key={p.id} className="flex justify-between bg-gray-50 p-4 rounded mb-3">
                <div>
                  <p className="font-semibold">{p.month}</p>
                  <p className="text-sm">Net Pay: ${p.netPay}</p>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded">
                  <FaPrint /> Print
                </button>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

/* ---------------- REUSABLE INPUT ---------------- */
const Input = ({ label, value, onChange, disabled, type = "text" }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full p-3 border rounded"
    />
  </div>
);
