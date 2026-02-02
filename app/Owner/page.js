'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserShield } from 'react-icons/fa';

import {
  FaBook, FaUsers, FaDollarSign, FaHome, FaUserTie, FaArrowRight,
  FaGraduationCap, FaCheckCircle, FaSearch, FaBell, FaChartLine,
  FaSignOutAlt, FaBars, FaTimes, FaCalendarAlt, FaPlus, FaFileAlt
} from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function OwnerDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  // Add modal states and form data for add student/staff
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showTimetableModal, setShowTimetableModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    student_id: '',
    name: '',
    course: '',
    department: '',
    year: '',
    semester: '',
  });
  const [newStaff, setNewStaff] = useState({
    id: '',
    name: '',
    department: '',
    email: '',
  });
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  // Fetch students and staff for refresh after add
  useEffect(() => {
    fetch('/api/students')
      .then(r => r.json())
      .then(data => setStudents(data.pagination ? data.data : data));
    fetch('/api/staff').then(r => r.json()).then(setStaff);
  }, []);

  // Add Student handler
  async function handleAddStudent(e) {
    e.preventDefault();
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudent),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Error adding student');
      return;
    }
    alert('Student Added Successfully!');
    setNewStudent({ student_id: '', name: '', course: '', department: '', year: '', semester: '' });
    setShowAddStudentModal(false);
    // Refresh students
    const updated = await fetch('/api/students');
    const updatedData = await updated.json();
    setStudents(updatedData.pagination ? updatedData.data : updatedData);
  }

  // Add Staff handler
  async function handleAddStaff(e) {
    e.preventDefault();
    const res = await fetch('/api/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStaff),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Error adding staff');
      return;
    }
    alert('Staff Added Successfully!');
    setNewStaff({ id: '', name: '', department: '', email: '' });
    setShowAddStaffModal(false);
    // Refresh staff
    const updated = await fetch('/api/staff');
    setStaff(await updated.json());
  }
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalStaff: 0,
    totalBooks: 0,
    hostelOccupancy: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, staffRes, booksRes, hostelRes] = await Promise.all([
          fetch('/api/students?limit=1'), // Fetch minimal data
          fetch('/api/staff'),
          fetch('/api/bookdetails'),
          fetch('/api/HostelStudents')
        ]);

        const studentsData = await studentsRes.json();
        const staff = await staffRes.json();
        const books = await booksRes.json();
        const hostelStudents = await hostelRes.json();

        setStats({
          totalStudents: studentsData.pagination ? studentsData.pagination.totalItems : (Array.isArray(studentsData) ? studentsData.length : 0),
          totalStaff: Array.isArray(staff) ? staff.length : 0,
          totalBooks: Array.isArray(books) ? books.length : 0,
          hostelOccupancy: Array.isArray(hostelStudents) ? hostelStudents.length : 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsDisplay = [
    {
      label: 'Total Students',
      value: loading ? '...' : stats.totalStudents.toLocaleString(),
      icon: FaGraduationCap,
      trend: '',
      trendUp: true,
      color: 'bg-blue-500',
      lightBg: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      label: 'Active Staff',
      value: loading ? '...' : stats.totalStaff.toString(),
      icon: FaUserTie,
      trend: '',
      trendUp: true,
      color: 'bg-purple-500',
      lightBg: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      label: 'Library Books',
      value: loading ? '...' : stats.totalBooks.toLocaleString(),
      icon: FaBook,
      trend: '',
      trendUp: true,
      color: 'bg-cyan-500',
      lightBg: 'bg-cyan-100',
      textColor: 'text-cyan-600'
    },
    {
      label: 'Hostel Students',
      value: loading ? '...' : stats.hostelOccupancy.toString(),
      icon: FaHome,
      trend: '',
      trendUp: true,
      color: 'bg-amber-500',
      lightBg: 'bg-amber-100',
      textColor: 'text-amber-600'
    },

  ];

  const [role, setRole] = useState('');

  useEffect(() => {
    // Get role from localStorage on mount
    const r = localStorage.getItem('role');
    setRole(r);
  }, []);

  const allModules = [
    { title: 'Academic', icon: FaGraduationCap, description: 'Manage courses, grades, and curriculum', path: '/academy', color: 'from-blue-500 to-indigo-600' },
    { title: 'HR Management', icon: FaUsers, description: 'Employees and leave management', path: '/HR', color: 'from-purple-500 to-pink-600' },
    { title: 'Library', icon: FaBook, description: 'Books catalog, borrowing, and returns', path: '/library', color: 'from-cyan-500 to-blue-600' },
    { title: 'Accounts', icon: FaDollarSign, description: 'Financial reports and transactions', path: '/Accounts', color: 'from-emerald-500 to-teal-600' },
    { title: 'Hostel', icon: FaHome, description: 'Room allocation and management', path: '/HostelDashboard', color: 'from-rose-500 to-orange-500' },
    { title: 'Staff Directory', icon: FaUserTie, description: 'Staff profiles and scheduling', path: '/StaffsDetails', color: 'from-indigo-500 to-purple-600' },
    {
      title: 'User Role Management',
      icon: FaUserShield,
      description: 'Manage users, roles & permissions',
      path: '/UserRoleManagement',
      color: 'from-orange-500 to-red-600'
    },
    {
      title: 'Draft Results',
      icon: FaFileAlt,
      description: 'Prepare, review, and publish exam results',
      path: '/DraftResults',
      color: 'from-green-500 to-emerald-600'
    }

  ];

  // Filter modules based on role
  const modules = role === 'dean'
    ? allModules.filter(m => !['HR Management', 'Hostel', 'User Role Management'].includes(m.title))
    : allModules;

  const allQuickActions = [
    { label: 'Add Student', icon: FaPlus, color: 'bg-blue-500' },
    { label: 'Add Staff', icon: FaUsers, color: 'bg-purple-500' },
    { label: 'Upload Timetable', icon: FaCalendarAlt },
    { label: 'User Roles', icon: FaUserShield, href: '/UserRoleManagement' },
  ];

  const quickActions = role === 'dean'
    ? allQuickActions.filter(a => a.label !== 'User Roles')
    : allQuickActions;

  const filteredModules = modules.filter((module) =>
    module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allSidebarLinks = [
    { label: 'Dashboard', icon: FaChartLine, href: '/Owner', active: true },
    { label: 'Academic', icon: FaGraduationCap, href: '/Academic' },
    { label: 'HR', icon: FaUsers, href: '/HR' },
    { label: 'Library', icon: FaBook, href: '/library' },
    { label: 'Accounts', icon: FaDollarSign, href: '/Accounts' },
    { label: 'Hostel', icon: FaHome, href: '/HostelDashboard' },
    { label: 'Staff', icon: FaUserTie, href: '/StaffsDetails' },
    {
      label: 'Draft Results',
      icon: FaFileAlt,
      href: '/DraftResults'
    }

  ];

  const sidebarLinks = role === 'dean'
    ? allSidebarLinks.filter(l => !['HR', 'Hostel'].includes(l.label))
    : allSidebarLinks;

  const graphData = {
    labels: ['Total Students', 'Active Staff', 'Library Books', 'Hostel Students'],
    datasets: [
      {
        label: 'Count',
        data: [
          stats.totalStudents,
          stats.totalStaff,
          stats.totalBooks,
          stats.hostelOccupancy
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const graphOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Summary Data Visualization'
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-screen w-72 bg-white border-r border-slate-200 
        flex flex-col z-50 transition-transform duration-300 shadow-xl lg:shadow-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
          <Link href="/Owner" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold text-slate-800">
              ERP<span className="text-indigo-500">Pro</span>
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100">
            <FaTimes className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${link.active
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              <link.icon className="w-5 h-5" />
              <span>{link.label}</span>
              {link.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('role');
              localStorage.removeItem('profileUrl');
              document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
              document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
              window.location.href = '/';
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium w-full"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-72 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-slate-100">
              <FaBars className="w-5 h-5 text-slate-600" />
            </button>

            <div className="relative hidden md:block">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80 pl-11 pr-4 py-2.5 bg-slate-100 border-0 rounded-xl text-slate-700 placeholder-slate-400
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-colors">
              <FaBell className="w-5 h-5 text-slate-500" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div className="w-px h-8 bg-slate-200 hidden md:block" />

            <div className="flex items-center gap-3 p-1.5 pr-4 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center shadow-md">
                <span className="text-white font-semibold text-sm">AD</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-slate-800">Super Admin</p>
                <p className="text-xs text-slate-500">admin@erp.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
                  Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">Admin</span> 👋
                </h1>
                <p className="text-slate-500">Here's what's happening with your institution today.</p>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-medium">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  System Online
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl">
                  <FaCalendarAlt className="w-4 h-4" />
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-3 mb-8"
          >
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 
                           rounded-xl text-sm font-medium text-slate-700 hover:border-indigo-500 
                           hover:text-indigo-600 transition-all shadow-sm hover:shadow-md"
                onClick={() => {
                  if (action.label === 'Add Student') setShowAddStudentModal(true);
                  if (action.label === 'Add Staff') setShowAddStaffModal(true);
                  if (action.label === 'Upload Timetable') setShowTimetableModal(true);
                }}
              >
                <action.icon className="w-4 h-4" />
                {action.label}
              </button>
            ))}
            {/* Add Student Modal */}
            {showAddStudentModal && (
              <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center animate-fadeIn z-50">
                <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 animate-scaleIn border-t-4 border-blue-600">
                  <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">Add New Student</h2>
                  <form onSubmit={handleAddStudent} className="space-y-4">
                    {[
                      { label: 'Student ID', key: 'student_id' },
                      { label: 'Name', key: 'name' },
                      { label: 'Course', key: 'course' },
                      { label: 'Department', key: 'department' },
                      { label: 'Year', key: 'year', type: 'number' },
                      { label: 'Semester', key: 'semester', type: 'number' },
                    ].map((field) => (
                      <input
                        key={field.key}
                        type={field.type || 'text'}
                        placeholder={field.label}
                        value={newStudent[field.key]}
                        onChange={e => setNewStudent({ ...newStudent, [field.key]: e.target.value })}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
                        required
                      />
                    ))}
                    <div className="flex justify-end gap-3 mt-4">
                      <button type="button" onClick={() => setShowAddStudentModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300 active:scale-95">Add</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Add Staff Modal */}
            {showAddStaffModal && (
              <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center animate-fadeIn z-50">
                <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 animate-scaleIn border-t-4 border-purple-600">
                  <h2 className="text-2xl font-bold mb-4 text-purple-700 text-center">Add New Staff</h2>
                  <form onSubmit={handleAddStaff} className="space-y-4">
                    {[
                      { label: 'Staff ID', key: 'id' },
                      { label: 'Name', key: 'name' },
                      { label: 'Department', key: 'department' },
                      { label: 'Email', key: 'email' },
                    ].map((field) => (
                      <input
                        key={field.key}
                        type={field.type || 'text'}
                        placeholder={field.label}
                        value={newStaff[field.key]}
                        onChange={e => setNewStaff({ ...newStaff, [field.key]: e.target.value })}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-200"
                        required
                      />
                    ))}
                    <div className="flex justify-end gap-3 mt-4">
                      <button type="button" onClick={() => setShowAddStaffModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-md hover:shadow-lg transition-all duration-300 active:scale-95">Add</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {showTimetableModal && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 border-t-4 border-indigo-600">
                  <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">
                    Upload Timetable
                  </h2>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();

                      const formData = new FormData(e.target);

                      const res = await fetch("/api/timetable", {
                        method: "POST",
                        body: formData,
                      });

                      const data = await res.json();
                      if (!res.ok) {
                        alert(data.error || "Upload failed");
                        return;
                      }

                      alert("Timetable uploaded successfully");
                      setShowTimetableModal(false);
                    }}
                    className="space-y-4"
                  >
                    <select
                      name="department"
                      required
                      className="w-full p-3 border rounded-lg"
                    >
                      <option value="">Select Department</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Electrical">Electrical</option>
                    </select>

                    <select
                      name="timetable_type"
                      required
                      className="w-full p-3 border rounded-lg"
                    >
                      <option value="">Timetable Type</option>
                      <option value="student">Student</option>
                      <option value="staff">Staff</option>
                    </select>

                    <input
                      type="file"
                      name="file"
                      accept="image/*,.pdf"
                      required
                      className="w-full"
                    />

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowTimetableModal(false)}
                        className="px-4 py-2 bg-gray-300 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        Upload
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}


          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8"
          >
            {statsDisplay.map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.lightBg}`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  {stat.trend && (
                    <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${stat.trendUp ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                      {stat.trend}
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.label}</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</h3>
              </motion.div>
            ))}
          </motion.div>

          {/* Graph Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold text-slate-800 mb-4">Data Visualization</h2>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <Bar data={graphData} options={graphOptions} />
            </div>
          </motion.div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 gap-6">
            {/* Modules Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">
                  {searchTerm ? `Search Results (${filteredModules.length})` : 'Quick Access Modules'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredModules.length > 0 ? (
                    filteredModules.map((module, idx) => (
                      <motion.div
                        key={module.title}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ y: -4 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Link href={module.path} className="block group">
                          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all h-full">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                              <module.icon className="w-6 h-6 text-white" />
                            </div>

                            <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
                              {module.title}
                            </h3>
                            <p className="text-sm text-slate-500 mb-4">{module.description}</p>

                            <div className="flex items-center justify-end">
                              <FaArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-slate-300"
                    >
                      <p className="text-slate-500">No modules match your search</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 p-6 text-center bg-white">
          <p className="text-sm text-slate-500">
            © 2025 ERP Pro. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}