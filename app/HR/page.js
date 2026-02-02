"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  User,
  Calendar,
  UserCheck,
  Plus,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Clock,
  Download,
} from "lucide-react";

import AddStaffModal from "../Components/AddStaffNodal";
import DownloadReportButton from "../Components/DownloadReportButton";

export default function HRPage() {
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [profileLink, setProfileLink] = useState('/StaffDashboard');
  const [stats, setStats] = useState({
    totalEmployees: 0,
    onLeaveToday: 0,
    pendingApprovals: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentLeaves, setRecentLeaves] = useState([]);

  useEffect(() => {
    // Set profile link based on role and userId
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');

    if (role && userId) {
      if (role === 'student') {
        setProfileLink(`/StudentDashboard?student_id=${userId}`);
      } else {
        setProfileLink(`/StaffDashboard?staff_id=${userId}`);
      }
    }

    const fetchData = async () => {
      try {
        const [staffRes, leavesRes] = await Promise.all([
          fetch('/api/staff'),
          fetch('/api/leaves')
        ]);

        const staff = await staffRes.json();
        const leaves = await leavesRes.json();

        const today = new Date().toISOString().split('T')[0];
        const onLeaveToday = Array.isArray(leaves) ? leaves.filter(leave => {
          const startDate = new Date(leave.start_date).toISOString().split('T')[0];
          const endDate = new Date(leave.end_date).toISOString().split('T')[0];
          return startDate <= today && endDate >= today && leave.status === 'approved';
        }).length : 0;

        const pendingLeaves = Array.isArray(leaves) ? leaves.filter(l => l.status === 'pending').length : 0;

        setStats({
          totalEmployees: Array.isArray(staff) ? staff.length : 0,
          onLeaveToday,
          pendingApprovals: pendingLeaves
        });

        // Get recent leave requests
        if (Array.isArray(leaves)) {
          setRecentLeaves(leaves.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching HR data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statsDisplay = [
    {
      title: 'Total Employees',
      value: loading ? '...' : stats.totalEmployees.toString(),
      change: '',
      trend: 'up',
      icon: Users,
      color: 'from-blue-600 to-indigo-700',
      bgColor: 'bg-blue-600/10',
      iconColor: 'text-blue-600'
    },
    {
      title: 'On Leave Today',
      value: loading ? '...' : stats.onLeaveToday.toString(),
      change: '',
      trend: 'down',
      icon: Calendar,
      color: 'from-amber-600 to-orange-700',
      bgColor: 'bg-amber-600/10',
      iconColor: 'text-amber-600'
    },
    {
      title: 'Pending Approvals',
      value: loading ? '...' : stats.pendingApprovals.toString(),
      change: '',
      trend: 'up',
      icon: Clock,
      color: 'from-purple-600 to-pink-700',
      bgColor: 'bg-purple-600/10',
      iconColor: 'text-purple-600'
    },
  ];

  const navigationCards = [
    {
      title: 'Employee Directory',
      description: 'View and manage all staff records, profiles, and details',
      icon: Users,
      href: '/HR/employees',
      color: 'from-blue-600 to-indigo-700',
      stats: loading ? '...' : `${stats.totalEmployees} Active`,
      badge: null
    },
    {
      title: 'Attendance',
      description: 'Track daily attendance, reports, and work hours',
      icon: UserCheck,
      href: '/HR/Attendance',
      color: 'from-emerald-600 to-teal-700',
      stats: 'Manage Daily',
      badge: null
    },
    {
      title: 'Leave Management',
      description: 'Handle leave requests, approvals, and balances',
      icon: Calendar,
      href: '/HR/leaves',
      color: 'from-amber-600 to-orange-700',
      stats: loading ? '...' : `${stats.pendingApprovals} Pending`,
      badge: loading ? null : (stats.pendingApprovals > 0 ? stats.pendingApprovals.toString() : null)
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Enhanced Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] right-[-100px] w-[800px] h-[800px] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[120px] opacity-70" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[800px] h-[800px] bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-[120px] opacity-70" />
      </div>

      <div className="relative z-10">
        {/* Enhanced Header */}
        <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between h-[80px]">
              {/* Breadcrumb */}
              <div className="flex items-center gap-4">
                <Link href="/StaffDashboard" className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </Link>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">HR Management</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Oversee employees, attendance, and leave requests efficiently</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Link
                  href={profileLink}
                  className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-full font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <DownloadReportButton
                  apiEndpoint="/api/staff"
                  fileName="HR_Report"
                  className="hidden md:inline-flex rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-none shadow-sm"
                />
                <button
                  onClick={() => setShowAddStaffModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Add New Staff
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
          >
            {statsDisplay.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="relative bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all overflow-hidden group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-full ${stat.bgColor} shadow-sm`}>
                      <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                    {stat.change && (
                      <div className={`flex items-center gap-1 text-xs font-semibold ${stat.trend === 'up'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                        }`}>
                        {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {stat.change}
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.title}</p>
                  <h3 className="text-4xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Navigation Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">HR Modules</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {navigationCards.map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Link href={card.href} className="block group h-full">
                    <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all h-full overflow-hidden">
                      {/* Decorative gradient */}
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-300`} />

                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${card.color} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300`}>
                            <card.icon className="w-6 h-6 text-white" />
                          </div>
                          {card.badge && (
                            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-bold rounded-full shadow-sm">
                              {card.badge} Pending
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {card.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          {card.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                            {card.stats}
                          </span>
                          <ArrowRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 group-hover:translate-x-2 transition-all duration-300" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>

      {/* Add Staff Modal */}
      {showAddStaffModal && <AddStaffModal close={() => setShowAddStaffModal(false)} />}
    </div>
  );
}