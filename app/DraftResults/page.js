'use client';

import { useState, useEffect } from 'react';
import DownloadReportButton from '../Components/DownloadReportButton';

export default function DraftResultsPage() {
  const [form, setForm] = useState({
    Student_id: '',
    Year: 1,
    semester: 1,
    CGPA: 0,
    Rank: 1,
    Exam_type: '',
    subjects: [''],
    marks: [''],
    total_marks: ['']
  });

  const [results, setResults] = useState([]);

  // Fetch results
  const fetchResults = async () => {
    try {
      const res = await fetch('/api/draft-results');
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("❌ Error fetching draft results:", err);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubjectChange = (i, val) => setForm({ ...form, subjects: form.subjects.map((s, idx) => idx === i ? val : s) });
  const handleMarksChange = (i, val) => setForm({ ...form, marks: form.marks.map((m, idx) => idx === i ? val : m) });
  const handleTotalMarksChange = (i, val) => setForm({ ...form, total_marks: form.total_marks.map((t, idx) => idx === i ? val : t) });

  const addRow = () => setForm({
    ...form,
    subjects: [...form.subjects, ''],
    marks: [...form.marks, ''],
    total_marks: [...form.total_marks, '']
  });

  const removeRow = (index) => setForm({
    ...form,
    subjects: form.subjects.filter((_, i) => i !== index),
    marks: form.marks.filter((_, i) => i !== index),
    total_marks: form.total_marks.filter((_, i) => i !== index)
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.subjects.length !== form.marks.length || form.marks.length !== form.total_marks.length) {
      alert("Subjects, Marks, and Total Marks arrays must be same length!");
      return;
    }

    const payload = {
      ...form,
      Year: Number(form.Year),
      semester: Number(form.semester),
      CGPA: Number(form.CGPA),
      Rank: Number(form.Rank),
      marks: form.marks.map(Number),
      total_marks: form.total_marks.map(Number)
    };

    const res = await fetch('/api/draft-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error || 'Failed to save draft result');

    alert('Draft Result Saved Successfully ✅');

    setForm({
      Student_id: '',
      Year: 1,
      semester: 1,
      CGPA: 0,
      Rank: 1,
      Exam_type: '',
      subjects: [''],
      marks: [''],
      total_marks: ['']
    });

    setResults(prev => [...prev, data.data]);
  };

  const handleDelete = async (studentId) => {
    if (!confirm('Are you sure you want to delete this draft result?')) return;

    try {
      const res = await fetch('/api/draft-results', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Student_id: studentId })
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error || 'Failed to delete draft result');

      setResults(prev => prev.filter(r => String(r.Student_id) !== String(studentId)));
      alert(data.message || 'Deleted successfully');
    } catch (err) {
      console.error('❌ Error deleting draft result:', err);
      alert('Failed to delete draft result');
    }
  };

  // Functions for quick stats
  const totalStudents = results.length;
  const avgCGPA = results.length > 0 ? (results.reduce((sum, r) => sum + r.CGPA, 0) / results.length).toFixed(2) : 0;
  const highestRank = results.length > 0 ? Math.min(...results.map(r => r.Rank)) : '-';

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Page Header */}
        <header className="text-center mb-10">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600">
            Student Draft Results Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Manage draft results, view summaries, and track student performance.</p>
        </header>

        {/* Quick Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 text-center hover:scale-105 transition">
            <p className="text-gray-500 font-semibold">Total Students</p>
            <p className="text-3xl font-bold text-indigo-600">{totalStudents}</p>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 text-center hover:scale-105 transition">
            <p className="text-gray-500 font-semibold">Average CGPA</p>
            <p className="text-3xl font-bold text-pink-600">{avgCGPA}</p>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 text-center hover:scale-105 transition">
            <p className="text-gray-500 font-semibold">Highest Rank</p>
            <p className="text-3xl font-bold text-indigo-600">{highestRank}</p>
          </div>
        </div>

        {/* Draft Entry Form */}
        <div className="bg-white shadow-lg rounded-3xl p-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6">📋 Draft Result Entry</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student ID */}
            <div>
              <label className="font-semibold text-gray-700">Student ID</label>
              <input
                name="Student_id"
                value={form.Student_id}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Enter Student ID"
              />
            </div>

            {/* Year & Semester */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-gray-700">Academic Year</label>
                <input
                  name="Year"
                  type="number"
                  value={form.Year}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700">Semester</label>
                <input
                  name="semester"
                  type="number"
                  value={form.semester}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            {/* CGPA & Rank */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-gray-700">CGPA</label>
                <input
                  name="CGPA"
                  type="number"
                  step="0.01"
                  value={form.CGPA}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700">Rank</label>
                <input
                  name="Rank"
                  type="number"
                  value={form.Rank}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            {/* Exam Type */}
            <div>
              <label className="font-semibold text-gray-700">Exam Type</label>
              <input
                name="Exam_type"
                value={form.Exam_type}
                onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="End-Sem / Mid-Sem etc."
              />
            </div>

            {/* Subjects & Marks */}
            <div className="border border-gray-200 rounded-2xl p-4 bg-indigo-50">
              <label className="font-semibold text-gray-700 mb-2 block">Subjects, Marks & Total Marks</label>
              {form.subjects.map((sub, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-3 mb-3 items-center">
                  <input
                    placeholder="Subject Name"
                    value={sub}
                    onChange={(e) => handleSubjectChange(i, e.target.value)}
                    className="flex-1 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <input
                    placeholder="Marks"
                    type="number"
                    value={form.marks[i]}
                    onChange={(e) => handleMarksChange(i, e.target.value)}
                    className="w-24 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <input
                    placeholder="Total Marks"
                    type="number"
                    value={form.total_marks[i]}
                    onChange={(e) => handleTotalMarksChange(i, e.target.value)}
                    className="w-24 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  {form.subjects.length > 1 && (
                    <button type="button" onClick={() => removeRow(i)} className="text-red-600 font-bold text-xl mt-1 md:mt-0">
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addRow} className="text-indigo-700 font-semibold text-sm hover:underline">
                + Add Another Subject
              </button>
            </div>

            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition">
              Save Draft Result
            </button>
          </form>
        </div>

        {/* Results Table */}
        <div className="bg-white shadow-lg rounded-3xl p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-800">📊 Saved Draft Results</h2>
            <DownloadReportButton apiEndpoint="/api/draft-results" fileName="DraftResults_Report" />
          </div>
          {results.length === 0 ? (
            <p className="text-gray-500">No draft results found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-indigo-100 rounded-xl">
                  <tr>
                    {['Student ID', 'Year', 'Semester', 'CGPA', 'Rank', 'Exam Type', 'Subjects', 'Marks', 'Total Marks', 'Action'].map((th) => (
                      <th key={th} className="border px-4 py-2 text-left text-gray-700">{th}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map(r => (
                    <tr key={r.id} className="text-center border-b hover:bg-indigo-50 transition">
                      <td className="border px-3 py-2">{r.Student_id}</td>
                      <td className="border px-3 py-2">{r.Year}</td>
                      <td className="border px-3 py-2">{r.semester}</td>
                      <td className="border px-3 py-2">{r.CGPA}</td>
                      <td className="border px-3 py-2">{r.Rank}</td>
                      <td className="border px-3 py-2">{r.Exam_type}</td>
                      <td className="border px-3 py-2">{(r.subjects || []).join(", ")}</td>
                      <td className="border px-3 py-2">{(r.marks || []).join(", ")}</td>
                      <td className="border px-3 py-2">{(r.total_marks || []).join(", ")}</td>
                      <td className="border px-3 py-2">
                        <button onClick={() => handleDelete(r.Student_id)} className="text-red-600 font-semibold hover:underline">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
