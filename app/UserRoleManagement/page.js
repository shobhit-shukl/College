'use client';
import { useEffect, useState } from 'react';
import { FiUsers, FiClock, FiSearch } from 'react-icons/fi';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import Pagination from '../Components/Pagination';
import DownloadReportButton from '../Components/DownloadReportButton';

export default function UserRoleManagement() {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10
    });
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    const fetchUsers = async (page = 1) => {
        try {
            const res = await fetch(`/api/users?page=${page}&limit=10`);
            const data = await res.json();

            if (data.pagination) {
                setUsers(data.data);
                setPagination(data.pagination);
            } else {
                // Fallback if API returns simple array
                setUsers(data);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    useEffect(() => {
        fetchUsers(1);
    }, []);

    async function changeRole(id, Staff_type) {
        await fetch('/api/users', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, Staff_type })
        });

        setUsers(prev =>
            prev.map(u =>
                u.id === id ? { ...u, Staff_type } : u
            )
        );
    }

    // Filter & Search
    const filteredUsers = users.filter(user => {
        const matchesRole = roleFilter ? user.Staff_type === roleFilter : true;
        const matchesSearch = user.Staff_name.toLowerCase().includes(search.toLowerCase())
            || user.Staff_email.toLowerCase().includes(search.toLowerCase());
        return matchesRole && matchesSearch;
    });

    // Stats calculation
    const roleStats = users.reduce((acc, user) => {
        acc[user.Staff_type || 'Professor'] = (acc[user.Staff_type || 'Professor'] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-50 p-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8 text-center relative">
                    <h1 className="text-5xl font-extrabold text-indigo-900 relative inline-block">
                        User Role Management
                        <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-indigo-600 to-indigo-500 rounded-full animate-pulse"></span>
                    </h1>
                    <p className="text-indigo-700 mt-3 text-lg">
                        Manage your staff roles and permissions <span className="font-semibold">seamlessly</span> ✨
                    </p>

                    {/* Stats Cards */}
                    <div className="mt-6 flex justify-center gap-6 flex-wrap">
                        <div className="bg-indigo-50/70 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border border-indigo-200 flex items-center gap-3 transition transform hover:-translate-y-1 hover:shadow-2xl">
                            <FiUsers className="text-indigo-500 text-2xl" />
                            <span className="text-indigo-800 font-semibold">
                                Total Users: {users.length}
                            </span>
                        </div>
                        {Object.keys(roleStats).map(role => (
                            <div key={role} className="bg-indigo-50/70 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border border-indigo-200 flex items-center gap-3 transition transform hover:-translate-y-1 hover:shadow-2xl">
                                <span className="text-indigo-500 font-bold">{role}</span>
                                <span className="text-indigo-800 font-semibold">{roleStats[role]}</span>
                            </div>
                        ))}
                        <div className="bg-indigo-50/70 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border border-indigo-200 flex items-center gap-3">
                            <FiClock className="text-indigo-500 text-2xl" />
                            <span className="text-indigo-800 font-semibold">
                                Last Update: {new Date().toLocaleTimeString()}
                            </span>
                        </div>
                    </div>

                    {/* Search & Filter */}
                    <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Search by name or email"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full rounded-xl border border-indigo-300 px-4 py-2 text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 shadow-sm"
                            />
                            <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
                        </div>

                        <select
                            value={roleFilter}
                            onChange={e => setRoleFilter(e.target.value)}
                            className="rounded-xl border border-indigo-300 px-4 py-2 text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 shadow-sm"
                        >
                            <option value="">Filter by Role</option>
                            <option value="Professor">Professor</option>
                            <option value="Coordinator">Coordinator</option>
                            <option value="Dean">Dean</option>
                            <option value="HR">HR</option>
                            <option value="Librarian">Librarian</option>
                            <option value="Accountant">Accountant</option>
                            <option value="Warden">Warden</option>
                            <option value="Admin">Admin</option>
                            <option value="Assistant Professor">Assistant Professor</option>
                        </select>

                        <DownloadReportButton
                            apiEndpoint="/api/users"
                            fileName="User_Roles_Report"
                            className="bg-indigo-600 hover:bg-indigo-700"
                        />
                    </div>
                </div>

                {/* Table Card */}
                <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-indigo-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-indigo-100 to-indigo-50">
                            <tr>
                                <th className="p-4 text-left text-sm font-semibold text-indigo-700">
                                    Name
                                </th>
                                <th className="p-4 text-left text-sm font-semibold text-indigo-700">
                                    Email
                                </th>
                                <th className="p-4 text-left text-sm font-semibold text-indigo-700">
                                    Role
                                </th>
                                <th className="p-4 text-left text-sm font-semibold text-indigo-700">
                                    Dept
                                </th>
                                <th className="p-4 text-left text-sm font-semibold text-indigo-700">
                                    Staff ID
                                </th>
                                <th className="p-4 text-left text-sm font-semibold text-indigo-700">
                                    Created At
                                </th>
                                <th className="p-4 text-left text-sm font-semibold text-indigo-700">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredUsers.map(user => (
                                <tr
                                    key={user.id}
                                    className="border-t hover:bg-indigo-50 transition-all duration-300 group"
                                >
                                    <td className="p-4 font-medium text-indigo-900">
                                        {user.Staff_name}
                                    </td>

                                    <td className="p-4 text-indigo-700">
                                        {user.Staff_email}
                                    </td>

                                    <td className="p-4">
                                        <select
                                            value={
                                                user.Staff_type && user.Staff_type.trim() !== ''
                                                    ? user.Staff_type
                                                    : 'Professor'
                                            }
                                            onChange={e =>
                                                changeRole(user.id, e.target.value)
                                            }
                                            className="
                                                rounded-lg border border-indigo-300
                                                bg-white px-3 py-2 text-sm text-indigo-800
                                                focus:outline-none focus:ring-2 focus:ring-indigo-400
                                                focus:border-indigo-500
                                                transition-all duration-200
                                                group-hover:shadow-md
                                            "
                                        >
                                            <option value="Professor">Professor</option>
                                            <option value="Coordinator">Coordinator</option>
                                            <option value="Dean">Dean</option>
                                            <option value="HR">HR</option>
                                            <option value="Librarian">Librarian</option>
                                            <option value="Accountant">Accountant</option>
                                            <option value="Warden">Warden</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Assistant Professor">
                                                Assistant Professor
                                            </option>
                                        </select>
                                    </td>

                                    <td className="p-4 text-indigo-700 font-medium">
                                        {user.Staff_dept || "-"}
                                    </td>

                                    <td className="p-4 text-indigo-600 font-mono">
                                        {user.Staff_id}
                                    </td>

                                    <td className="p-4 text-indigo-500 text-xs">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>

                                    <td className="p-4 flex items-center gap-2 text-green-700 font-semibold">
                                        <AiOutlineCheckCircle className="w-5 h-5 animate-pulse" />
                                        Active
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Footer / Pagination */}
                    <div className="border-t border-indigo-100 bg-indigo-50/50">
                        {users.length > 0 && pagination.totalPages > 1 && (
                            <Pagination
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                totalItems={pagination.totalItems}
                                itemsPerPage={pagination.itemsPerPage}
                                onPageChange={(page) => fetchUsers(page)}
                            />
                        )}
                        <div className="p-4 flex justify-between text-xs text-indigo-400">
                            <span>Showing: {users.length} items</span>
                            <span>Total Results: {pagination.totalItems || users.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
