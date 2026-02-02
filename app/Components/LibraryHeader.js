'use client';

import Link from 'next/link';
import { ArrowLeft, Library, Plus } from 'lucide-react';

export default function LibraryHeader({ openAddModal }) {
  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Link
          href="/Owner"
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Library className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Library Management</h1>
            <p className="text-white/70 text-sm">Manage books, members, and transactions</p>
          </div>
        </div>
      </div>

      <button
        onClick={openAddModal}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-cyan-600 rounded-xl 
                 font-semibold text-sm shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
      >
        <Plus className="w-4 h-4" />
        Add Book
      </button>
    </header>
  );
}
