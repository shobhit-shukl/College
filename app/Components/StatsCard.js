'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color = 'from-blue-500 to-indigo-600',
  trend,
  trendUp = true,
  className = ''
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 shadow-card hover:shadow-card-hover transition-all overflow-hidden group ${className}`}
    >
      {/* Background Gradient on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity`} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
            {Icon && <Icon className="w-6 h-6 text-white" />}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${trendUp
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              }`}>
              {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend}
            </div>
          )}
        </div>

        <p className="text-sm font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide">
          {title}
        </p>
        <h3 className="text-3xl font-bold text-surface-900 dark:text-white mt-1">
          {value}
        </h3>
      </div>
    </motion.div>
  );
}
