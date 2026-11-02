"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Search } from "lucide-react";
import DownloadReportButton from "@/app/Components/DownloadReportButton";

const rupees = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

// Per-student fee ledger: what each student owes, has paid and still owes
export default function TransactionsPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch("/api/students?all=true")
            .then((res) => res.json())
            .then((data) => setStudents(Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []))
            .catch((err) => console.error("Fetch error:", err))
            .finally(() => setLoading(false));
    }, []);

    const rows = students
        .map((s) => {
            const total = Number(s.total_fee) || 0;
            const pending = Number(s["pending _fee"]) || 0;
            return { ...s, total, pending, paid: total - pending };
        })
        .filter((s) =>
            !search ||
            String(s.name || "").toLowerCase().includes(search.toLowerCase()) ||
            String(s.student_id || "").toLowerCase().includes(search.toLowerCase())
        );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 w-full">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/Accounts" className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Fee ledger for every enrolled student</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search name or ID"
                                className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200"
                            />
                        </div>
                        <DownloadReportButton apiEndpoint="/api/students" fileName="Fee_Ledger" />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900/40 text-gray-500 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Student</th>
                                    <th className="px-6 py-3">Course</th>
                                    <th className="px-6 py-3 text-right">Fee Due</th>
                                    <th className="px-6 py-3 text-right">Paid</th>
                                    <th className="px-6 py-3 text-right">Balance</th>
                                    <th className="px-6 py-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-gray-700 dark:text-gray-200">
                                {rows.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-10 text-center text-gray-400">No students found</td>
                                    </tr>
                                )}
                                {rows.map((s) => (
                                    <tr key={s.id}>
                                        <td className="px-6 py-3">
                                            <p className="font-medium text-gray-900 dark:text-white">{s.name}</p>
                                            <p className="text-xs text-gray-500">{s.student_id}</p>
                                        </td>
                                        <td className="px-6 py-3">{s.course} · {s.department}</td>
                                        <td className="px-6 py-3 text-right">{rupees(s.total)}</td>
                                        <td className="px-6 py-3 text-right text-emerald-600">{rupees(s.paid)}</td>
                                        <td className="px-6 py-3 text-right text-red-600">{rupees(s.pending)}</td>
                                        <td className="px-6 py-3 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${s.pending > 0 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                                                {s.pending > 0 ? "Partially paid" : "Paid in full"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
