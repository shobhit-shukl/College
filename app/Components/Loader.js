'use client';

import { motion } from 'framer-motion';

export default function Loader({
  size = 'md',
  variant = 'spinner',
  text = 'Loading...',
  fullScreen = false,
  className = ''
}) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const SpinnerLoader = () => (
    <div className={`${sizes[size]} border-3 border-surface-200 dark:border-surface-700 border-t-primary-500 rounded-full animate-spin ${className}`} />
  );

  const DotsLoader = () => (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`w-2 h-2 rounded-full bg-primary-500`}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );

  const PulseLoader = () => (
    <motion.div
      className={`${sizes[size]} rounded-full bg-primary-500/20`}
      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <div className={`${sizes[size]} rounded-full bg-primary-500/40 flex items-center justify-center`}>
        <div className={`w-1/2 h-1/2 rounded-full bg-primary-500`} />
      </div>
    </motion.div>
  );

  const BarsLoader = () => (
    <div className="flex items-end gap-1 h-6">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 bg-primary-500 rounded-full"
          animate={{ height: ['40%', '100%', '40%'] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );

  const loaders = {
    spinner: <SpinnerLoader />,
    dots: <DotsLoader />,
    pulse: <PulseLoader />,
    bars: <BarsLoader />,
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          {loaders[variant]}
          {text && (
            <p className="text-sm font-medium text-surface-600 dark:text-surface-400 animate-pulse">
              {text}
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {loaders[variant]}
      {text && (
        <p className="text-sm font-medium text-surface-500 dark:text-surface-400">
          {text}
        </p>
      )}
    </div>
  );
}

// Simple inline spinner for buttons
export function Spinner({ size = 'sm', className = '' }) {
  const sizes = {
    xs: 'w-3 h-3 border',
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-2',
  };

  return (
    <div className={`${sizes[size]} border-white/30 border-t-white rounded-full animate-spin ${className}`} />
  );
}
