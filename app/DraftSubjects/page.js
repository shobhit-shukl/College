'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaBookOpen } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function DraftSubjectsPage() {
  const [course, setCourse] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [subjects, setSubjects] = useState([{ subjectName: '', subjectCode: '' }]);
  const [loading, setLoading] = useState(false);

  const handleAddRow = () =>
    setSubjects([...subjects, { subjectName: '', subjectCode: '' }]);

  const handleRemoveRow = (index) =>
    setSubjects(subjects.filter((_, i) => i !== index));

  const handleChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!course || !branch || !year || !semester) {
      alert('Please fill all fields');
      return;
    }

    const payload = {
      course,
      branch,
      year: Number(year),
      semester: Number(semester),
      subjects,
    };

    setLoading(true);

    try {
      const res = await fetch('/api/draft-subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 409) {
        alert('This course, branch, year & semester is already defined');
        return;
      }

      if (!res.ok) throw new Error('Failed to save draft');

      alert('Subjects drafted successfully!');

      // reset
      setCourse('');
      setBranch('');
      setYear('');
      setSemester('');
      setSubjects([{ subjectName: '', subjectCode: '' }]);
      // refresh drafts list
      fetchDrafts();
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // ---------- Fetch drafts ----------
  const [drafts, setDrafts] = useState([]);
  const [fetching, setFetching] = useState(false);

  const fetchDrafts = async () => {
    setFetching(true);
    try {
      const res = await fetch('/api/draft-subjects');
      if (!res.ok) {
        console.error('Failed to fetch drafts', res.status);
        setDrafts([]);
        return;
      }

      const ct = res.headers.get('content-type') || '';

      // handle 204 No Content or empty body
      if (res.status === 204) {
        setDrafts([]);
        return;
      }

      let data = null;
      if (ct.includes('application/json')) {
        try {
          data = await res.json();
        } catch (err) {
          console.error('Invalid JSON response for drafts', err);
          setDrafts([]);
          return;
        }
      } else {
        // fallback: try to read text and parse
        const text = await res.text();
        if (!text) {
          setDrafts([]);
          return;
        }
        try {
          data = JSON.parse(text);
        } catch (err) {
          console.error('Non-JSON response for drafts', text);
          setDrafts([]);
          return;
        }
      }

      if (data?.success) setDrafts(data.data || []);
    } catch (err) {
      console.error('Failed to load drafts', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          Draft Subjects
        </h1>
        <p className="text-gray-500 text-lg">
          Define subjects for course, branch, year & semester
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto bg-white rounded-3xl p-8 shadow-2xl border space-y-8"
      >
        {/* Course details */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <input
            type="text"
            placeholder="Course (e.g. BCA)"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="p-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500"
            required
          />

          <input
            type="text"
            placeholder="Branch (e.g. AI/ML)"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="p-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500"
            required
          />

          <input
            type="number"
            placeholder="Year (e.g. 1)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="p-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500"
            required
            min={1}
          />

          <input
            type="number"
            placeholder="Semester (e.g. 1)"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="p-4 rounded-2xl border focus:ring-2 focus:ring-indigo-500"
            required
            min={1}
          />
        </div>

        {/* Subjects */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Subjects
          </h2>

          <div className="space-y-4">
            {subjects.map((sub, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center bg-indigo-50 p-4 rounded-2xl"
              >
                <input
                  type="text"
                  placeholder="Subject Name"
                  value={sub.subjectName}
                  onChange={(e) =>
                    handleChange(index, 'subjectName', e.target.value)
                  }
                  className="md:col-span-2 p-3 rounded-xl border"
                  required
                />

                <input
                  type="text"
                  placeholder="Subject Code"
                  value={sub.subjectCode}
                  onChange={(e) =>
                    handleChange(index, 'subjectCode', e.target.value)
                  }
                  className="p-3 rounded-xl border"
                  required
                />

                <button
                  type="button"
                  onClick={() => handleRemoveRow(index)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-xl"
                >
                  <FaTrash /> Remove
                </button>
              </motion.div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddRow}
            className="mt-4 inline-flex items-center gap-3 px-5 py-3 bg-indigo-100 text-indigo-700 rounded-2xl"
          >
            <FaPlus /> Add Another Subject
          </button>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold ${
              loading
                ? 'bg-gray-400 text-white'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            <FaBookOpen /> {loading ? 'Saving...' : 'Save Draft'}
          </button>
        </div>
      </motion.form>

      {/* ---------- CARDS ---------- */}
      <div className="max-w-7xl mx-auto mt-12">
        <h2 className="text-3xl font-bold mb-6">Drafted Data</h2>

        {fetching && <p className="text-gray-500">Loading...</p>}
        {!fetching && drafts.length === 0 && (
          <p className="text-gray-500">No drafts found</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {drafts.map((d) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-indigo-600">
                {d.course} – {d.branch}
              </h3>
              <p className="text-gray-600 mb-4">Year {d.year} • Sem {d.semester}</p>

              <div className="space-y-2">
                {d.subjects.map((s, i) => (
                  <div
                    key={i}
                    className="flex justify-between bg-indigo-50 px-3 py-2 rounded-xl text-sm"
                  >
                    <span>{s.subjectName}</span>
                    <span className="text-gray-600">{s.subjectCode}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-400 mt-4">{new Date(d.created_at).toLocaleString()}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
