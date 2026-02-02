"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaLock,
  FaUsers,
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaGraduationCap,
  FaBuilding,
  FaUserCog
} from "react-icons/fa";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    Id: '',
    password: '',
    role: 'student'
  });

  const roles = [
    { value: 'student', label: 'Student', icon: FaGraduationCap, description: 'Access student portal', gradient: 'from-blue-500 to-indigo-600' },
    { value: 'professor', label: 'Professor', icon: FaUserCog, description: 'Professor access', gradient: 'from-purple-500 to-pink-600' },
    { value: 'coordinator', label: 'Coordinator', icon: FaUserCog, description: 'Coordinator access', gradient: 'from-cyan-500 to-blue-600' },
    { value: 'dean', label: 'Dean', icon: FaBuilding, description: 'Dean access', gradient: 'from-green-500 to-lime-600' },
    { value: 'hr', label: 'HR', icon: FaUsers, description: 'HR access', gradient: 'from-red-500 to-pink-500' },
    { value: 'librarian', label: 'Librarian', icon: FaUserCog, description: 'Librarian access', gradient: 'from-yellow-500 to-amber-600' },
    { value: 'Warden', label: 'Warden', icon: FaUserCog, description: 'Hostel Warden access', gradient: 'from-rose-500 to-pink-600' },
    { value: 'accountant', label: 'Accountant', icon: FaUserCog, description: 'Accountant access', gradient: 'from-indigo-500 to-violet-600' },
    { value: 'assistantprofessor', label: 'Assistant Professor', icon: FaUserCog, description: 'Assistant Professor access', gradient: 'from-pink-500 to-purple-600' },
    { value: 'admin', label: 'Admin', icon: FaBuilding, description: 'Administrative access', gradient: 'from-amber-500 to-orange-600' },
    { value: 'superadmin', label: 'Super Admin', icon: FaShieldAlt, description: 'Full system control', gradient: 'from-emerald-500 to-teal-600' },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // Store in localStorage for client-side access
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", formData.Id);
      if (data.profileUrl) localStorage.setItem("profileUrl", data.profileUrl);

      // Also set cookies for middleware authentication
      document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
      document.cookie = `role=${data.role}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days

      const redirectMap = {
        student: `/StudentDashboard?student_id=${formData.Id}`,
        professor: `/StaffDashboard?staff_id=${formData.Id}`,
        coordinator: `/StaffDashboard?staff_id=${formData.Id}`,
        dean: `/StaffDashboard?staff_id=${formData.Id}`,
        hr: `/StaffDashboard?staff_id=${formData.Id}`,
        Warden: `/StaffDashboard?staff_id=${formData.Id}`,
        librarian: `/StaffDashboard?staff_id=${formData.Id}`,
        accountant: `/StaffDashboard?staff_id=${formData.Id}`,
        assistantprofessor: `/StaffDashboard?staff_id=${formData.Id}`,
        admin: `/StaffDashboard?staff_id=${formData.Id}`,
        superadmin: `/Owner?admin_id=${formData.Id}`,
      };

      window.location.href = redirectMap[data.role];

    } catch (error) {
      alert("Something went wrong: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-3xl" />
        <div className="absolute top-[40%] left-[40%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-2xl font-black text-white">E</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">ERP<span className="text-teal-400">Pro</span></h1>
              <p className="text-slate-400 text-sm">Enterprise Resource Planning</p>
            </div>
          </div>

          {/* Tagline */}
          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            Manage your
            <span className="block bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">
              institution smarter
            </span>
          </h2>

          <p className="text-slate-400 text-lg mb-12">
            A comprehensive ERP solution designed for modern educational institutions.
            Streamline operations and enhance productivity.
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: FaUsers, label: 'User Management' },
              { icon: FaGraduationCap, label: 'Academic Records' },
              { icon: FaBuilding, label: 'HR Management' },
              { icon: FaShieldAlt, label: 'Secure Access' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <div className="p-2 rounded-lg bg-indigo-500/20">
                  <feature.icon className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-white text-sm font-medium">{feature.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center">
              <span className="text-xl font-bold text-white">E</span>
            </div>
            <span className="text-2xl font-bold text-white">ERP<span className="text-teal-400">Pro</span></span>
          </div>

          {/* Login Card */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-teal-500/20 border border-indigo-500/30 mb-4">
                <FaShieldAlt className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-slate-400 text-sm">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Select Your Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: role.value })}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${formData.role === role.value
                        ? `bg-gradient-to-br ${role.gradient} border-transparent shadow-lg`
                        : 'bg-slate-700/50 border-slate-600/50 hover:border-slate-500'
                        }`}
                    >
                      <role.icon className={`w-5 h-5 mb-2 ${formData.role === role.value ? 'text-white' : 'text-slate-400'}`} />
                      <p className={`text-sm font-semibold ${formData.role === role.value ? 'text-white' : 'text-slate-300'}`}>
                        {role.label}
                      </p>
                      <p className={`text-xs mt-0.5 ${formData.role === role.value ? 'text-white/70' : 'text-slate-500'}`}>
                        {role.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* User ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  User ID
                </label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    name="Id"
                    value={formData.Id}
                    onChange={(e) => setFormData({ ...formData, Id: e.target.value })}
                    required
                    placeholder="Enter your unique ID"
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl py-3.5 pl-12 pr-4 
                             text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 
                             focus:ring-indigo-500/20 transition-all duration-200 outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl py-3.5 pl-12 pr-12 
                             text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 
                             focus:ring-indigo-500/20 transition-all duration-200 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-indigo-500 focus:ring-indigo-500/20" />
                  <span className="text-slate-400">Remember me</span>
                </label>
                <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 
                         hover:to-indigo-400 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 
                         transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] 
                         disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Sign In
                      <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-slate-500 text-sm mt-8">
              New to the system?{' '}
              <a href="#" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Contact administrator
              </a>
            </p>
          </div>

          {/* Copyright */}
          <p className="text-center text-slate-600 text-xs mt-8">
            © 2025 ERP Pro. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}