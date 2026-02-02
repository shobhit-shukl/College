"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Upload, 
  Trash2, 
  FileText, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TimetableManagement() {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    file: null,
    timetable_type: "",
    department: "",
  });

  const departments = [
    "Computer Science",
    "Electronics",
    "Mechanical",
    "Civil",
    "Electrical",
    "Information Technology",
    "Chemical",
    "Biotechnology",
  ];

  // Fetch all timetables
  const fetchTimetables = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/timetable");
      if (!res.ok) throw new Error("Failed to fetch timetables");
      const data = await res.json();
      setTimetables(data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load timetables");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetables();
  }, []);

  // Handle file upload
  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!formData.file || !formData.timetable_type || !formData.department) {
      toast.error("Please fill all fields and select a file");
      return;
    }

    try {
      setUploading(true);

      const fd = new FormData();
      fd.append("file", formData.file);
      fd.append("timetable_type", formData.timetable_type);
      fd.append("department", formData.department);

      const res = await fetch("/api/timetable", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      const newTimetable = await res.json();

      // Update UI
      setTimetables([newTimetable, ...timetables]);
      toast.success("Timetable uploaded successfully!");

      // Reset form
      setFormData({
        file: null,
        timetable_type: "",
        department: "",
      });
      e.target.reset();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id, file_url) => {
    if (!confirm("Are you sure you want to delete this timetable?")) {
      return;
    }

    try {
      const res = await fetch(`/api/timetable?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Delete failed");
      }

      // Update UI
      setTimetables(timetables.filter((t) => t.id !== id));
      toast.success("Timetable deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              Timetable Management
            </h1>
          </div>
          <p className="text-gray-600">
            Upload and manage timetables for students and staff
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-6">
                <Upload className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Upload New
                </h2>
              </div>

              <form onSubmit={handleFileUpload} className="space-y-4">
                {/* Timetable Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Timetable Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.timetable_type}
                    onChange={(e) =>
                      setFormData({ ...formData, timetable_type: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="student">Student Timetable</option>
                    <option value="staff">Staff Timetable</option>
                  </select>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    File (PDF, PNG, JPG) <span className="text-red-500">*</span>
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-indigo-50 hover:border-indigo-400 transition-all">
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        {formData.file ? (
                          <span className="font-semibold text-indigo-600">
                            {formData.file.name}
                          </span>
                        ) : (
                          <>
                            <span className="font-semibold">Click to upload</span>{" "}
                            or drag
                          </>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Max 10MB
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) =>
                        setFormData({ ...formData, file: e.target.files[0] })
                      }
                      required
                    />
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload Timetable
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Timetables List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  All Timetables
                </h2>
                <span className="px-4 py-1.5 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full">
                  {timetables.length} Total
                </span>
              </div>

              <div className="divide-y divide-gray-100 max-h-[calc(100vh-200px)] overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                  </div>
                ) : timetables.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <AlertCircle className="w-12 h-12 mb-3 text-gray-400" />
                    <p className="text-lg font-medium">No timetables uploaded yet</p>
                    <p className="text-sm">Upload your first timetable to get started</p>
                  </div>
                ) : (
                  timetables.map((timetable, index) => (
                    <motion.div
                      key={timetable.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-3 bg-indigo-100 rounded-xl">
                            <FileText className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  timetable.timetable_type === "student"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-purple-100 text-purple-700"
                                }`}
                              >
                                {timetable.timetable_type === "student"
                                  ? "Student"
                                  : "Staff"}
                              </span>
                              <span className="text-sm font-semibold text-gray-700">
                                {timetable.department}
                              </span>
                            </div>
                            <a
                              href={timetable.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                            >
                              View Timetable
                            </a>
                            <p className="text-xs text-gray-500 mt-1">
                              Uploaded:{" "}
                              {new Date(timetable.uploaded_at).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleDelete(timetable.id, timetable.file_url)
                          }
                          className="p-2 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 transition-all"
                          title="Delete timetable"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
