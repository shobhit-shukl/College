'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import NavigationCard from '../Components/NavigationCard';
import {
  GraduationCap,
  UserPlus,
  Users,
  BookOpen,
  Calendar,
  CheckSquare,
  ClipboardList,
  BookMarked,
  FileText,
  TrendingUp,
  Award,
  FileCheck,
  Bell,
  BarChart3,
  Settings,
  ArrowLeft
} from 'lucide-react';

export default function AcademicPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const academicCards = [
    {
      title: 'Academic Setup',
      desc: 'Configure academic year, terms, and basic settings',
      href: '/Academic/setup',
      icon: Settings,
      color: 'from-purple-500 to-indigo-600',
    },
    {
      title: 'Student Admission',
      desc: 'Manage student admissions and enrollment',
      href: '/Academic/admission',
      icon: UserPlus,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Student Management',
      desc: 'View and manage student records',
      href: '/Academic/students',
      icon: Users,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Subject & Faculty',
      desc: 'Allocate subjects and faculty assignments',
      href: '/Academic/allocation',
      icon: BookOpen,
      color: 'from-amber-500 to-orange-600',
    },
    {
      title: 'Timetable Management',
      desc: 'Create and manage class schedules',
      href: '/Academic/timetable',
      icon: Calendar,
      color: 'from-pink-500 to-rose-600',
    },
    {
      title: 'Attendance System',
      desc: 'Track and manage student attendance',
      href: '/Academic/attendance',
      icon: CheckSquare,
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Assignment/Homework',
      desc: 'Manage assignments and homework submissions',
      href: '/Academic/assignments',
      icon: ClipboardList,
      color: 'from-violet-500 to-purple-600',
    },
    {
      title: 'Examination Management',
      desc: 'Schedule and manage examinations',
      href: '/Academic/examinations',
      icon: BookMarked,
      color: 'from-red-500 to-pink-600',
    },
    {
      title: 'Mark Entry System',
      desc: 'Enter and manage student marks',
      href: '/Academic/marks',
      icon: FileText,
      color: 'from-indigo-500 to-blue-600',
    },
    {
      title: 'Result Processing',
      desc: 'Process and calculate student results',
      href: '/Academic/results',
      icon: TrendingUp,
      color: 'from-cyan-500 to-teal-600',
    },
    {
      title: 'Report Cards & Transcripts',
      desc: 'Generate report cards and transcripts',
      href: '/Academic/report-cards',
      icon: Award,
      color: 'from-yellow-500 to-amber-600',
    },
    {
      title: 'Promotion & Graduation',
      desc: 'Manage student promotions and graduations',
      href: '/Academic/promotion',
      icon: GraduationCap,
      color: 'from-lime-500 to-green-600',
    },
    {
      title: 'Certificates',
      desc: 'Issue and manage certificates',
      href: '/Academic/certificates',
      icon: FileCheck,
      color: 'from-teal-500 to-cyan-600',
    },
    {
      title: 'Academic Notices',
      desc: 'Post and manage academic notices',
      href: '/Academic/notices',
      icon: Bell,
      color: 'from-orange-500 to-red-600',
    },
    {
      title: 'Academic Reports',
      desc: 'Generate comprehensive academic reports',
      href: '/Academic/reports',
      icon: BarChart3,
      color: 'from-fuchsia-500 to-pink-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Academic Management
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Comprehensive academic system management
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Modules</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{academicCards.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Student Services</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">8</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Exam Services</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">4</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <BookMarked className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Reports & Docs</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">3</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Academic Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {academicCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <NavigationCard {...card} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
