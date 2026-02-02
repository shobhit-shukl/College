"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  BookMarked,
  Users,
  Plus,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Search,
  BookCopy,
  Library,
  User,
} from "lucide-react";

import AddBookModal from "../Components/AddBookModal";

export default function LibraryPage() {
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [profileLink, setProfileLink] = useState('/StaffDashboard');
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    issuedBooks: 0,
    activeMembers: 0
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
        const [booksRes, issuedRes, studentsRes] = await Promise.all([
          fetch('/api/bookdetails'),
          fetch('/api/Issued-books'),
          fetch('/api/students')
        ]);

        const books = await booksRes.json();
        const issued = await issuedRes.json();
        const students = await studentsRes.json();

        const totalBooks = Array.isArray(books) ? books.length : 0;
        const issuedCount = Array.isArray(issued) ? issued.length : 0;

        setStats({
          totalBooks,
          availableBooks: totalBooks - issuedCount,
          issuedBooks: issuedCount,
          activeMembers: Array.isArray(students) ? students.length : 0
        });
      } catch (error) {
        console.error('Error fetching library data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const statsDisplay = [
    {
      title: 'Total Books',
      value: loading ? '...' : stats.totalBooks.toLocaleString(),
      change: '',
      trend: 'up',
      icon: BookOpen,
      color: 'from-cyan-600 to-teal-700',
      bgColor: 'bg-cyan-600/10',
      iconColor: 'text-cyan-600'
    },
    {
      title: 'Available',
      value: loading ? '...' : stats.availableBooks.toLocaleString(),
      change: '',
      trend: 'neutral',
      icon: BookMarked,
      color: 'from-emerald-600 to-green-700',
      bgColor: 'bg-emerald-600/10',
      iconColor: 'text-emerald-600'
    },
    {
      title: 'Issued Books',
      value: loading ? '...' : stats.issuedBooks.toString(),
      change: '',
      trend: 'up',
      icon: BookCopy,
      color: 'from-amber-600 to-orange-700',
      bgColor: 'bg-amber-600/10',
      iconColor: 'text-amber-600'
    },
    {
      title: 'Active Members',
      value: loading ? '...' : stats.activeMembers.toLocaleString(),
      change: '',
      trend: 'up',
      icon: Users,
      color: 'from-purple-600 to-pink-700',
      bgColor: 'bg-purple-600/10',
      iconColor: 'text-purple-600'
    },
  ];

  const navigationCards = [
    {
      title: 'Book Catalog',
      description: 'View, search, and manage all books in the library',
      icon: BookOpen,
      href: '/library/books',
      color: 'from-cyan-600 to-teal-700',
      stats: loading ? '...' : `${stats.totalBooks.toLocaleString()} Books`,
      badge: null
    },
    {
      title: 'Issue Books',
      description: 'Issue and return books for students and staff',
      icon: BookCopy,
      href: '/library/issue-books',
      color: 'from-amber-600 to-orange-700',
      stats: loading ? '...' : `${stats.issuedBooks} Issued`,
      badge: null
    },
    {
      title: 'Members',
      description: 'Manage library members and their borrowing history',
      icon: Users,
      href: '/library/students',
      color: 'from-purple-600 to-pink-700',
      stats: loading ? '...' : `${stats.activeMembers.toLocaleString()} Active`,
      badge: null
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Enhanced Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] right-[-100px] w-[800px] h-[800px] bg-cyan-500/5 dark:bg-cyan-600/10 rounded-full blur-[120px] opacity-70" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[800px] h-[800px] bg-teal-500/5 dark:bg-teal-600/10 rounded-full blur-[120px] opacity-70" />
      </div>

      <div className="relative z-10">
        {/* Enhanced Header */}
        <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between h-[80px]">
              {/* Breadcrumb */}
              <div className="flex items-center gap-4">
                <Link href="/Owner" className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </Link>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Library className="w-6 h-6 text-cyan-600" />
                    Library Management
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Oversee books, members, and transactions efficiently</p>
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
                    placeholder="Search books..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-72 pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-700 border-0 rounded-full 
                             text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500
                             focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all shadow-sm"
                  />
                </div>
                <button
                  onClick={() => setShowAddBookModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-700 text-white rounded-full font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Add New Book
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
                        : stat.trend === 'neutral'
                          ? 'text-cyan-600 dark:text-cyan-400'
                          : 'text-red-600 dark:text-red-400'
                        }`}>
                        {stat.trend === 'up' && <TrendingUp className="w-3 h-3" />}
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
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Library Modules</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                          {card.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          {card.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                            {card.stats}
                          </span>
                          <ArrowRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-cyan-500 group-hover:translate-x-2 transition-all duration-300" />
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

      {/* Add Book Modal */}
      {showAddBookModal && <AddBookModal close={() => setShowAddBookModal(false)} />}
    </div>
  );
}