'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Loader2, CheckCircle, Hash, Book, Building2, Layers } from "lucide-react";

export default function AddBookModal({ close }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    "Book-Id": "",
    "Book-Name": "",
    "Publisher": "",
    "Book-category": "",
    "Stock": ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/bookdetails', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add book");

      setSuccess(true);
      setTimeout(() => {
        close();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'literature', label: 'Literature' },
    { value: 'history', label: 'History' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'others', label: 'Others' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={close}
        className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="relative p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600 to-teal-600 flex items-center justify-center shadow-md">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Book</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Fill in the book details below</p>
              </div>
            </div>
            <button
              onClick={close}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="mx-6 mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mx-6 mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm">
              Book added successfully!
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Book ID */}
            <div>
              <label htmlFor="Book-Id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Book ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  id="Book-Id"
                  name="Book-Id"
                  type="text"
                  placeholder="e.g., BK-001"
                  value={form["Book-Id"]}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 
                           rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all duration-200 shadow-sm"
                />
              </div>
            </div>

            {/* Book Name */}
            <div>
              <label htmlFor="Book-Name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Book Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Book className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  id="Book-Name"
                  name="Book-Name"
                  type="text"
                  placeholder="Enter book title"
                  value={form["Book-Name"]}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 
                           rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all duration-200 shadow-sm"
                />
              </div>
            </div>

            {/* Publisher */}
            <div>
              <label htmlFor="Publisher" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Publisher
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  id="Publisher"
                  name="Publisher"
                  type="text"
                  placeholder="Enter publisher name"
                  value={form["Publisher"]}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 
                           rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all duration-200 shadow-sm"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="Book-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <select
                  id="Book-category"
                  name="Book-category"
                  value={form["Book-category"]}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 
                           rounded-xl text-gray-900 dark:text-white cursor-pointer appearance-none
                           focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all duration-200 shadow-sm
                           bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyMCAyMCI+PHBhdGggc3Ryb2tlPSIjNmI3MjgwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMS41IiBkPSJNNiA4bDQgNCA0LTR6Ii8+PC9zdmc+')] bg-[length:1.25em] bg-[right_1rem_center] bg-no-repeat"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stock */}
            <div>
              <label htmlFor="Stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  id="Stock"
                  name="Stock"
                  type="number"
                  min="1"
                  placeholder="Enter quantity"
                  value={form["Stock"]}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 
                           rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all duration-200 shadow-sm"
                />
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="p-6 pt-0 flex gap-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <button
              type="button"
              onClick={close}
              className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                       rounded-xl font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 
                       text-white rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-95
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Added!
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Add Book
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}