"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Search,
    AlertTriangle,
    Edit2,
    X,
    Save,
    Loader2,
    Mail
} from "lucide-react";


export default function DefaultersPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [newFee, setNewFee] = useState("");
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await fetch("/api/students?all=true");
            if (!res.ok) throw new Error("Failed to fetch students");
            const data = await res.json();
            setStudents(data.data || data);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    console.log("All Students:", students);

    const filteredStudents = students.filter((student) => {
        const matchesSearch =
            (student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.student_id?.toLowerCase().includes(searchTerm.toLowerCase()));

        const pending = student["pending _fee"] !== null ? parseFloat(student["pending _fee"]) : parseFloat(student.total_fee || 0);

        // STRICT FILTER: Only show students with pending > 0
        return matchesSearch && pending > 0;
    });

    const openUpdateModal = (student) => {
        setSelectedStudent(student);
        setNewFee(student["pending _fee"] ?? student.total_fee);
        setIsModalOpen(true);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        try {
            const res = await fetch(`/api/students?id=${selectedStudent.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "pending _fee": parseFloat(newFee) }),
            });

            if (res.ok) {
                const json = await res.json();
                const updated = json.student || {};

                setStudents(prev => prev.map(s =>
                    s.id === selectedStudent.id ? { ...s, "pending _fee": parseFloat(newFee), ...updated } : s
                ));
                setIsModalOpen(false);
            } else {
                console.error("Update failed");
            }
        } catch (err) {
            console.error("Update error:", err);
        } finally {
            setUpdateLoading(false);
        }
    };

    const sendSMS = async (num) => {
        try {
            const phone = num; // country code + number (no +, no spaces)
            const message = "Please be reminded that you have outstanding fees pending. Kindly make the payment at the earliest to avoid any inconvenience. Thank you!";
            const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
            window.open(url, "_blank");
        }
        catch (error) {
            console.error("Error sending SMS:", error);
            alert("Failed to send SMS");
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/Accounts" className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <AlertTriangle className="w-6 h-6 text-amber-600" />
                                Defaulters List
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Students with outstanding dues</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search student..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg text-sm font-semibold hover:bg-amber-200 transition-colors">
                            <Mail className="w-4 h-4" />
                            Notify All
                        </button>
                    </div>
                </div>

                {/* Warning Banner */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 mb-8 rounded-r-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-bold text-amber-800 dark:text-amber-200">Payment Reminder Needed</h3>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                            There are {filteredStudents.length} students with pending payments. Please review and send reminders.
                        </p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student Info</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Academic</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Outstanding Amount</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right"> Notify</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">Loading records...</td>
                                    </tr>
                                ) : filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No pending dues found matching your search.</td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((s) => {
                                        const total = parseFloat(s.total_fee || 0);
                                        const pending = s["pending _fee"] !== null ? parseFloat(s["pending _fee"]) : total;

                                        return (
                                            <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors bg-red-50/30 dark:bg-red-900/10">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-700 dark:text-red-300 font-bold text-sm">
                                                            {s.name?.charAt(0) || 'S'}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900 dark:text-white text-sm">{s.name}</div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">{s.student_id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 dark:text-white font-medium">{s.course}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{s.department}</div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-bold">
                                                        <AlertTriangle className="w-3 h-3" /> ₹{pending.toLocaleString()}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">Total: ₹{total.toLocaleString()}</div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => sendSMS(s.Phone)}
                                                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-semibold hover:bg-amber-200 transition-colors">
                                                        Send SMS
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => openUpdateModal(s)}
                                                        className="p-2 text-gray-500 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400 transition-colors"
                                                        title="Update Payment"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Reuse Modal logic (could be a component but duplicating for now as per minimal change request) */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Collect Payment</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1.5">Student Name</label>
                                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-900 dark:text-gray-100 font-medium text-sm">
                                        {selectedStudent?.name}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1.5">New Outstanding Amount (₹)</label>
                                    <input
                                        type="number"
                                        value={newFee}
                                        onChange={(e) => setNewFee(e.target.value)}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-lg font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                                        placeholder="0.00"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Update this to reflect the remaining balance.</p>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={updateLoading}
                                        className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {updateLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                        {updateLoading ? "Processing..." : "Update Record"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
