"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  User, 
  Calendar, 
  Send, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2,
  ListFilter,
  BookMarked,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function IssueBookPage() {
  // 1. State for Form Data
  const [formData, setFormData] = useState({
    staff_id: '',
    student_id: '',
    book_id: '',
    issue_date: new Date().toISOString().substring(0, 10),
  });

  // 2. State for UI Feedback & Data List
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [issuedbooks, setissuedbooks] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(true);

  // 3. Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. GET Request: Fetching the list of issued books on load
  const fetchIssuedBooks = async () => {
    setIsLoadingList(true);
    try {
      const res = await fetch(`/api/issue-book`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      // Safety check to ensure we set an array
      setissuedbooks(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchIssuedBooks();
  }, []);

  // 5. POST Request: Handle Form Submission
const handleSubmit = async (e) => {
    // 1. Prevent the page from refreshing
    if (e && e.preventDefault) e.preventDefault();

    // 2. Start loading state
    setIsSubmitting(true);
    setSuccess(false);

    try {
        // 3. Perform the POST request
        const response = await fetch('/api/issue-book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), // Sends staff_id, student_id, book_id, issue_date
        });

        const result = await response.json();

        // 4. Check if the server responded with an error
        if (!response.ok) {
            throw new Error(result.error || 'Failed to record transaction');
        }

        // 5. Handle Success
        setSuccess(true);
        console.log("Server Response:", result);

        // Optional: Clear the form after success
        setFormData({
            staff_id: '',
            student_id: '',
            book_id: '',
            issue_date: new Date().toISOString().substring(0, 10),
        });

        // Refresh the table list below to show the new entry
        if (typeof fetchIssuedBooks === 'function') {
            fetchIssuedBooks();
        }

    } catch (error) {
        console.error("Submission Error:", error.message);
        alert(`Error: ${error.message}`);
    } finally {
        // 6. Stop loading state
        setIsSubmitting(false);
    }
};

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans flex flex-col items-center p-6 relative overflow-x-hidden">
      
      {/* Dynamic Background Accents */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-100/50 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-indigo-50 rounded-full blur-[100px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl relative z-10"
      >
        {/* Navigation Bar */}
        <div className="flex justify-between items-center mb-8">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-purple-600 transition-colors group font-semibold text-sm">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                Return to Dashboard
            </Link>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-300">System Secure Connection</div>
        </div>

        {/* --- FORM SECTION --- */}
        <div className="bg-white shadow-[0_20px_50px_rgba(109,40,217,0.06)] border border-purple-100 rounded-[2.5rem] overflow-hidden mb-12 backdrop-blur-sm">
          <div className="bg-purple-600 p-6 md:p-10 text-white flex justify-between items-center relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold tracking-tight mb-1">Issue Transaction</h1>
              <p className="text-purple-100 text-xs font-medium opacity-90 uppercase tracking-[0.2em]">New Library Log Entry</p>
            </div>
            <div className="p-4 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md relative z-10">
                <BookOpen size={32} className="text-white" />
            </div>
            <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Field: Date */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Issue Date</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 group-focus-within:text-purple-600 transition-colors" />
                  <input type="date" name="issue_date" value={formData.issue_date} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 p-3.5 pl-12 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500 outline-none transition-all" />
                </div>
              </div>

              {/* Field: Staff ID */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Authorized Staff ID</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 group-focus-within:text-purple-600 transition-colors" />
                  <input type="text" name="staff_id" placeholder="Enter Staff ID" required value={formData.staff_id} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 p-3.5 pl-12 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500 outline-none transition-all" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Field: Student ID */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Recipient Student ID</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input type="text" name="student_id" placeholder="STU-2025-001" required value={formData.student_id} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 p-3.5 pl-12 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 outline-none transition-all" />
                </div>
              </div>

              {/* Field: Book ID */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Book / Asset ID</label>
                <div className="relative group">
                  <BookMarked className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-fuchsia-400 group-focus-within:text-fuchsia-600 transition-colors" />
                  <input type="text" name="book_id" placeholder="BK-9912" required value={formData.book_id} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 p-3.5 pl-12 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-fuchsia-500/5 focus:border-fuchsia-600 outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className={`w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] ${
                  success 
                  ? 'bg-emerald-500 text-white shadow-emerald-200' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-200'
                }`}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : success ? (
                  <>
                    <CheckCircle2 size={18} />
                    Authorized Successfully
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Finalize Issuance
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* --- DATA TABLE SECTION --- */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                    <ListFilter size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Recent Transactions</h2>
            </div>
            <div className="text-[10px] font-bold bg-white border border-purple-100 text-purple-600 px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-sm">
              Records Count: {issuedbooks.length}
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-purple-100 rounded-[2.5rem] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-purple-50/50 border-b border-purple-100">
                    <th className="p-6 text-[10px] font-bold text-purple-500 uppercase tracking-widest">Book ID</th>
                    <th className="p-6 text-[10px] font-bold text-purple-500 uppercase tracking-widest">Student</th>
                    <th className="p-6 text-[10px] font-bold text-purple-500 uppercase tracking-widest">Staff</th>
                    <th className="p-6 text-[10px] font-bold text-purple-500 uppercase tracking-widest">Issue Date</th>
                    <th className="p-6 text-[10px] font-bold text-purple-500 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50">
                  <AnimatePresence>
                    {isLoadingList ? (
                      <tr>
                        <td colSpan="5" className="p-20 text-center">
                            <Loader2 className="animate-spin text-purple-400 mx-auto" size={32} />
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-4">Syncing Records...</p>
                        </td>
                      </tr>
                    ) : issuedbooks.length > 0 ? (
                      issuedbooks.map((item, index) => (
                        <motion.tr 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          key={item.id || index} 
                          className="hover:bg-purple-50/40 transition-colors group"
                        >
                          <td className="p-6">
                            <span className="text-sm font-bold text-slate-700 group-hover:text-purple-700 transition-colors flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                {item.book_id}
                            </span>
                          </td>
                          <td className="p-6 text-sm font-semibold text-slate-600">{item.student_id}</td>
                          <td className="p-6 text-sm font-medium text-slate-400">{item.staff_id}</td>
                          <td className="p-6 text-sm font-medium text-slate-500">
                            {item.issue_date}
                          </td>
                          <td className="p-6">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase border border-emerald-100 shadow-sm">
                              <CheckCircle2 size={10} /> Active
                            </span>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-20 text-center">
                          <div className="text-slate-300 italic text-sm">No recent issue logs available.</div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center pb-10">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">
                Library Automated Terminal v2.0.4
            </p>
            <div className="w-12 h-1 bg-purple-100 mx-auto rounded-full" />
        </div>
      </motion.div>
    </div>
  );
}