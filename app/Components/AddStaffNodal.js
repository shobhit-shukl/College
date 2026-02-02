'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Loader2, CheckCircle, Mail, User, Building, Hash } from "lucide-react";

export default function AddStaffModal({ close }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [newStaff, setNewStaff] = useState({
    id: "",
    name: "",
    department: "",
    email: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStaff((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/staff', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStaff),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add staff");

      setSuccess(true);
      setTimeout(() => {
        close();
        if (typeof window !== 'undefined') window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'administration', label: 'Administration' },
    { value: 'finance', label: 'Finance' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'it', label: 'IT Support' },
    { value: 'academics', label: 'Academics' },
    { value: 'library', label: 'Library' },
    { value: 'maintenance', label: 'Maintenance' },
  ];

  const formFields = [
    { key: 'id', label: 'Employee ID', icon: Hash, placeholder: 'e.g., EMP-001', type: 'text' },
    { key: 'name', label: 'Full Name', icon: User, placeholder: 'Enter full name', type: 'text' },
    { key: 'email', label: 'Email Address', icon: Mail, placeholder: 'email@example.com', type: 'email' },
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
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-md">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Staff Member</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Fill in the details to add a new employee</p>
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
              Staff added successfully!
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {formFields.map((field) => (
              <div key={field.key}>
                <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {field.label} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    id={field.key}
                    name={field.key}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={newStaff[field.key]}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 
                             rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                             focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-200 shadow-sm"
                  />
                </div>
              </div>
            ))}

            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Department <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <select
                  id="department"
                  name="department"
                  value={newStaff.department}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 
                           rounded-xl text-gray-900 dark:text-white cursor-pointer appearance-none
                           focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-200 shadow-sm
                           bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyMCAyMCI+PHBhdGggc3Ryb2tlPSIjNmI3MjgwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMS41IiBkPSJNNiA4bDQgNCA0LTR6Ii8+PC9zdmc+')] bg-[length:1.25em] bg-[right_1rem_center] bg-no-repeat"
                >
                  <option value="">Select a department</option>
                  {departments.map((dept) => (
                    <option key={dept.value} value={dept.value}>{dept.label}</option>
                  ))}
                </select>
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
              form="add-staff-form" // If needed, but since form has onSubmit, type="submit" would work if button is inside form
              disabled={loading || success}
              onClick={handleSubmit} // Keep for safety, but ideally use type="submit"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 
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
                  Add Staff
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}