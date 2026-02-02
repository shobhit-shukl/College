"use client"
import { useState } from 'react';
import { useEffect } from 'react';
import Loader from '@/app/Components/Loader';
import { Eye } from 'lucide-react';
import { Clock, Calendar, CheckSquare, XSquare, User } from 'lucide-react';


export default function StaffAttendanceTable() {

    const [attendanceData, setattendanceData] = useState([]);
    console.log(attendanceData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/Staff-attendance");

                if (!res.ok) {
                    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
                }

                const data = await res.json();
                setattendanceData(data);

            } catch (err) {
                console.error("Fetch error:", err);

            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);


    if (loading) return <Loader />;

    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-6xl mx-auto shadow-2xl rounded-xl overflow-hidden">

                {/* Header with Gradient */}
                <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <h1 className="text-3xl font-bold flex items-center">
                        <Calendar className="w-6 h-6 mr-3" />
                        Staff Attendance Records
                    </h1>
                    <p className="mt-1 text-indigo-200">
                        Professional overview of all staff attendance data.
                    </p>
                </div>

                {/* Table Container */}
                <div className="bg-white">
                    <table className="min-w-full divide-y divide-gray-200">

                        {/* Table Head */}
                        <thead className="bg-gray-50">
                            <tr>
                                <TableHeader title="ID" Icon={User} />
                                <TableHeader title="Staff ID" Icon={User} />
                                <TableHeader title="Staff Name" Icon={User} />
                                <TableHeader title="Present" Icon={CheckSquare} />
                                <TableHeader title="Leaves" Icon={XSquare} />
                                <TableHeader title="Last Updated" Icon={Clock} />
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-gray-200">
                            {attendanceData.map((record) => (
                                <tr key={record.id} className="hover:bg-indigo-50/50 transition duration-150">
                                    <TableCell text={record.id} />
                                    <TableCell text={record.Staff_id} strong />
                                    <TableCell text={record.Staff_name} />
                                    <TableCell text={record.total_present} color="text-green-600" />
                                    <TableCell text={record.total_leaves} color="text-red-600" />
                                    <TableCell text={formatDate(record.created_at)} />
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Empty State/Footer */}
                    {attendanceData.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No attendance records found. Import data or add new entries.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Helper Components and Functions ---

// Component for Table Header Cell
const TableHeader = ({ title, Icon }) => (
    <th
        scope="col"
        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
    >
        <div className="flex items-center">
            <Icon className="w-4 h-4 mr-2" />
            {title}
        </div>
    </th>
);

// Component for Table Body Cell
const TableCell = ({ Icon, text, color, strong = false }) => (
    <td className="px-6 py-4 whitespace-nowrap text-sm">
        <span className={`font-mono ${strong ? 'font-semibold' : 'font-normal'} ${color}`}>
            {text}
        </span>
        <span>
            {Icon}
        </span>
    </td>
);

// Basic date formatting function
const formatDate = (dateString) => {
    // The ISO 8601 format ("YYYY-MM-DDTHH:mm:ss.sssZ") is parsed directly by the Date constructor.
    const d = new Date(dateString);

    if (isNaN(d.getTime())) {
        return "Invalid Date";
    }

    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit', // Added seconds for completeness, optional
        timeZoneName: 'short' // Shows the user's timezone (e.g., IST, EST)
    });
};


