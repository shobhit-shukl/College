"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaArrowLeft,
  FaSearch,
  FaBook,
  FaCalendarAlt,
  FaGraduationCap,
  FaFingerprint,
  FaBuilding,
  FaExclamationCircle,
} from "react-icons/fa";

export default function StudentDirectory() {
  const [issuedRecords, setIssuedRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchIssuedData = async () => {
      try {
        const response = await fetch("/api/student_issued");
        const data = await response.json();
        setIssuedRecords(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchIssuedData();
  }, []);

  const filteredRecords = issuedRecords.filter(
    (record) =>
      record.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.student_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-cyan-100 text-slate-800 px-6 py-10">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          <div>
            <Link
              href="/library"
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-emerald-600 hover:text-emerald-800 transition"
            >
              <FaArrowLeft /> DASHBOARD
            </Link>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
              Issued Assets Registry
            </h1>
            <p className="mt-2 text-sm text-slate-500 max-w-xl">
              Centralized record of students currently holding library resources.
            </p>
          </div>

          {/* SEARCH */}
          <div className="relative w-full lg:w-96">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or student ID"
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl bg-white border border-slate-200 py-3.5 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto space-y-4">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-xl bg-white/70 shadow-sm animate-pulse"
            />
          ))
        ) : filteredRecords.length === 0 ? (
          <div className="py-32 text-center rounded-2xl border border-dashed border-slate-300 bg-white/70">
            <FaExclamationCircle className="mx-auto text-4xl text-slate-300 mb-4" />
            <p className="text-xs tracking-widest uppercase text-slate-500">
              No records found
            </p>
          </div>
        ) : (
          filteredRecords.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-6 items-center rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition px-6 py-5"
            >
              {/* ID */}
              <div className="col-span-12 md:col-span-2">
                <p className="flex items-center gap-2 text-xs font-mono text-emerald-600">
                  <FaFingerprint />
                  {item.student_id}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-400">
                  Year {item.year} • Sem {item.semester}
                </p>
              </div>

              {/* STUDENT */}
              <div className="col-span-12 md:col-span-3">
                <p className="text-lg font-semibold text-slate-900">
                  {item.name}
                </p>
                <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                  <FaGraduationCap className="text-emerald-500" />
                  {item.course} — {item.department}
                </p>
              </div>

              {/* BOOK */}
              <div className="col-span-12 md:col-span-4">
                <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">
                  Issued Book
                </p>
                <p className="font-medium truncate text-slate-800">
                  {item["Book-Name"]}
                </p>
                <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                  <FaBuilding /> {item.Publisher}
                </p>
              </div>

              {/* META */}
              <div className="col-span-12 md:col-span-3 flex flex-col gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <FaBook className="text-emerald-500" />
                  {item["Book-category"]}
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-emerald-500" />
                  {new Date(item.issue_date).toLocaleDateString("en-GB")}
                </div>
                <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-emerald-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
