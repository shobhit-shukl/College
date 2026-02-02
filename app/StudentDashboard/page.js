"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FaBook } from "react-icons/fa";

import {
  FaUser,
  FaBell,
  FaCalendarAlt,
  FaEdit,
  FaSignOutAlt,
  FaGraduationCap,
  FaRegFileAlt,
  FaFileUpload,
  FaMoneyBillWave,
  FaCheckCircle,
  FaPrint,
  FaTrash,
  FaPlus,
} from "react-icons/fa";

import { FaBed } from "react-icons/fa";
export default function StudentDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StudentDashboardContent />
    </Suspense>
  );
}

function StudentDashboardContent() {
  const [activeSection, setActiveSection] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("student_id");

  const [student, setStudent] = useState([]);
  const [notice, setnotice] = useState([]);
  const [results, setresults] = useState([]);
  const [attendance, setattendance] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [loadingTimetables, setLoadingTimetables] = useState(false);
  const [hostelData, setHostelData] = useState(null);
  const [loadingHostel, setLoadingHostel] = useState(false);
  const [complaintForm, setComplaintForm] = useState({
    name: "",
    complaint_title: "",
    complaint_desc: "",
  });

  const [complaintStatus, setComplaintStatus] = useState(null);
  const [submittingComplaint, setSubmittingComplaint] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(false);




  const student_details = student[0];
  const student_course = student_details?.course || "";
  const student_id = student_details?.student_id || "";
  const student_department = student_details?.department || "";



  const defaultHostelFacilities = [
    "24×7 Security",
    "Wi-Fi Facility",
    "Mess & Dining",
    "Power Backup",
    "Laundry Service",
    "Housekeeping",
    "Drinking Water",
    "CCTV Surveillance",
  ];




  const submitComplaint = async () => {
    if (!complaintForm.name || !complaintForm.complaint_title || !complaintForm.complaint_desc) {
      alert("Please fill all fields");
      return;
    }

    try {
      setSubmittingComplaint(true);

      const res = await fetch("/api/HostelComplaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(typeof window !== "undefined" &&
            localStorage.getItem("token")
            ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
            : {}),
        },
        body: JSON.stringify({
          name: complaintForm.name,
          complaint_title: complaintForm.complaint_title,
          complaint_desc: complaintForm.complaint_desc,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setComplaintStatus("success");
      setComplaintForm({
        name: "",
        complaint_title: "",
        complaint_desc: "",
      });

    } catch (err) {
      console.error(err);
      setComplaintStatus("error");
    } finally {
      setSubmittingComplaint(false);
    }
  };


  //for student-details
  useEffect(() => {
    if (!id) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    fetch("/api/AuthStudents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ id }),
    })
      .then(async (res) => {
        const body = await res.json().catch(() => null);
        if (!res.ok) throw new Error((body && body.error) || "Failed");
        return body;
      })
      .then((data) => setStudent(data))
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    setMounted(true);
  }, []);

  //for notices
  useEffect(() => {
    if (!student_course) return;

    fetch("/api/StudentsNotice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(typeof window !== "undefined" && localStorage.getItem("token") ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {}),
      },
      body: JSON.stringify({ student_course }),
    })
      .then((res) => res.json())
      .then((data) => setnotice(data))
      .catch((err) => console.error(err));
  }, [student_course]);


  useEffect(() => {
    if (!student_id) return;

    fetch("/api/StudentsCGPA", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(typeof window !== "undefined" && localStorage.getItem("token") ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {}),
      },
      body: JSON.stringify({ student_id }),
    })
      .then((res) => res.json())
      .then((data) => setresults(data))
      .catch((err) => console.error(err));
  }, [student_id]);

  console.log(results);


  useEffect(() => {
    if (!student_id) return;

    fetch("/api/StudentAttendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(typeof window !== "undefined" && localStorage.getItem("token") ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {}),
      },
      body: JSON.stringify({ student_id }),
    })
      .then((res) => res.json())
      .then((data) => setattendance(data))
      .catch((err) => console.error(err));
  }, [student_id]);


  useEffect(() => {
    if (!student_id) return;

    fetch("/api/Issued-books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(typeof window !== "undefined" && localStorage.getItem("token") ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {}),
      },
      body: JSON.stringify({ student_id }),
    })
      .then((res) => res.json())
      .then((data) => setIssuedBooks(data))
      .catch((err) => console.error(err));
  }, [student_id]);

  useEffect(() => {
    if (!student_department) return;

    setLoadingTimetables(true);

    fetch(
      `/api/timetable?department=${encodeURIComponent(
        student_department
      )}&timetable_type=student`
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
  }, [student_department]);


  useEffect(() => {
    if (!student_id) return;

    setLoadingHostel(true);

    fetch("/api/HostelProfile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(typeof window !== "undefined" &&
          localStorage.getItem("token")
          ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
          : {}),
      },
      body: JSON.stringify({ student_id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setHostelData(data);
      })
      .catch((err) => {
        console.error("Failed to fetch hostel profile data", err);
      })
      .finally(() => {
        setLoadingHostel(false);
      });
  }, [student_id]);

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoadingComplaints(true);
      try {
        const res = await fetch(`/api/HostelComplaints`); // no student_id param
        const data = await res.json();
        setComplaints(data);
      } catch (err) {
        console.error("Failed to fetch complaints", err);
      } finally {
        setLoadingComplaints(false);
      }
    };

    fetchComplaints();
  }, []); // empty dependency: run once on mount




  const [examForm, setExamForm] = useState({
    personalDetails: { name: "", fatherName: "", motherName: "", dob: "" },
    profilePhoto: null,
    signature: null,
    subjects: [{ code: "", name: "" }],
    paymentDone: false,
  });

  // ===== IMAGE UPLOAD HANDLERS =====
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result;
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch("/api/upload-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ id, role: localStorage.getItem("role") || "student", image: dataUrl }),
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || "Upload failed");

        const url = body.url;
        setStudent((prev) => {
          if (Array.isArray(prev) && prev.length) {
            const copy = [...prev];
            copy[0] = { ...copy[0], image: url, profileUrl: url };
            return copy;
          }
          return { ...(prev || {}), image: url, profileUrl: url };
        });
      } catch (err) {
        console.error("Upload failed", err);
        alert("Image upload failed");
      }
    };
    reader.readAsDataURL(file);
  };

  const profileSrc = (Array.isArray(student) ? student[0]?.profileUrl || student[0]?.image : student?.profileUrl || student?.image) || "";

  const handleExamFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setExamForm((prev) => ({
        ...prev,
        [type]: reader.result,
      }));
      alert(`${type === "profilePhoto" ? "Profile Photo" : "Signature"} uploaded successfully!`);
    };
    reader.readAsDataURL(file);
  };

  const addSubject = () =>
    setExamForm({ ...examForm, subjects: [...examForm.subjects, { code: "", name: "" }] });

  const updateSubject = (idx, key, value) => {
    const updated = [...examForm.subjects];
    updated[idx][key] = value;
    setExamForm({ ...examForm, subjects: updated });
  };

  const handlePayment = () => setExamForm({ ...examForm, paymentDone: true });
  const printForm = () => window.print();

  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-indigo-600 to-purple-600 text-white p-6 shadow-xl rounded-tr-2xl rounded-br-2xl">
        <h2 className="text-2xl font-extrabold mb-8 flex items-center gap-2">
          <FaGraduationCap /> Student Panel
        </h2>

        <nav className="flex flex-col gap-4">
          {[
            { name: "profile", icon: <FaUser />, label: "Profile" },
            { name: "notices", icon: <FaBell />, label: "Notices" },
            { name: "timetable", icon: <FaCalendarAlt />, label: "Timetables" },
            { name: "result", icon: <FaRegFileAlt />, label: "Result" },
            { name: "attendance", icon: <FaRegFileAlt />, label: "Attendance" },
            { name: "examForm", icon: <FaFileUpload />, label: "Examination Form" },
            { name: "hostel", icon: <FaBed />, label: "Hostel" },
            { name: "books", icon: <FaBook />, label: "Books Issued" }
          ].map((btn) => (
            <button
              key={btn.name}
              onClick={() => setActiveSection(btn.name)}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${activeSection === btn.name ? "bg-white text-indigo-600 font-bold" : "hover:bg-white/20"
                }`}
            >
              {btn.icon} {btn.label}
            </button>
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
            className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white/20 mt-10"
          >
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 space-y-10">
        {/* PROFILE */}
        {activeSection === "profile" && (
          <section className="bg-white p-8 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold mb-6 text-indigo-700 flex items-center gap-2">
              <FaUser /> My Profile
            </h2>
            <div className="flex items-center gap-8 mb-6">
              {mounted ? (
                <img
                  src={profileSrc || "/uploads/default-avatar.png"}
                  alt="Profile photo"
                  className="w-32 h-32 rounded-full shadow-lg object-cover border-4 border-indigo-500"
                />
              ) : (
                <div className="w-32 h-32 rounded-full shadow-lg bg-gray-100 border-4 border-indigo-500" />
              )}
              <div>
                <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2">
                  <FaEdit /> Change Photo
                  <input type="file" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: student_details?.name || "", disabled: !editing },
                { value: student_details?.student_id || "", disabled: true },
                { value: student_details?.course || "", disabled: true },
                { value: student_details?.department || "", disabled: true },
                { value: student_details?.year || "", disabled: true },
                { value: student_details?.semester || "", disabled: true },
              ].map((field, idx) => (
                <input
                  key={idx}
                  value={field.value}
                  disabled={field.disabled}
                  onChange={(e) => setStudent({ ...student, name: e.target.value })}
                  className="p-4 border rounded-lg shadow-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              ))}
            </div>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-500 transition flex items-center gap-2"
              >
                <FaEdit /> Edit Profile
              </button>
            ) : (
              <button
                onClick={() => setEditing(false)}
                className="mt-6 px-6 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-500 transition flex items-center gap-2"
              >
                <FaEdit /> Save Changes
              </button>
            )}
          </section>
        )}

        {/* NOTICES */}
        {activeSection === "notices" && (
          <section className="bg-white p-8 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold mb-6 text-indigo-700 flex items-center gap-2">
              <FaBell /> Notices
            </h2>
            {notice.map((n) => (
              <div
                key={n?.id}
                className="border-l-4 border-indigo-500 bg-gray-50 p-4 rounded-xl mb-4 shadow-sm flex items-center gap-3"
              >
                <FaRegFileAlt className="text-indigo-500" />
                <div>
                  <h3 className="text-xl font-semibold">{n?.title}</h3>
                  <p className="text-gray-600">{n?.description}</p>
                </div>
              </div>
            ))}
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


        {/* RESULT */}
      {activeSection === "result" && (
        <section className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 
                            p-10 rounded-3xl shadow-2xl animate-fadeIn">

          <h2 className="text-4xl font-extrabold mb-10 text-indigo-800 flex items-center gap-3">
            <FaRegFileAlt /> Student Performance
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {results.map((r, index) => {
              const percentage = (r?.CGPA / 10) * 100; // Adjusted for 10-point scale
              const isPass = r?.CGPA >= 4; // Assuming pass >= 4

              return (
                <div
                  key={r?.id}
                  className="relative bg-white/70 backdrop-blur-xl 
                            rounded-3xl p-7 shadow-xl
                            transition-all duration-500
                            hover:-translate-y-2 hover:shadow-2xl
                            animate-slideUp"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {/* Rank Badge */}
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-200 to-orange-200 
                                  text-black px-4 py-2 rounded-2xl text-sm font-bold shadow-lg">
                    🏆 Rank #{r?.Rank ?? "--"}
                  </div>

                  {/* Header */}
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Student ID
                      </p>
                      <p className="text-lg font-bold text-gray-800">
                        {r?.Student_id}
                      </p>
                    </div>

                    {/* Status */}
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-semibold
                      ${isPass
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"}`}
                    >
                      {isPass ? "PASS" : "FAIL"}
                    </span>
                  </div>

                  {/* Score Ring */}
                  <div className="flex items-center gap-6 mb-6">
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="url(#grad)"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={251}
                          strokeDashoffset={251 - (251 * percentage) / 100}
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                        />
                        <defs>
                          <linearGradient id="grad">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#a855f7" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-extrabold text-indigo-700">
                        {r?.CGPA}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">CGPA</p>
                      <p className="text-xl font-bold text-gray-800">
                        {percentage.toFixed(0)}%
                      </p>
                      {r?.CGPA >= 7.5 && (
                        <p className="text-sm font-semibold text-purple-600">
                          ⭐ Honors
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Year & Semester */}
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1 bg-indigo-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-indigo-500">YEAR</p>
                      <p className="font-bold text-indigo-700">{r?.Year}</p>
                    </div>

                    <div className="flex-1 bg-purple-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-purple-500">SEMESTER</p>
                      <p className="font-bold text-purple-700">{r?.semester}</p>
                    </div>
                  </div>

                  {/* Subjects and Marks */}
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Subjects & Marks</p>
                    {r?.subjects.map((sub, i) => (
                      <div key={i} className="flex justify-between bg-gray-50 rounded-lg p-2 mb-1">
                        <span className="font-medium text-gray-700">{sub}</span>
                        <span className="font-bold text-gray-900">
                          {r?.marks[i]} / {r?.total_marks[i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

        {/* BOOKS ISSUED */}
        {activeSection === "books" && (
          <section className="bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 
                      p-10 rounded-3xl shadow-2xl animate-fadeIn">

            <h2 className="text-4xl font-extrabold mb-10 text-orange-800 flex items-center gap-3">
              📚 Books Issued
            </h2>

            {issuedBooks.length === 0 ? (
              <p className="text-gray-600 text-lg">No books issued.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {issuedBooks.map((book, index) => {
                  const issueDate = new Date(book.created_at).toLocaleDateString();
                  const returnDate = book.return_date
                    ? new Date(book.return_date).toLocaleDateString()
                    : "Not Assigned";

                  return (
                    <div
                      key={book.id}
                      className="relative bg-white/80 backdrop-blur-xl 
                         rounded-3xl p-7 shadow-xl
                         hover:-translate-y-2 hover:shadow-2xl
                         transition-all duration-500"
                    >
                      {/* Status Badge */}
                      <div
                        className={`absolute -top-4 -right-4 px-4 py-2 rounded-2xl 
                  text-sm font-bold shadow-lg text-white
                  ${book.returned ? "bg-green-500" : "bg-red-500"}`}
                      >
                        {book.returned ? "RETURNED" : "ISSUED"}
                      </div>

                      {/* Book Info */}
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">
                        {book.book_name ?? "Book Name"}
                      </h3>

                      <div className="space-y-2 text-gray-700 text-sm">
                        <p><strong>Book ID:</strong> {book.book_id}</p>
                        <p><strong>Author:</strong> {book.author ?? "—"}</p>
                        <p><strong>Issued By (Staff):</strong> {book.staff_id}</p>
                        <p><strong>Issue Date:</strong> {book.created_at}</p>
                        <p><strong>Return Date:</strong> {returnDate || "not specified"}</p>
                      </div>

                      {/* Overdue Warning */}
                      {!book.returned && book.return_date && (
                        new Date(book.return_date) < new Date() && (
                          <div className="mt-4 px-4 py-2 bg-red-100 text-red-700 
                                  rounded-xl font-semibold text-sm">
                            ⚠ Overdue – Please return the book else fine will be charged
                          </div>
                        )
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ---------------- HOSTEL ---------------- */}
        {activeSection === "hostel" && (
          <section className="bg-white p-8 rounded-xl shadow max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-indigo-700 mb-6">
              🏨 Hostel Information
            </h2>

            {/* Loading */}
            {loadingHostel && (
              <div className="text-center py-12 text-gray-500 animate-pulse">
                Fetching hostel details...
              </div>
            )}

            {/* No Hostel Data */}
            {!loadingHostel && !hostelData && (
              <div className="text-center py-14 bg-gray-50 rounded-xl border">
                <p className="text-2xl font-bold text-gray-700">
                  🚫 You are not a hostel student
                </p>
                <p className="text-gray-500 mt-2">
                  No hostel record is associated with your student ID.
                </p>
              </div>
            )}

            {/* Hostel Data Found */}
            {!loadingHostel && hostelData && (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <InfoBox label="Hostel Name" value={hostelData.hostel_name || "Maya Devi Hostel"} />
                  <InfoBox label="Room Number" value={hostelData.RoomNo || "—"} />
                  <InfoBox label="Block" value={hostelData.block || "Boys Hostel"} />
                  <InfoBox label="Fee Status" value={hostelData.fee_status} />
                  <InfoBox label="Warden" value={hostelData.warden || "Mr. Sharma"} />
                  <InfoBox label="Contact" value={hostelData.contact || "—"} />
                </div>

                <div className="mt-10">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Facilities
                  </h3>

                  <ul className="grid md:grid-cols-2 gap-3">
                    {(hostelData.facilities && hostelData.facilities.length
                      ? hostelData.facilities
                      : defaultHostelFacilities
                    ).map((f, i) => (
                      <li
                        key={i}
                        className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium"
                      >
                        ✔ {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ================= HOSTEL COMPLAINT ================= */}
                <div className="mt-14 border-t pt-10">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    🛠️ Raise a Hostel Complaint
                  </h3>

                  <div className="bg-gray-50 p-6 rounded-xl border max-w-2xl">
                    <Input
                      label="Your Name"
                      value={complaintForm.name}
                      onChange={(e) =>
                        setComplaintForm({ ...complaintForm, name: e.target.value })
                      }
                    />

                    <Input
                      label="Complaint Title"
                      value={complaintForm.complaint_title}
                      onChange={(e) =>
                        setComplaintForm({ ...complaintForm, complaint_title: e.target.value })
                      }
                    />

                    <div className="mb-4">
                      <label className="block text-sm font-semibold mb-1">
                        Complaint Description
                      </label>
                      <textarea
                        className="w-full p-3 border rounded resize-y"
                        rows="4"
                        value={complaintForm.complaint_desc}
                        onChange={(e) =>
                          setComplaintForm({ ...complaintForm, complaint_desc: e.target.value })
                        }
                      />
                    </div>

                    <button
                      onClick={submitComplaint}
                      disabled={submittingComplaint}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
                    >
                      {submittingComplaint ? "Submitting..." : "Submit Complaint"}
                    </button>

                    {/* Status */}
                    {complaintStatus === "success" && (
                      <p className="mt-4 text-green-600 font-semibold">
                        ✅ Complaint submitted successfully
                      </p>
                    )}

                    {complaintStatus === "error" && (
                      <p className="mt-4 text-red-600 font-semibold">
                        ❌ Failed to submit complaint
                      </p>
                    )}
                  </div>
                </div>

                {/* ================= MY COMPLAINTS ================= */}
                <div className="mt-14 border-t pt-10">
                  <h3 className="text-3xl font-extrabold text-indigo-700 mb-8 flex items-center gap-3">
                    <span>📄</span> My Hostel Complaints
                  </h3>

                  {loadingComplaints && (
                    <p className="text-gray-500 animate-pulse text-center py-12">
                      Loading your complaints...
                    </p>
                  )}

                  {!loadingComplaints && complaints.length === 0 && (
                    <p className="text-gray-400 text-center py-16 italic text-lg">
                      You have not raised any complaints yet.
                    </p>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    {complaints.map((c) => (
                      <div
                        key={c.id}
                        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold text-xl text-indigo-800 tracking-wide">
                            {c.complaint_title}
                          </h4>
                          <span
                            className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-1 rounded-full
                      ${c.status === "Resolved"
                                ? "bg-green-100 text-green-800"
                                : c.status === "Rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                    `}
                            aria-label={`Status: ${c.status}`}
                          >
                            {c.status === "Resolved" && "✅"}
                            {c.status === "Rejected" && "❌"}
                            {c.status === "Pending" && "⏳"}
                            {c.status}
                          </span>
                        </div>

                        <p className="text-gray-700 leading-relaxed mb-5 whitespace-pre-line">
                          {c.complaint_desc}
                        </p>

                        <p className="text-xs text-gray-400 text-right italic">
                          Submitted on{" "}
                          {new Date(c.created_at).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </section>
        )}



        {/* ATTENDANCE */}
        {activeSection === "attendance" && (
          <section className="bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 
                      p-10 rounded-3xl shadow-2xl animate-fadeIn">

            <h2 className="text-4xl font-extrabold mb-10 text-indigo-800 flex items-center gap-3">
              <FaRegFileAlt /> Attendance Overview
            </h2>

            {attendance.map((a, index) => {
              const total = Number(a.presents) + Number(a.absents);
              const percentage = total
                ? Math.round((a.presents / total) * 100)
                : 0;

              return (
                <div
                  key={a.id}
                  className="relative bg-white/70 backdrop-blur-xl 
                     rounded-3xl p-8 shadow-xl
                     transition-all duration-500
                     hover:-translate-y-2 hover:shadow-2xl
                     animate-slideUp"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {/* Status Badge */}
                  <div
                    className={`absolute -top-4 -right-4 px-4 py-2 rounded-2xl 
              text-sm font-bold shadow-lg text-white
              ${percentage >= 75
                        ? "bg-green-500"
                        : percentage >= 60
                          ? "bg-yellow-500"
                          : "bg-red-500"}`}
                  >
                    {percentage >= 75
                      ? "GOOD"
                      : percentage >= 60
                        ? "WARNING"
                        : "LOW"}
                  </div>

                  <div className="grid md:grid-cols-2 gap-10 items-center">
                    {/* LEFT – Ring */}
                    <div className="flex justify-center">
                      <div className="relative w-32 h-32">
                        <svg className="w-full h-full -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="54"
                            stroke="#e5e7eb"
                            strokeWidth="10"
                            fill="none"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="54"
                            stroke="url(#attendanceGrad)"
                            strokeWidth="10"
                            fill="none"
                            strokeDasharray={339}
                            strokeDashoffset={
                              339 - (339 * percentage) / 100
                            }
                            strokeLinecap="round"
                            className="transition-all duration-1000"
                          />
                          <defs>
                            <linearGradient id="attendanceGrad">
                              <stop offset="0%" stopColor="#6366f1" />
                              <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                          </defs>
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <p className="text-3xl font-extrabold text-indigo-700">
                            {percentage}%
                          </p>
                          <p className="text-xs text-gray-500">Attendance</p>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT – Details */}
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-50 rounded-xl p-4 text-center">
                          <p className="text-sm text-green-600">PRESENT</p>
                          <p className="text-2xl font-bold text-green-700">
                            {a.presents}
                          </p>
                        </div>

                        <div className="bg-red-50 rounded-xl p-4 text-center">
                          <p className="text-sm text-red-600">ABSENT</p>
                          <p className="text-2xl font-bold text-red-700">
                            {a.absents}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Total Classes</span>
                          <span>{total}</span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r 
                               from-indigo-500 to-purple-500 
                               transition-all duration-700"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}


        {/* EXAMINATION FORM */}
        {activeSection === "examForm" && (
          <section className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-indigo-700 flex items-center gap-2">
              <FaFileUpload /> Examination Form
            </h2>

            {/* Personal Details */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">
                Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    placeholder: "Full Name",
                    value: examForm.personalDetails.name,
                    key: "name",
                  },
                  {
                    placeholder: "Father's Name",
                    value: examForm.personalDetails.fatherName,
                    key: "fatherName",
                  },
                  {
                    placeholder: "Mother's Name",
                    value: examForm.personalDetails.motherName,
                    key: "motherName",
                  },
                  {
                    placeholder: "Date of Birth",
                    value: examForm.personalDetails.dob,
                    key: "dob",
                    type: "date",
                  },
                ].map((field) => (
                  <input
                    key={field.key}
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) =>
                      setExamForm({
                        ...examForm,
                        personalDetails: {
                          ...examForm.personalDetails,
                          [field.key]: e.target.value,
                        },
                      })
                    }
                    className="p-4 border rounded-lg shadow-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                ))}
              </div>
            </div>

            {/* Profile Photo & Signature Upload */}
            <div className="mb-6 flex gap-6 flex-wrap">
              {/* Profile Photo */}
              <div className="flex flex-col items-center">
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer hover:border-indigo-500 transition bg-gray-50 text-indigo-600 font-semibold">
                  <FaFileUpload className="text-2xl mb-2" /> Profile Photo
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleExamFileUpload(e, "profilePhoto")}
                  />
                </label>
                {examForm.profilePhoto && (
                  <img
                    src={examForm.profilePhoto}
                    alt="Profile Preview"
                    className="w-32 h-32 object-cover mt-2 border rounded-lg"
                  />
                )}
              </div>

              {/* Signature */}
              <div className="flex flex-col items-center">
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer hover:border-indigo-500 transition bg-gray-50 text-indigo-600 font-semibold">
                  <FaFileUpload className="text-2xl mb-2" /> Signature
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleExamFileUpload(e, "signature")}
                  />
                </label>
                {examForm.signature && (
                  <img
                    src={examForm.signature}
                    alt="Signature Preview"
                    className="w-32 h-32 object-cover mt-2 border rounded-lg"
                  />
                )}
              </div>
            </div>

            {/* Subjects */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">Subjects</h3>
              {examForm.subjects.map((sub, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 mb-3 flex-wrap items-center"
                >
                  <input
                    placeholder="Subject Code"
                    value={sub.code}
                    onChange={(e) => updateSubject(idx, "code", e.target.value)}
                    className="p-3 min-w-[120px] border rounded-lg shadow-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                  <input
                    placeholder="Subject Name"
                    value={sub.name}
                    onChange={(e) => updateSubject(idx, "name", e.target.value)}
                    className="p-3 min-w-[180px] border rounded-lg shadow-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          "Are you sure you want to delete this subject?"
                        )
                      ) {
                        const newSubs = [...examForm.subjects];
                        newSubs.splice(idx, 1);
                        setExamForm({ ...examForm, subjects: newSubs });
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-500 flex items-center gap-2 transition"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              ))}
              <button
                onClick={addSubject}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition flex items-center gap-2"
              >
                <FaPlus /> Add Subject
              </button>
            </div>

            {/* Payment & Print */}
            <div className="flex gap-4 flex-wrap">
              {!examForm.paymentDone ? (
                <button
                  onClick={handlePayment}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-500 transition flex items-center gap-2"
                >
                  <FaMoneyBillWave /> Pay Exam Fees
                </button>
              ) : (
                <span className="text-green-700 font-semibold px-6 py-3 border rounded-lg shadow bg-green-100 flex items-center gap-2">
                  <FaCheckCircle /> Payment Completed
                </span>
              )}
              <button
                onClick={printForm}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-500 transition flex items-center gap-2"
              >
                <FaPrint /> Print Form
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}


const InfoBox = ({ label, value }) => (
  <div className="bg-gray-50 p-6 rounded-lg border">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);


const Input = ({ label, value, onChange, type = "text" }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
    />
  </div>
);
