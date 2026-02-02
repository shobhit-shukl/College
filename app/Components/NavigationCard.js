'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function NavigationCard({
  title,
  desc,
  href,
  icon: Icon,
  color = 'from-blue-500 to-indigo-600',
  badge,
  stats,
  className = ''
}) {
  return (
    <motion.div whileHover={{ y: -4 }} className={className}>
      <Link href={href} className="block group h-full">
        <div className="relative bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 shadow-card hover:shadow-card-hover transition-all h-full overflow-hidden">
          {/* Decorative gradient */}
          <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity`} />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                {Icon && <Icon className="w-6 h-6 text-white" />}
              </div>
              {badge && (
                <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-lg">
                  {badge}
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
              {desc}
            </p>

            <div className="flex items-center justify-between">
              {stats && (
                <span className="text-xs font-medium text-surface-400 dark:text-surface-500">
                  {stats}
                </span>
              )}
              <ArrowRight className="w-5 h-5 text-surface-300 dark:text-surface-600 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
