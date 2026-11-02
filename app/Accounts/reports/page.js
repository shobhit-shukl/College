"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import DownloadReportButton from "@/app/Components/DownloadReportButton";

const rupees = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

// Fee totals grouped by a student field (department or course)
function summarize(students, field) {
    const groups = {};
    for (const s of students) {
        const key = s[field] || "Unassigned";
        const total = Number(s.total_fee) || 0;
        const pending = Number(s["pending _fee"]) || 0;
        const g = (groups[key] ||= { name: key, students: 0, total: 0, pending: 0 });
        g.students += 1;
        g.total += total;
        g.pending += pending;
    }
    return Object.values(groups)
        .map((g) => ({ ...g, collected: g.total - g.pending }))
        .sort((a, b) => b.total - a.total);
}

function SummaryTable({ title, label, rows }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <h2 className="px-6 py-4 text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">{title}</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-gray-900/40 text-gray-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">{label}</th>
                            <th className="px-6 py-3 text-right">Students</th>
                            <th className="px-6 py-3 text-right">Total Fees</th>
                            <th className="px-6 py-3 text-right">Collected</th>
                            <th className="px-6 py-3 text-right">Pending</th>
                            <th className="px-6 py-3 text-right">Collection</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-gray-700 dark:text-gray-200">
                        {rows.map((r) => {
                            const pct = r.total ? Math.round((r.collected / r.total) * 100) : 100;
                            return (
                                <tr key={r.name}>
                                    <td className="px-6 py-3 font-medium">{r.name}</td>
                                    <td className="px-6 py-3 text-right">{r.students}</td>
                                    <td className="px-6 py-3 text-right">{rupees(r.total)}</td>
                                    <td className="px-6 py-3 text-right text-emerald-600">{rupees(r.collected)}</td>
                                    <td className="px-6 py-3 text-right text-red-600">{rupees(r.pending)}</td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="w-24 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
                                            </div>
                                            <span className="w-10 text-right">{pct}%</span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function ReportsPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/students?all=true")
            .then((res) => res.json())
            .then((data) => setStudents(Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []))
            .catch((err) => console.error("Fetch error:", err))
            .finally(() => setLoading(false));
    }, []);

    const total = students.reduce((sum, s) => sum + (Number(s.total_fee) || 0), 0);
    const pending = students.reduce((sum, s) => sum + (Number(s["pending _fee"]) || 0), 0);
    const collected = total - pending;

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
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Audit</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Fee collection by department and course</p>
                        </div>
                    </div>
                    <DownloadReportButton apiEndpoint="/api/students" fileName="Fee_Report" />
                </div>

                {loading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { label: "Total Fees", value: rupees(total), color: "text-gray-900 dark:text-white" },
                                { label: "Collected", value: rupees(collected), color: "text-emerald-600" },
                                { label: "Outstanding", value: rupees(pending), color: "text-red-600" },
                            ].map((card) => (
                                <div key={card.label} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                    <p className="text-sm text-gray-500 uppercase tracking-wide">{card.label}</p>
                                    <p className={`text-3xl font-bold mt-1 ${card.color}`}>{card.value}</p>
                                </div>
                            ))}
                        </div>

                        <SummaryTable title="By Department" label="Department" rows={summarize(students, "department")} />
                        <SummaryTable title="By Course" label="Course" rows={summarize(students, "course")} />
                    </div>
                )}
            </div>
        </div>
    );
}
