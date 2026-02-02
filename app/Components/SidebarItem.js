export default function SidebarItem({ icon, label, active }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all
        ${
          active
            ? "bg-emerald-100 text-emerald-700 font-semibold shadow-sm"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{label}</span>
    </div>
  );
}
