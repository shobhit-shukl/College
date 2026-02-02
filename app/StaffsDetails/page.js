"use client";

import { useState, useEffect } from "react";
import { FaUser, FaTasks, FaBell, FaSignOutAlt } from "react-icons/fa";

export default function StaffPage() {
  const [activeSection, setActiveSection] = useState("staffs");

  const [staffList, setStaffList] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
  const [assignedTeamTasks, setAssignedTeamTasks] = useState([]);

  console.log(staffList);

  const fetchAssignedTeamTasks = async () => {
    try {
      const res = await fetch("/api/assignTeamTask");
      const data = await res.json();
      setAssignedTeamTasks(data);
    } catch (error) {
      console.error("Fetch team tasks error:", error);
    }
  };


  useEffect(() => {
    if (activeSection === "teams") {
      fetchAssignedTeamTasks();
    }
  }, [activeSection]);


  const [newTask, setNewTask] = useState({
    Task_title: "",
    Task_desc: "",
    Priority: "Low",
    dept: ""
  });


  const fetchStaff = async () => {
    const res = await fetch("/api/staff");
    const data = await res.json();
    setStaffList(data);
  };

  const fetchStaffNotices = async () => {
    const res = await fetch("/api/staffNotices");
    const data = await res.json();
    setNotices(data);
  };


  const fetchTasks = async () => {
    const res = await fetch("/api/AllTask");
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchStaff();
  }, []);


  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    fetchStaffNotices();
  })

  const [notices, setNotices] = useState([]);


  const [showAddNoticeModal, setShowAddNoticeModal] = useState(false);

  const [newNotice, setNewNotice] = useState({
    title: "",
    description: "",
    type: "General",
    department: "",
  });

  const [teamTask, setTeamTask] = useState({
    staffIds: [""], // multiple staff IDs
    title: "",
    description: "",
  });


  const handleStaffIdChange = (index, value) => {
    const updated = [...teamTask.staffIds];
    updated[index] = value;
    setTeamTask({ ...teamTask, staffIds: updated });
  };

  const addStaffField = () => {
    setTeamTask({
      ...teamTask,
      staffIds: [...teamTask.staffIds, ""],
    });
  };

  const removeStaffField = (index) => {
    const updated = teamTask.staffIds.filter((_, i) => i !== index);
    setTeamTask({ ...teamTask, staffIds: updated });
  };


  const handleDeleteAssignedTask = async (taskId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this assigned task?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch("/api/assignTeamTask", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: taskId }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to delete task");
        return;
      }

      alert("Task deleted successfully ❌");

      // Refresh list
      fetchAssignedTeamTasks();
    } catch (error) {
      console.error("Delete task error:", error);
      alert("Server error while deleting task");
    }
  };



  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ id: "", name: "", department: "", email: "", role: "admin" });

  // ===== SEARCH =====
  const [staffSearchForm, setStaffSearchForm] = useState({ id: "", name: "", department: "" });

  const filteredStaff = staffList.filter((s) =>
    (!staffSearchForm.id || s.id.toLowerCase().includes(staffSearchForm.id.toLowerCase())) &&
    (!staffSearchForm.name || s.name.toLowerCase().includes(staffSearchForm.name.toLowerCase())) &&
    (!staffSearchForm.department || s.department.toLowerCase().includes(staffSearchForm.department.toLowerCase()))
  );

  // ===== ADMIN / SUPERADMIN CHECK =====
  const currentUserRole = "superadmin"; // Example: current logged in user role

  const handleDeleteStaff = async (staffId) => {
    // Confirm deletion
    if (!confirm("Are you sure you want to delete this staff?")) return;

    try {
      const res = await fetch("/api/staff", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: staffId }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Delete failed: " + (err.error || "Unknown error"));
        return;
      }

      // Update UI: ensure type safety when filtering
      setStaffList(prev =>
        prev.filter(s => String(s.id) !== String(staffId))
      );

      alert("Deleted successfully!");
    } catch (err) {
      console.error("Fetch DELETE error:", err);
      alert("Error deleting staff");
    }
  };

  const handleAssignTeamTask = async () => {
    // Basic validation
    if (
      teamTask.staffIds.some((id) => !id.trim()) ||
      !teamTask.title ||
      !teamTask.description
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("/api/assignTeamTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          staffIds: teamTask.staffIds, // array of staff IDs
          title: teamTask.title,
          description: teamTask.description,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to assign task");
        return;
      }

      const data = await res.json();
      console.log("Task assigned successfully:", data);

      alert("Task assigned successfully ✅");

      // Reset form
      setTeamTask({
        staffIds: [""],
        title: "",
        description: "",
      });
    } catch (error) {
      console.error("Assign team task error:", error);
      alert("Server error while assigning task");
    }

    await fetchAssignedTeamTasks();
    setShowAssignTaskModal(false);
  };


  const handleAssignTask = async () => {
    try {
      const response = await fetch("/api/AllTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTask.Task_title,
          description: newTask.Task_desc,
          dept: newTask.dept,
          Priority: newTask.Priority,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        alert(err.error);
        return;
      }

      const createdTask = await response.json();
      setTasks((prev) => [createdTask, ...prev]);
      setShowAssignTaskModal(false);
    } catch (error) {
      console.error("Assign task error:", error);
    }
  };


  const handleAddNotice = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/staffNotices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newNotice.title,
          description: newNotice.description,
          type: newNotice.type,
          department: newNotice.department,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add notice");
      }

      const data = await res.json();
      console.log("Notice added:", data);

      // Reset form
      setNewNotice({
        title: "",
        description: "",
        type: "General",
        department: "",
      });

      // Close modal
      setShowAddNoticeModal(false);

      // OPTIONAL: refresh notices list
      // setNotices((prev) => [data, ...prev]);

    } catch (error) {
      console.error("Error adding notice:", error);
      alert("Something went wrong while adding notice");
    }
  };


  const handleAddStaff = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStaff),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Error: " + data.error);
        return;
      }


      fetchStaff();
      // Reset form
      setNewStaff({ id: "", name: "", department: "", email: "" });

      // Close popup
      setShowAddStaffModal(false);

      // ⭐ SUCCESS ALERT — ADD IT HERE
      alert("Staff added successfully!");

    } catch (error) {
      console.error(error);
      alert("Network Error");
    }
  };

  const handleDeleteNotice = async (title) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this notice?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch("/api/staffNotices", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete notice");
      }

      // Remove deleted notice(s) from UI
      setNotices((prev) =>
        prev.filter((notice) => notice.title !== title)
      );

    } catch (error) {
      console.error("Error deleting notice:", error);
      alert("Failed to delete notice");
    }
  };

  const handleDeleteTasks = async (Task_title) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this notice?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch("/api/AllTask", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Task_title }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete notice");
      }

      fetchTasks();

    } catch (error) {
      console.error("Error deleting notice:", error);
      alert("Failed to delete notice");
    }
  };

const sendSMS = async (num) => {
    try {
    const phone = num; // country code + number (no +, no spaces)
    const message = "Hello, I want to contact you!";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    }
    catch (error) {
      console.error("Error sending SMS:", error);
      alert("Failed to send SMS");
    }
};

  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-indigo-600 to-purple-600 text-white p-6 shadow-xl rounded-tr-2xl rounded-br-2xl">
        <h2 className="text-2xl font-extrabold mb-8 flex items-center gap-2">Admin Panel</h2>
        <nav className="flex flex-col gap-4">
          <button
            onClick={() => setActiveSection("staffs")}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${activeSection === "staffs" ? "bg-white text-indigo-600 font-bold" : "hover:bg-white/20"
              }`}
          >
            <FaUser /> Staffs
          </button>
          <button
            onClick={() => setActiveSection("tasks")}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${activeSection === "tasks" ? "bg-white text-indigo-600 font-bold" : "hover:bg-white/20"
              }`}
          >
            <FaTasks /> Tasks
          </button>
          <button
            onClick={() => setActiveSection("notices")}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${activeSection === "notices" ? "bg-white text-indigo-600 font-bold" : "hover:bg-white/20"
              }`}
          >
            <FaBell /> Notices
          </button>

          <button
            onClick={() => setActiveSection("teams")}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${activeSection === "teams" ? "bg-white text-indigo-600 font-bold" : "hover:bg-white/20"
              }`}
          >
            <FaTasks /> teams
          </button>


          {/* Sidebar Buttons for Assign */}
          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={() => setShowAssignTaskModal(true)}
              className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600
                        text-white rounded-xl shadow-lg hover:scale-105
                        transition-all duration-300"
            >
              + Assign Task
            </button>
            <button
              onClick={() => setShowAddNoticeModal(true)}
              className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600
                          text-white rounded-xl shadow-lg hover:scale-105
                          transition-all duration-300"

            >
              + Add Notice
            </button>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('role');
              localStorage.removeItem('profileUrl');
              document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
              document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
              window.location.href = '/';
            }}
            className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white/20 mt-10"
          >
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 space-y-10">
        {/* STAFF SECTION */}
        {activeSection === "staffs" && (
          <section className="bg-white p-8 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-indigo-700 flex items-center gap-2">
                <FaUser /> Staffs
              </h2>
              <button
                onClick={() => setShowAddStaffModal(true)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add New Staff
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {["id", "name", "department"].map((key) => (
                <input
                  key={key}
                  type="text"
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={staffSearchForm[key]}
                  onChange={(e) => setStaffSearchForm({ ...staffSearchForm, [key]: e.target.value })}
                  className="p-4 border rounded-lg shadow-lg focus:ring-2 focus:ring-indigo-500"
                />
              ))}
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Actions</th>
                  <th className="p-3">Notify</th>
                </tr>
              </thead>

              <tbody>
                {filteredStaff.map((s) => (
                  <tr key={s.id} className="border-b hover:bg-gray-100">
                    <td className="p-3">{s.id}</td>
                    <td className="p-3">{s.name}</td>
                    <td className="p-3">{s.department}</td>
                    <td className="p-3">{s.email}</td>
                    <td className="p-3">{s.role}</td>
                    <td className="p-3 flex gap-2">
                      {currentUserRole === "superadmin" && (
                        <button
                          onClick={() => handleDeleteStaff(s.id)}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                    <td className="p-3">
                      <button onClick={() => sendSMS(s.phone)}>Send SMS</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}


        {activeSection === "teams" && (
          <section className="bg-white p-8 rounded-2xl shadow-xl max-w-xl">
            <h2 className="text-3xl font-bold text-indigo-700 mb-6">
              👥 Assign Task to Team Members
            </h2>

            {/* STAFF IDS */}
            <div className="space-y-3 mb-4">
              {teamTask.staffIds.map((id, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Staff ID (e.g. ST001)"
                    value={id}
                    onChange={(e) => handleStaffIdChange(index, e.target.value)}
                    className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />

                  {teamTask.staffIds.length > 1 && (
                    <button
                      onClick={() => removeStaffField(index)}
                      className="px-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* ADD MORE STAFF */}
            <button
              onClick={addStaffField}
              className="mb-6 text-sm text-indigo-600 font-semibold hover:underline"
            >
              + Add another staff
            </button>

            {/* TASK TITLE */}
            <input
              type="text"
              placeholder="Task Title"
              value={teamTask.title}
              onChange={(e) =>
                setTeamTask({ ...teamTask, title: e.target.value })
              }
              className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500"
            />

            {/* TASK DESCRIPTION */}
            <textarea
              placeholder="Task Description"
              value={teamTask.description}
              onChange={(e) =>
                setTeamTask({ ...teamTask, description: e.target.value })
              }
              className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500"
            />

            {/* SUBMIT */}
            <button
              onClick={handleAssignTeamTask}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Assign Task
            </button>

            {/* ASSIGNED TEAM TASKS LIST */}
            <div className="mt-10">
              <h3 className="text-xl font-bold text-gray-700 mb-4">
                📋 Assigned Team Tasks
              </h3>

              {assignedTeamTasks.length === 0 ? (
                <p className="text-gray-400">No tasks assigned yet</p>
              ) : (
                <div className="space-y-4">
                  {assignedTeamTasks.map((task) => (
                    <div
                      key={task.id}
                      className="border rounded-xl p-4 bg-gray-50 shadow-sm"
                    >
                      {/* HEADER */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-semibold text-indigo-700">
                            {task.title}
                          </h4>
                          <span className="text-xs text-gray-400">
                            {new Date(task.created_at).toLocaleString()}
                          </span>
                        </div>

                        {/* DELETE BUTTON */}
                        <button
                          onClick={() => handleDeleteAssignedTask(task.id)}
                          className="
                          px-3 py-1 text-sm rounded-lg
                          text-red-600 border border-red-300
                          hover:bg-red-600 hover:text-white
                          transition-all duration-200
                        "
                        >
                          Delete
                        </button>
                      </div>

                      {/* DESCRIPTION */}
                      <p className="text-gray-600 mt-3">{task.title_desc}</p>

                      {/* STAFF IDS */}
                      <div className="mt-3">
                        <span className="text-sm font-semibold text-gray-700">
                          Assigned To:
                        </span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {task.staff_id?.map((id, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full"
                            >
                              {id}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}


        {activeSection === "tasks" && (
          <section className="bg-white p-8 rounded-2xl shadow-xl">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold text-indigo-700 flex items-center gap-2">
                <FaTasks className="animate-pulse" /> Tasks Assigned To Staff Members
              </h2>

              <button
                onClick={() => setShowAssignTaskModal(true)}
                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600
                        text-white rounded-xl shadow-lg hover:scale-105
                        transition-all duration-300"
              >
                + Assign Task
              </button>
            </div>

            {/* TASK CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  style={{ animationDelay: `${index * 120}ms` }}
                  className="
                    group relative p-[2px] rounded-2xl
                    bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
                    animate-fadeIn
                "
                >
                  {/* INNER CARD */}
                  <div
                    className="
                    bg-white rounded-2xl p-6 h-full
                    transform transition-all duration-300
                    group-hover:-translate-y-2
                    group-hover:shadow-2xl
                    "
                  >
                    {/* PRIORITY BADGE */}
                    <div className="flex justify-between items-start mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide
                        ${task.Priority === "High"
                            ? "bg-red-100 text-red-600"
                            : task.Priority === "Medium"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-green-100 text-green-600"
                          }`}
                      >
                        {task.Priority} Priority
                      </span>

                      <span className="text-xs text-gray-400">
                        {new Date(task.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* TITLE */}
                    <h3 className="text-xl font-extrabold text-gray-800 mb-2
                                group-hover:text-indigo-600 transition">
                      {task.Task_title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-5">
                      {task.Task_desc}
                    </p>

                    {/* FOOTER */}
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-sm font-semibold text-gray-700">
                        Dept: <span className="uppercase">{task.dept}</span>
                      </span>

                      {currentUserRole === "superadmin" && (
                        <button
                          onClick={() => handleDeleteTasks(task.Task_title)}
                          className="
                            px-3 py-1 text-sm font-semibold rounded-lg
                            text-red-600 border border-red-300
                            hover:bg-red-600 hover:text-white
                            transition-all duration-300
                        "
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* EMPTY STATE */}
              {tasks.length === 0 && (
                <div className="col-span-full text-center py-16 text-gray-400">
                  No tasks found 🚫
                </div>
              )}
            </div>
          </section>
        )}

        {activeSection === "notices" && (
          <section className="bg-white p-8 rounded-2xl shadow-xl">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold text-indigo-700 flex items-center gap-2">
                📢 Notices For Tasks
              </h2>

              <button
                onClick={() => setShowAddNoticeModal(true)}
                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600
                          text-white rounded-xl shadow-lg hover:scale-105
                          transition-all duration-300"

              >
                + Add Notice
              </button>
            </div>

            {/* NOTICE CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {notices.map((notice, index) => (
                <div
                  key={notice.id}
                  style={{ animationDelay: `${index * 120}ms` }}
                  className="
                    group relative p-[2px] rounded-2xl
                    bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
                    animate-fadeIn
                  "
                >
                  {/* INNER CARD */}
                  <div
                    className="
                      bg-white rounded-2xl p-6 h-full
                      transform transition-all duration-300
                      group-hover:-translate-y-2
                      group-hover:shadow-2xl
                    "
                  >
                    {/* NOTICE TYPE */}
                    <div className="flex justify-between items-start mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide
                          ${notice.type === "Important"
                            ? "bg-red-100 text-red-600"
                            : notice.type === "Update"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-green-100 text-green-600"
                          }`}
                      >
                        {notice.type}
                      </span>

                      <span className="text-xs text-gray-400">
                        {new Date(notice.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* TITLE */}
                    <h3 className="text-xl font-extrabold text-gray-800 mb-2
                                  group-hover:text-indigo-600 transition">
                      {notice.title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-5">
                      {notice.description}
                    </p>

                    {/* FOOTER */}
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-sm font-semibold text-gray-700">
                        Dept: <span className="uppercase">{notice.dept}</span>
                      </span>

                      {currentUserRole === "superadmin" && (
                        <button
                          className="
                            px-3 py-1 text-sm font-semibold rounded-lg
                            text-red-600 border border-red-300
                            hover:bg-red-600 hover:text-white
                            transition-all duration-300
                          "
                          onClick={() => handleDeleteNotice(notice.title)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* EMPTY STATE */}
              {notices.length === 0 && (
                <div className="col-span-full text-center py-16 text-gray-400">
                  No notices available 🚫
                </div>
              )}
            </div>
          </section>
        )}



      </div>

      {/* ASSIGN TASK MODAL */}
      {showAssignTaskModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-96">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700 text-center">
              Assign Task
            </h2>

            {/* Task Title */}
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.Task_title || ""}
              onChange={(e) => setNewTask({ ...newTask, Task_title: e.target.value })}
              className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500"
            />

            {/* Task Description */}
            <textarea
              placeholder="Task Description"
              value={newTask.Task_desc || ""}
              onChange={(e) => setNewTask({ ...newTask, Task_desc: e.target.value })}
              className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500"
            />

            {/* Department */}
            <input
              type="text"
              placeholder="Department"
              value={newTask.dept || ""}
              onChange={(e) => setNewTask({ ...newTask, dept: e.target.value })}
              className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500"
            />
            {/* Priority */}
            <select
              value={newTask.Priority || ""}
              onChange={(e) => setNewTask({ ...newTask, Priority: e.target.value })}
              className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => setShowAssignTaskModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignTask}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ADD NOTICE MODAL */}
      {showAddNoticeModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 
                        flex items-center justify-center animate-fadeIn z-50">

          <div className="bg-white p-8 rounded-2xl shadow-2xl w-96
                          animate-scaleIn border-t-4 border-indigo-600">

            <h2 className="text-2xl font-bold mb-4 text-indigo-700 text-center">
              Add New Notice
            </h2>

            <form onSubmit={handleAddNotice} className="space-y-4">

              {/* TITLE */}
              <input
                type="text"
                placeholder="Notice Title"
                value={newNotice.title}
                onChange={(e) =>
                  setNewNotice({ ...newNotice, title: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 
                          focus:ring-indigo-500 outline-none transition-all"
                required
              />

              {/* DESCRIPTION */}
              <textarea
                placeholder="Notice Description"
                rows="3"
                value={newNotice.description}
                onChange={(e) =>
                  setNewNotice({ ...newNotice, description: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 
                          focus:ring-indigo-500 outline-none transition-all resize-none"
                required
              />

              {/* TYPE */}
              <select
                value={newNotice.type}
                onChange={(e) =>
                  setNewNotice({ ...newNotice, type: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 
                          focus:ring-indigo-500 outline-none transition-all"
              >
                <option value="General">General</option>
                <option value="Important">Important</option>
                <option value="Update">Update</option>
              </select>

              {/* DEPARTMENT */}
              <input
                type="text"
                placeholder="Department"
                value={newNotice.department}
                onChange={(e) =>
                  setNewNotice({ ...newNotice, department: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 
                          focus:ring-indigo-500 outline-none transition-all"
                required
              />

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddNoticeModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg 
                            hover:bg-gray-400 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg
                            hover:bg-indigo-700 shadow-md hover:shadow-lg
                            transition-all duration-300 active:scale-95"
                >
                  Add Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ADD STAFF MODAL */}
      {showAddStaffModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 
                            animate-scaleIn border-t-4 border-indigo-600">

            <h2 className="text-2xl font-bold mb-4 text-indigo-700 text-center">
              Add New Staff
            </h2>

            <form onSubmit={handleAddStaff} className="space-y-4">
              {[
                { label: "Staff ID", key: "id" },
                { label: "Name", key: "name" },
                { label: "Department", key: "department" },
                { label: "Email", key: "email" },
              ].map((field) => (
                <input
                  key={field.key}
                  type={field.type || "text"}
                  placeholder={field.label}
                  value={newStaff[field.key]}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, [field.key]: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 
                            outline-none transition-all duration-200"
                  required
                />
              ))}

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg 
                            hover:bg-indigo-700 shadow-md hover:shadow-lg 
                            transition-all duration-300 active:scale-95"
                >
                  Add
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
