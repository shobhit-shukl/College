'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    Bell,
    Moon,
    Sun,
    Menu,
    ChevronDown,
    Settings,
    LogOut,
    User,
    HelpCircle
} from 'lucide-react';

export default function TopHeader({
    sidebarOpen,
    setSidebarOpen,
    collapsed,
    user = { name: 'Admin User', role: 'Super Admin', avatar: null }
}) {
    const [darkMode, setDarkMode] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    };

    const handleLogout = () => {
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('profileUrl');

        // Clear cookies
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

        // Redirect to login page
        window.location.href = '/';
    };

    const notifications = [
        { id: 1, title: 'New leave request', message: 'John Doe requested vacation leave', time: '5 min ago', unread: true },
        { id: 2, title: 'System update', message: 'ERP system will be updated tonight', time: '1 hour ago', unread: true },
        { id: 3, title: 'Payment received', message: 'Fee payment of $5,000 received', time: '2 hours ago', unread: false },
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <header
            className={`
        fixed top-0 right-0 h-[72px] bg-white/80 dark:bg-surface-900/80 
        backdrop-blur-xl border-b border-surface-200 dark:border-surface-800 
        flex items-center justify-between px-4 md:px-6 z-30 transition-all duration-300
        left-0 ${collapsed ? 'lg:left-20' : 'lg:left-[280px]'}
      `}
        >
            {/* Left Section */}
            <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                    <Menu className="w-6 h-6 text-surface-600 dark:text-surface-400" />
                </button>

                {/* Search Bar */}
                <div className="hidden md:flex items-center relative">
                    <Search className="absolute left-4 w-5 h-5 text-surface-400" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="w-64 lg:w-80 pl-12 pr-4 py-2.5 bg-surface-100 dark:bg-surface-800 
                     border border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-surface-700
                     rounded-xl text-sm text-surface-700 dark:text-surface-300 placeholder-surface-400
                     focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                    />
                    <kbd className="absolute right-4 hidden lg:inline-flex items-center gap-1 px-2 py-0.5 bg-surface-200 dark:bg-surface-700 
                         text-surface-500 dark:text-surface-400 text-xs font-medium rounded">
                        ⌘K
                    </kbd>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Help Button */}
                <button className="hidden md:flex p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                    <HelpCircle className="w-5 h-5 text-surface-500 dark:text-surface-400" />
                </button>

                {/* Dark Mode Toggle */}
                <button
                    onClick={toggleDarkMode}
                    className="p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                    {darkMode ? (
                        <Sun className="w-5 h-5 text-amber-500" />
                    ) : (
                        <Moon className="w-5 h-5 text-surface-500" />
                    )}
                </button>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                    >
                        <Bell className="w-5 h-5 text-surface-500 dark:text-surface-400" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-surface-900" />
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-80 bg-white dark:bg-surface-800 rounded-2xl shadow-elevated border border-surface-200 dark:border-surface-700 overflow-hidden"
                        >
                            <div className="p-4 border-b border-surface-200 dark:border-surface-700">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-surface-900 dark:text-surface-100">Notifications</h3>
                                    <span className="badge-primary">{unreadCount} new</span>
                                </div>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 border-b border-surface-100 dark:border-surface-700/50 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors cursor-pointer
                      ${notification.unread ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${notification.unread ? 'bg-primary-500' : 'bg-surface-300'}`} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                                                    {notification.title}
                                                </p>
                                                <p className="text-sm text-surface-500 dark:text-surface-400 truncate">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">
                                                    {notification.time}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 bg-surface-50 dark:bg-surface-700/50">
                                <button className="w-full text-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700">
                                    View all notifications
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px h-8 bg-surface-200 dark:bg-surface-700" />

                {/* User Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                    >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-md">
                            <span className="text-white font-semibold text-sm">
                                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">{user.name}</p>
                            <p className="text-xs text-surface-500 dark:text-surface-400">{user.role}</p>
                        </div>
                        <ChevronDown className="hidden md:block w-4 h-4 text-surface-400" />
                    </button>

                    {/* User Menu Dropdown */}
                    {showUserMenu && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className="absolute right-0 mt-2 w-56 bg-white dark:bg-surface-800 rounded-2xl shadow-elevated border border-surface-200 dark:border-surface-700 overflow-hidden"
                        >
                            <div className="p-4 border-b border-surface-200 dark:border-surface-700">
                                <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">{user.name}</p>
                                <p className="text-xs text-surface-500 dark:text-surface-400">{user.role}</p>
                            </div>
                            <div className="p-2">
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors text-sm">
                                    <User className="w-4 h-4" />
                                    My Profile
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors text-sm">
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </button>
                            </div>
                            <div className="p-2 border-t border-surface-200 dark:border-surface-700">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </header>
    );
}
