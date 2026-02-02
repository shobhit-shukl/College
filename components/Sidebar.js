'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    Users,
    GraduationCap,
    BookOpen,
    Building2,
    DollarSign,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Bell,
    UserCircle,
    LayoutDashboard,
    X,
    Menu
} from 'lucide-react';

const menuItems = [
    {
        title: 'Main',
        items: [
            { name: 'Dashboard', href: '/Owner', icon: LayoutDashboard },
        ]
    },
    {
        title: 'Management',
        items: [
            { name: 'Academic', href: '/Academic', icon: GraduationCap },
            { name: 'HR', href: '/HR', icon: Users },
            { name: 'Library', href: '/library', icon: BookOpen },
            { name: 'Accounts', href: '/Accounts', icon: DollarSign },
        ]
    },
    {
        title: 'Facilities',
        items: [
            { name: 'Hostel', href: '/HostelDashboard', icon: Building2 },
            { name: 'Staff', href: '/StaffsDetails', icon: UserCircle },
        ]
    }
];

export default function Sidebar({ isOpen, setIsOpen, collapsed, setCollapsed }) {
    const pathname = usePathname();

    const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-screen bg-white dark:bg-surface-900 
          border-r border-surface-200 dark:border-surface-800 shadow-soft
          flex flex-col z-50 transition-all duration-300 ease-out
          ${collapsed ? 'w-20' : 'w-[280px]'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                {/* Logo Section */}
                <div className="flex items-center justify-between h-[72px] px-6 border-b border-surface-200 dark:border-surface-800">
                    <Link href="/Owner" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow">
                            <span className="text-white font-bold text-lg">E</span>
                        </div>
                        {!collapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-xl font-bold text-surface-900 dark:text-surface-100"
                            >
                                ERP<span className="text-primary-500">Pro</span>
                            </motion.span>
                        )}
                    </Link>

                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800"
                    >
                        <X className="w-5 h-5 text-surface-500" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 no-scrollbar">
                    {menuItems.map((section, idx) => (
                        <div key={idx} className="mb-6">
                            {!collapsed && (
                                <h3 className="px-6 mb-3 text-[11px] font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest">
                                    {section.title}
                                </h3>
                            )}
                            <div className="space-y-1 px-3">
                                {section.items.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.href);

                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`
                        group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                        ${active
                                                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 shadow-sm'
                                                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100'
                                                }
                        ${collapsed ? 'justify-center px-3' : ''}
                      `}
                                        >
                                            <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-primary-500' : 'text-surface-400 group-hover:text-surface-600 dark:group-hover:text-surface-300'}`} />
                                            {!collapsed && (
                                                <span className="text-sm">{item.name}</span>
                                            )}
                                            {active && !collapsed && (
                                                <motion.div
                                                    layoutId="activeIndicator"
                                                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500"
                                                />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t border-surface-200 dark:border-surface-800">
                    {/* Collapse Toggle - Desktop Only */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className={`
              hidden lg:flex items-center gap-3 w-full px-4 py-3 rounded-xl text-surface-600 dark:text-surface-400 
              hover:bg-surface-100 dark:hover:bg-surface-800 transition-all duration-200
              ${collapsed ? 'justify-center' : ''}
            `}
                    >
                        {collapsed ? (
                            <ChevronRight className="w-5 h-5" />
                        ) : (
                            <>
                                <ChevronLeft className="w-5 h-5" />
                                <span className="text-sm font-medium">Collapse</span>
                            </>
                        )}
                    </button>

                    {/* Logout */}
                    <button
                        onClick={() => {
                            // Clear localStorage
                            localStorage.removeItem('token');
                            localStorage.removeItem('role');
                            localStorage.removeItem('profileUrl');

                            // Clear cookies
                            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                            document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

                            // Redirect to login page
                            window.location.href = '/';
                        }}
                        className={`
              flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 
              transition-all duration-200 mt-2 w-full
              ${collapsed ? 'justify-center' : ''}
            `}
                    >
                        <LogOut className="w-5 h-5" />
                        {!collapsed && <span className="text-sm font-medium">Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}
