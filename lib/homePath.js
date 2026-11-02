// Where the "back to dashboard" links should go for the logged-in user.
// Admin-level roles land on /Owner; other staff on their own StaffDashboard.
export function homePath() {
  if (typeof window === "undefined") return "/";
  const role = String(localStorage.getItem("role") || "").toLowerCase();
  const id = encodeURIComponent(localStorage.getItem("userId") || "");

  if (["superadmin", "admin", "dean"].includes(role)) return "/Owner";
  if (role === "student") return `/StudentDashboard?student_id=${id}`;
  if (role) return `/StaffDashboard?staff_id=${id}`;
  return "/";
}
