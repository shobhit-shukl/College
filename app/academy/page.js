"use client";

import { useState, useEffect } from "react";
import Loader from "../Components/Loader";
import DownloadReportButton from "../Components/DownloadReportButton";


import {
    FaUser,
    FaEdit,
    FaTrash,
    FaBell,
    FaCalendarAlt,
    FaRegFileAlt,
    FaSignOutAlt,
} from "react-icons/fa";

import Pagination from "../Components/Pagination";


export default function AcademicPage() {
    const [activeSection, setActiveSection] = useState("students");

    // ===== STUDENT DATA =====
    const [students, setStudents] = useState([]);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10
    });

    const [loading, setLoading] = useState(true);

    // ===== SEARCH STATES (Moved Up) =====
    const [studentSearchForm, setStudentSearchForm] = useState({
        id: "",
        name: "",
        department: "",
        course: "",
        year: "",
        sem: "",
    });

    const [notices, setNotices] = useState([]);
    const [loadingNotices, setLoadingNotices] = useState(true);

    const [staff, setStaff] = useState([]);


    const handleAddNotice = async () => {
        if (!newNotice.title || !newNotice.description || !newNotice.date) {
            alert("Please fill all fields");
            return;
        }

        try {
            const res = await fetch("/api/notices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newNotice),
            });

            if (!res.ok) throw new Error("Failed to add notice");

            const added = await res.json();

            // UI update
            setNotices([...notices, added]);
            setShowAddModal(false);

            // Clear form
            setNewNotice({ title: "", description: "", date: "" });

        } catch (err) {
            console.error(err);
            alert("Error adding notice");
        }
    };


    const handleEditClick = (student) => {
        setEditStudent(student); // Pre-fill form
        setShowEditForm(true);
    };


    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/students", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editStudent),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update student");

            // Update local state
            setStudents((prev) =>
                prev.map((s) => (s.id === data.student.id ? data.student : s))
            );

            setShowEditForm(false);
        } catch (err) {
            console.error("Update error:", err);
            alert(err.message);
        }
    };

    async function handleAddStudent(e) {
        e.preventDefault();

        const res = await fetch("/api/students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newStudent),
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Error adding student");
            return;
        }

        alert("Student Added Successfully!");

        // Reset form
        setNewStudent({
            student_id: "",
            name: "",
            course: "",
            department: "",
            year: "",
            semester: "",
        });

        setShowAddForm(false);

        // Refresh students
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const updated = await fetch("/api/students", {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });
        const refreshedData = await updated.json();
        setStudents(Array.isArray(refreshedData) ? refreshedData : []);
    }

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowDeleteConfirm(true);
    };


    const handleConfirmDelete = async () => {
        try {
            const res = await fetch("/api/students", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: deleteId }),
            });

            if (!res.ok) throw new Error("Failed to delete");

            // Remove deleted student from state
            setStudents((prev) => prev.filter((s) => s.id !== deleteId));

            setShowDeleteConfirm(false);
            setDeleteId(null);
        } catch (err) {
            console.error(err);
            alert("Error deleting student");
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
        setDeleteId(null);
    };

    const handleDeleteNotice = async (id) => {
        const confirmDelete = window.confirm("Delete this notice?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`/api/notices`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }), // send id in body
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Failed to delete");
                return;
            }

            // Remove from UI
            setNotices(prev => prev.filter(n => n.id !== id));

            alert("Notice deleted successfully!");
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
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

            // Refresh staff list
            const updated = await fetch("/api/staff").then((r) => r.json());
            setStaff(updated);

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

    const [staffSearchForm, setStaffSearchForm] = useState({
        id: "",
        name: "",
        department: "",
        email: "",
    });




    const [staffList, setStaffList] = useState([]); // ✅ add this
    const StaffSection = () => {
        const [staffSearchForm, setStaffSearchForm] = useState({
            id: "",
            name: "",
            department: "",
            email: "",
        });
    }

    useEffect(() => {
        const fetchStaff = async () => {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            const res = await fetch("/api/staff", {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });
            const data = await res.json();
            setStaffList(data);
        };
        fetchStaff();
    }, []);

    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        fetch("/api/staff", {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        })
            .then((res) => res.json())
            .then((data) => setStaff(data))
            .catch((err) => console.error("Error:", err));
    }, []);


    const fetchStudents = async (page = 1) => {
        setLoading(true);
        try {
            // Build Query Params
            const params = new URLSearchParams();
            params.append('page', page);
            params.append('limit', '10');

            // Append Search Fields
            Object.entries(studentSearchForm).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            const res = await fetch(`/api/students?${params.toString()}`, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });
            const data = await res.json();

            if (data.pagination) {
                setStudents(data.data);
                setPagination(data.pagination);
            } else {
                setStudents(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error("Failed to fetch students:", err);
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    // Debounce Search & Pagination Effect
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchStudents(pagination.currentPage);
        }, 500); // 500ms debounce
        return () => clearTimeout(timer);
    }, [studentSearchForm, pagination.currentPage]);


    useEffect(() => {
        async function fetchNotices() {
            setLoadingNotices(true);
            try {
                const res = await fetch("/api/notices"); // yeh route aapko banaana hoga
                const data = await res.json();
                setNotices(data);
            } catch (err) {
                console.error("Failed to fetch notices:", err);
            } finally {
                setLoadingNotices(false);
            }
        }
        fetchNotices();
    }, []);


    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);




    const [showAddModal, setShowAddModal] = useState(false);
    const [newNotice, setNewNotice] = useState({
        title: "",
        description: "",
        date: ""
    });

    // Show Edit Modal
    const [showEditForm, setShowEditForm] = useState(false);

    // Current student to edit
    const [editStudent, setEditStudent] = useState({
        id: "",
        student_id: "",
        name: "",
        course: "",
        department: "",
        year: "",
        semester: "",
    });


    const [showAddStaffModal, setShowAddStaffModal] = useState(false);

    const [newStaff, setNewStaff] = useState({
        id: "",
        name: "",
        department: "",
        email: ""
    });



    // ===== ADD STUDENT MODAL =====
    const [showAddForm, setShowAddForm] = useState(false);

    const [newStudent, setNewStudent] = useState({
        student_id: "",
        name: "",
        course: "",
        department: "",
        year: "",
        semester: "",
    });



    const [timetables] = useState([
        { id: 1, course: "B.Tech", department: "CS", file: "timetable_sem4.pdf" },
        { id: 2, course: "B.Tech", department: "ME", file: "timetable_sem6.pdf" },
    ]);



    // ===== FILTER STUDENTS (Server Side) =====
    const filteredStudents = students;

    // ===== FILTER STAFF =====
    const filteredStaff = Array.isArray(staff)
        ? staff.filter((s) =>
            s.id?.toLowerCase().includes(staffSearchForm.id.toLowerCase()) &&
            s.name?.toLowerCase().includes(staffSearchForm.name.toLowerCase()) &&
            s.department?.toLowerCase().includes(staffSearchForm.department.toLowerCase()) &&
            s.email?.toLowerCase().includes(staffSearchForm.email.toLowerCase())
        )
        : [];







    return (
        <div className="min-h-screen flex bg-gray-100 font-sans">

            {/* Sidebar */}
            <div className="w-64 bg-gradient-to-b from-indigo-600 to-purple-600 text-white p-6 shadow-xl rounded-tr-2xl rounded-br-2xl">
                <h2 className="text-2xl font-extrabold mb-8 flex items-center gap-2">Admin Panel</h2>
                <nav className="flex flex-col gap-4">
                    <button
                        onClick={() => setActiveSection("students")}
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${activeSection === "students" ? "bg-white text-indigo-600 font-bold" : "hover:bg-white/20"
                            }`}
                    >
                        <FaUser /> Students
                    </button>

                    <button
                        onClick={() => setActiveSection("notices")}
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${activeSection === "notices" ? "bg-white text-indigo-600 font-bold" : "hover:bg-white/20"
                            }`}
                    >
                        <FaBell /> Notices
                    </button>

                    <button
                        onClick={() => setActiveSection("timetables")}
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${activeSection === "timetables" ? "bg-white text-indigo-600 font-bold" : "hover:bg-white/20"
                            }`}
                    >
                        <FaCalendarAlt /> Timetables
                    </button>

                    <button
                        onClick={() => setActiveSection("staff")}
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${activeSection === "staff" ? "bg-white text-indigo-600 font-bold" : "hover:bg-white/20"
                            }`}
                    >
                        <FaRegFileAlt /> Staff
                    </button>

                    <button className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white/20 mt-10">
                        <FaSignOutAlt /> Logout
                    </button>
                </nav>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 p-8 space-y-10">

                {/* STUDENTS SECTION */}
                {activeSection === "students" && (
                    <section className="bg-white p-8 rounded-2xl shadow-xl">
                        <h2 className="text-3xl font-bold mb-6 text-indigo-700 flex items-center gap-2">
                            <FaUser /> Students
                        </h2>

                        {/* SEARCH + ADD BUTTON */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {[
                                { placeholder: "Student ID", key: "id" },
                                { placeholder: "Name", key: "name" },
                                { placeholder: "Department", key: "department" },
                                { placeholder: "Course", key: "course" },
                                { placeholder: "Year", key: "year", type: "number" },
                                { placeholder: "Semester", key: "sem", type: "number" },
                            ].map((field) => (
                                <input
                                    key={field.key}
                                    type={field.type || "text"}
                                    placeholder={field.placeholder}
                                    value={studentSearchForm[field.key]}
                                    onChange={(e) =>
                                        setStudentSearchForm({ ...studentSearchForm, [field.key]: e.target.value })
                                    }
                                    className="p-4 border rounded-lg shadow-lg focus:ring-2 focus:ring-indigo-500"
                                />
                            ))}

                            <button
                                onClick={() => setShowAddForm(true)}
                                className="px-5 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg 
                        hover:bg-indigo-700 hover:shadow-xl active:scale-95 transition-all duration-300"
                            >
                                ➕ Add Student
                            </button>
                            <DownloadReportButton
                                apiEndpoint="/api/students"
                                filters={studentSearchForm}
                                fileName="Students_Report"
                                className="h-full"
                            />

                        </div>

                        {/* STUDENT TABLE */}
                        {loading ? (
                            <Loader />
                        ) : (
                            <>
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="p-3">ID</th>
                                            <th className="p-3">Name</th>
                                            <th className="p-3">Course</th>
                                            <th className="p-3">Department</th>
                                            <th className="p-3">Year</th>
                                            <th className="p-3">Semester</th>
                                            <th className="p-3">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredStudents.map((s) => (
                                            <tr key={s.student_id} className="border-b hover:bg-gray-100">
                                                <td className="p-3">{s.student_id}</td>
                                                <td className="p-3">{s.name}</td>
                                                <td className="p-3">{s.course}</td>
                                                <td className="p-3">{s.department}</td>
                                                <td className="p-3">{s.year}</td>
                                                <td className="p-3">{s.semester}</td>

                                                <td className="p-3 flex gap-5">
                                                    <button
                                                        onClick={() => handleEditClick(s)}
                                                        className="flex items-center gap-1 text-blue-600 font-semibold group transition-all duration-300"
                                                    >
                                                        <FaEdit className="text-lg transform group-hover:scale-110 group-hover:rotate-3 transition" />
                                                        <span className="group-hover:translate-x-1 transition">Edit</span>
                                                    </button>

                                                    <button
                                                        onClick={() => handleDeleteClick(s.id)}
                                                        className="flex items-center gap-1 text-red-600 font-semibold group transition-all duration-300"
                                                    >
                                                        <FaTrash className="text-lg transform group-hover:scale-110 group-hover:-rotate-3 transition" />
                                                        <span className="group-hover:translate-x-1 transition">Delete</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}

                                        {filteredStudents.length === 0 && (
                                            <tr>
                                                <td colSpan="7" className="text-center p-4 text-gray-500">
                                                    No students found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                {/* Pagination */}
                                <div className="mt-6 flex justify-center">
                                    {students.length > 0 && pagination.totalPages > 1 && (
                                        <Pagination
                                            currentPage={pagination.currentPage}
                                            totalPages={pagination.totalPages}
                                            totalItems={pagination.totalItems}
                                            itemsPerPage={pagination.itemsPerPage}
                                            onPageChange={(page) => fetchStudents(page)}
                                        />
                                    )}
                                </div>
                            </>
                        )}



                        {showEditForm && (
                            <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center animate-fadeIn">
                                <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 animate-scaleIn border-t-4 border-indigo-600">
                                    <h2 className="text-2xl font-bold mb-4 text-indigo-700 text-center">
                                        Edit Student
                                    </h2>

                                    <form onSubmit={handleUpdateStudent} className="space-y-4">
                                        {[
                                            { label: "Student ID", key: "student_id" },
                                            { label: "Name", key: "name" },
                                            { label: "Course", key: "course" },
                                            { label: "Department", key: "department" },
                                            { label: "Year", key: "year", type: "number" },
                                            { label: "Semester", key: "semester", type: "number" },
                                        ].map((field) => (
                                            <input
                                                key={field.key}
                                                type={field.type || "text"}
                                                placeholder={field.label}
                                                value={editStudent[field.key]}
                                                onChange={(e) =>
                                                    setEditStudent({ ...editStudent, [field.key]: e.target.value })
                                                }
                                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 
                                  outline-none transition-all duration-200"
                                                required
                                            />
                                        ))}

                                        <div className="flex justify-end gap-3 mt-4">
                                            <button
                                                type="button"
                                                onClick={() => setShowEditForm(false)}
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
                                                Update
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}


                    </section>
                )}




                {/* NOTICES */}
                {activeSection === "notices" && (
                    <section className="bg-white p-8 rounded-2xl shadow-xl relative">
                        {/* Header with Add Notice Button */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-indigo-700 flex items-center gap-2">
                                <FaBell /> Notices
                            </h2>
                            <button
                                className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
                                onClick={() => setShowAddModal(true)}
                            >
                                Add Notice
                            </button>

                        </div>

                        {loadingNotices ? (
                            <Loader /> // Aapka loader component
                        ) : (
                            notices.length > 0 ? (
                                notices.map((n) => (
                                    <div
                                        key={n.id}
                                        className="border-l-4 border-indigo-500 bg-gray-50 p-4 rounded-xl mb-4 shadow-sm flex justify-between items-center"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FaRegFileAlt className="text-indigo-500" />
                                            <div>
                                                <h3 className="text-xl font-semibold">{n.title}</h3>
                                                <p className="text-gray-600">{n.description}</p>
                                            </div>
                                        </div>
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                                            onClick={() => handleDeleteNotice(n.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center">No notices found.</p>
                            )
                        )}
                    </section>
                )}


                {/* TIMETABLES */}
                {activeSection === "timetables" && (
                    <section className="bg-white p-8 rounded-2xl shadow-xl">
                        <h2 className="text-3xl font-bold mb-6 text-indigo-700 flex items-center gap-2">
                            <FaCalendarAlt /> Timetables
                        </h2>

                        {timetables.map((t) => (
                            <div
                                key={t.id}
                                className="bg-gray-50 p-4 rounded-xl shadow mb-4 flex items-center gap-3"
                            >
                                <FaRegFileAlt className="text-indigo-500" />
                                <div>
                                    <p><strong>Course:</strong> {t.course}</p>
                                    <p><strong>Department:</strong> {t.department}</p>
                                    <p><strong>File:</strong> {t.file}</p>
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                {/* STAFF */}
                {activeSection === "staff" && (
                    <section className="bg-white p-8 rounded-2xl shadow-xl">
                        <h2 className="text-3xl font-bold mb-6 text-indigo-700 flex items-center gap-2">
                            <FaRegFileAlt /> Staff
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {[
                                { placeholder: "Staff ID", key: "id" },
                                { placeholder: "Name", key: "name" },
                                { placeholder: "Department", key: "department" },
                                { placeholder: "Email", key: "email" },
                            ].map((field) => (
                                <input
                                    key={field.key}
                                    type="text"
                                    placeholder={field.placeholder}
                                    value={staffSearchForm[field.key]}
                                    onChange={(e) =>
                                        setStaffSearchForm({ ...staffSearchForm, [field.key]: e.target.value })
                                    }
                                    className="p-4 border rounded-lg shadow-lg focus:ring-2 focus:ring-indigo-500"
                                />



                            ))}

                            <button
                                onClick={() => setShowAddStaffModal(true)}
                                className="mb-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
                            >
                                + Add Staff
                            </button>
                            <DownloadReportButton
                                apiEndpoint="/api/staff"
                                filters={staffSearchForm}
                                fileName="Staff_Report"
                                className="mb-6 h-[50px]"
                            />

                        </div>

                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Department</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredStaff.map((s) => (
                                    <tr key={s.id} className="border-b hover:bg-gray-100">
                                        <td className="p-3">{s.id}</td>
                                        <td className="p-3">{s.name}</td>
                                        <td className="p-3">{s.department}</td>
                                        <td className="p-3">{s.email}</td>

                                        <td className="p-3 flex gap-5">
                                            <button
                                                onClick={() => handleDeleteStaff(s.id)}
                                                className="flex items-center gap-1 text-red-600 font-semibold group transition-all duration-300"
                                            >
                                                <FaTrash className="text-lg transform group-hover:scale-110 group-hover:-rotate-3 transition" />
                                                <span className="group-hover:translate-x-1 transition">Delete</span>
                                            </button>



                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                )}



            </div>

            {/* ADD STUDENT MODAL */}
            {
                showAddForm && (
                    <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center animate-fadeIn">

                        <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 
                    animate-scaleIn border-t-4 border-indigo-600">

                            <h2 className="text-2xl font-bold mb-4 text-indigo-700 text-center">
                                Add New Student
                            </h2>

                            <form onSubmit={handleAddStudent} className="space-y-4">
                                {[
                                    { label: "Student ID", key: "student_id" },
                                    { label: "Name", key: "name" },
                                    { label: "Course", key: "course" },
                                    { label: "Department", key: "department" },
                                    { label: "Year", key: "year", type: "number" },
                                    { label: "Semester", key: "semester", type: "number" },
                                ].map((field) => (
                                    <input
                                        key={field.key}
                                        type={field.type || "text"}
                                        placeholder={field.label}
                                        value={newStudent[field.key]}
                                        onChange={(e) =>
                                            setNewStudent({ ...newStudent, [field.key]: e.target.value })
                                        }
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 
                       outline-none transition-all duration-200"
                                        required
                                    />
                                ))}

                                <div className="flex justify-end gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddForm(false)}
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
                )
            }


            {
                showAddModal && (
                    <div className="fixed inset-0 animate-[popupScale_0.25s_ease-out] bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
                        <div
                            className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl animate-[popupScale_0.25s_ease-out]"
                        >
                            <h2 className="text-3xl font-bold mb-6 text-indigo-700 text-center">
                                Add New Notice
                            </h2>

                            {/* Title */}
                            <div className="mb-4">
                                <label className="text-gray-700 font-semibold">Title</label>
                                <input
                                    type="text"
                                    placeholder="Enter notice title..."
                                    className="w-full mt-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    value={newNotice.title}
                                    onChange={(e) =>
                                        setNewNotice({ ...newNotice, title: e.target.value })
                                    }
                                />
                            </div>

                            {/* Description */}
                            <div className="mb-4">
                                <label className="text-gray-700 font-semibold">Description</label>
                                <textarea
                                    placeholder="Write notice description..."
                                    rows={4}
                                    className="w-full mt-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    value={newNotice.description}
                                    onChange={(e) =>
                                        setNewNotice({ ...newNotice, description: e.target.value })
                                    }
                                ></textarea>
                            </div>

                            {/* Date */}
                            <div className="mb-6">
                                <label className="text-gray-700 font-semibold">Date</label>
                                <input
                                    type="date"
                                    className="w-full mt-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    value={newNotice.date}
                                    onChange={(e) =>
                                        setNewNotice({ ...newNotice, date: e.target.value })
                                    }
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition font-semibold"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleAddNotice}
                                    className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-semibold shadow-md"
                                >
                                    Add Notice
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }






            {
                showAddStaffModal && (
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
                )
            }



        </div >
    );
}








