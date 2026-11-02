import Link from "next/link";

// Small "← Back" link shown at the top of module sub-pages
export default function BackLink({ href, label = "Back", light = false }) {
  return (
    <Link
      href={href}
      className={`inline-block mb-6 text-sm font-semibold ${light ? "text-white/80 hover:text-white" : "text-indigo-600 hover:text-indigo-800"}`}
    >
      ← {label}
    </Link>
  );
}
