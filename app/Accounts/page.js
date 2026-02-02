"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Banknote,
    CreditCard,
    Users,
    AlertCircle,
    TrendingUp,
    TrendingDown,
    ArrowRight,
    ArrowLeft,
    Search,
    Plus,
    User,
    Wallet,
    FileText,
    PieChart
} from "lucide-react";

export default function AccountantPage() {
    const [activeTab, setActiveTab] = useState('overview');
    const [profileLink, setProfileLink] = useState('/StaffDashboard');
    const [stats, setStats] = useState({
        totalCollection: 0,
        totalPending: 0,
        defaultersCount: 0,
        totalStudents: 0
    });
    const [loading, setLoading] = useState(true);

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
                const res = await fetch("/api/students?all=true");
                if (!res.ok) throw new Error("Failed to fetch students");
                const resp = await res.json();
                const students = resp.data || resp;

                const totalCollection = students.reduce((acc, s) => {
                    const total = parseFloat(s.total_fee || 0);
                    const pending = s["pending _fee"] !== null ? parseFloat(s["pending _fee"]) : total;
                    return acc + (total - pending);
                }, 0);

                const totalPending = students.reduce((acc, s) => {
                    const total = parseFloat(s.total_fee || 0);
                    const pending = s["pending _fee"] !== null ? parseFloat(s["pending _fee"]) : total;
                    return acc + pending;
                }, 0);

                const defaultersCount = students.filter(s => {
                    const pending = s["pending _fee"] !== null ? parseFloat(s["pending _fee"]) : parseFloat(s.total_fee);
                    return pending > 0;
                }).length;

                setStats({
                    totalCollection,
                    totalPending,
                    defaultersCount,
                    totalStudents: students.length
                });

            } catch (error) {
                console.error('Error fetching accounts data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const statsDisplay = [
        {
            title: 'Total Collection',
            value: loading ? '...' : `₹${stats.totalCollection.toLocaleString()}`,
            change: 'Received',
            trend: 'up',
            icon: Wallet,
            color: 'from-emerald-600 to-green-700',
            bgColor: 'bg-emerald-600/10',
            iconColor: 'text-emerald-600'
        },
        {
            title: 'Outstanding Dues',
            value: loading ? '...' : `₹${stats.totalPending.toLocaleString()}`,
            change: 'Pending',
            trend: 'down',
            icon: AlertCircle,
            color: 'from-rose-600 to-red-700',
            bgColor: 'bg-rose-600/10',
            iconColor: 'text-rose-600'
        },
        {
            title: 'Defaulters',
            value: loading ? '...' : stats.defaultersCount.toString(),
            change: 'Students',
            trend: 'neutral',
            icon: Users,
            color: 'from-amber-600 to-orange-700',
            bgColor: 'bg-amber-600/10',
            iconColor: 'text-amber-600'
        },
        {
            title: 'Total Enrolled',
            value: loading ? '...' : stats.totalStudents.toString(),
            change: 'Active',
            trend: 'up',
            icon: User,
            color: 'from-blue-600 to-indigo-700',
            bgColor: 'bg-blue-600/10',
            iconColor: 'text-blue-600'
        },
    ];

    const navigationCards = [
        {
            title: 'Fee Registry',
            description: 'Manage student fees, update records, and view payments',
            icon: Banknote,
            href: '/Accounts/fees',
            color: 'from-emerald-600 to-green-700',
            stats: loading ? '...' : `${stats.totalStudents} Records`,
            badge: null
        },
        {
            title: 'Defaulters List',
            description: 'View and follow up with students having pending dues',
            icon: AlertCircle,
            href: '/Accounts/defaulters',
            color: 'from-rose-600 to-red-700',
            stats: loading ? '...' : `${stats.defaultersCount} Pending`,
            badge: loading ? null : (stats.defaultersCount > 0 ? stats.defaultersCount.toString() : null)
        },
        {
            title: 'Transactions',
            description: 'Track all financial transactions and history',
            icon: CreditCard,
            href: '/Accounts/transactions', // Placeholder for now
            color: 'from-purple-600 to-pink-700',
            stats: 'View All',
            badge: null
        },
        {
            title: 'Reports & Audit',
            description: 'Generate financial reports and audit summaries',
            icon: FileText,
            href: '/Accounts/reports', // Placeholder
            color: 'from-blue-600 to-cyan-700',
            stats: 'Analytics',
            badge: null
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Enhanced Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-100px] right-[-100px] w-[800px] h-[800px] bg-emerald-500/5 dark:bg-emerald-600/10 rounded-full blur-[120px] opacity-70" />
                <div className="absolute bottom-[-100px] left-[-100px] w-[800px] h-[800px] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[120px] opacity-70" />
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
                                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <PieChart className="w-6 h-6 text-emerald-600" />
                                        Accountant Dashboard
                                    </h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage fees, dues, and financial records</p>
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
                                <div className="relative hidden md:block">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Search records..."
                                        className="w-72 pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-full 
                             text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500
                             focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-sm"
                                    />
                                </div>
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
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
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
                                                : stat.trend === 'down'
                                                    ? 'text-red-600 dark:text-red-400'
                                                    : 'text-amber-600 dark:text-amber-400'
                                                }`}>
                                                {stat.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                                                {stat.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                                                {stat.change}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.title}</p>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
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
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Finance Modules</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                                        <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-bold rounded-full shadow-sm">
                                                            {card.badge} Action Needed
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                                                    {card.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                    {card.description}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                                                        {card.stats}
                                                    </span>
                                                    <ArrowRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all duration-300" />
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
        </div>
    );
}
