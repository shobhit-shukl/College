'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// ===== BUTTON COMPONENT =====
export const Button = forwardRef(({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon: Icon,
    iconPosition = 'left',
    className = '',
    ...props
}, ref) => {
    const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-md hover:shadow-lg',
        secondary: 'bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-500 shadow-md hover:shadow-lg',
        outline: 'bg-transparent border-2 border-primary-500 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 focus:ring-primary-500',
        ghost: 'bg-transparent text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
        success: 'bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500',
    };

    const sizes = {
        sm: 'px-3 py-2 text-xs',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
        xl: 'px-8 py-4 text-lg',
    };

    return (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-semibold
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
            {...props}
        >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {!loading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
            {children}
            {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
        </button>
    );
});

Button.displayName = 'Button';

// ===== INPUT COMPONENT =====
export const Input = forwardRef(({
    label,
    error,
    icon: Icon,
    className = '',
    ...props
}, ref) => {
    return (
        <div className="form-group">
            {label && (
                <label className="input-label">{label}</label>
            )}
            <div className="relative">
                {Icon && (
                    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                )}
                <input
                    ref={ref}
                    className={`input ${Icon ? 'pl-12' : ''} ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''} ${className}`}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

// ===== SELECT COMPONENT =====
export const Select = forwardRef(({
    label,
    error,
    options = [],
    placeholder = 'Select an option',
    className = '',
    ...props
}, ref) => {
    return (
        <div className="form-group">
            {label && (
                <label className="input-label">{label}</label>
            )}
            <select
                ref={ref}
                className={`select ${error ? 'border-red-500' : ''} ${className}`}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
});

Select.displayName = 'Select';

// ===== TEXTAREA COMPONENT =====
export const Textarea = forwardRef(({
    label,
    error,
    className = '',
    ...props
}, ref) => {
    return (
        <div className="form-group">
            {label && (
                <label className="input-label">{label}</label>
            )}
            <textarea
                ref={ref}
                className={`input min-h-[120px] resize-y ${error ? 'border-red-500' : ''} ${className}`}
                {...props}
            />
            {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
});

Textarea.displayName = 'Textarea';

// ===== CARD COMPONENT =====
export function Card({
    children,
    className = '',
    hover = false,
    glass = false,
    gradient = false,
    padding = 'md',
    ...props
}) {
    const paddingSizes = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    const baseClasses = glass
        ? 'card-glass'
        : gradient
            ? 'card-gradient'
            : 'card';

    return (
        <div
            className={`
        ${baseClasses}
        ${hover ? 'card-hover cursor-pointer' : ''}
        ${paddingSizes[padding]}
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
}

// ===== STAT CARD COMPONENT =====
export function StatCard({
    title,
    value,
    trend,
    trendDirection = 'up',
    icon: Icon,
    iconColor = 'primary',
    className = ''
}) {
    const iconColors = {
        primary: 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
        success: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
        warning: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
        danger: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
        info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className={`card p-6 ${className}`}
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${iconColors[iconColor]}`}>
                    {Icon && <Icon className="w-6 h-6" />}
                </div>
                {trend && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${trendDirection === 'up'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                        {trend}
                    </span>
                )}
            </div>
            <p className="stat-label">{title}</p>
            <h3 className="stat-value mt-1">{value}</h3>
        </motion.div>
    );
}

// ===== BADGE COMPONENT =====
export function Badge({ children, variant = 'primary', className = '' }) {
    const variants = {
        primary: 'badge-primary',
        success: 'badge-success',
        warning: 'badge-warning',
        danger: 'badge-danger',
        info: 'badge-info',
        neutral: 'badge-neutral',
    };

    return (
        <span className={`${variants[variant]} ${className}`}>
            {children}
        </span>
    );
}

// ===== AVATAR COMPONENT =====
export function Avatar({ src, alt, name, size = 'md', className = '' }) {
    const sizes = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-16 h-16 text-lg',
        xl: 'w-24 h-24 text-2xl',
    };

    if (src) {
        return (
            <img
                src={src}
                alt={alt || name}
                className={`avatar ${sizes[size]} ${className}`}
            />
        );
    }

    const initials = name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';

    return (
        <div
            className={`avatar ${sizes[size]} bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold ${className}`}
        >
            {initials}
        </div>
    );
}

// ===== PROGRESS BAR COMPONENT =====
export function ProgressBar({ value, max = 100, showLabel = false, className = '' }) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className={className}>
            {showLabel && (
                <div className="flex justify-between text-sm text-surface-500 dark:text-surface-400 mb-1">
                    <span>Progress</span>
                    <span>{percentage.toFixed(0)}%</span>
                </div>
            )}
            <div className="progress-bar">
                <motion.div
                    className="progress-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
}

// ===== SPINNER COMPONENT =====
export function Spinner({ size = 'md', className = '' }) {
    const sizes = {
        sm: 'w-4 h-4 border',
        md: 'w-6 h-6 border-2',
        lg: 'w-8 h-8 border-2',
        xl: 'w-12 h-12 border-3',
    };

    return (
        <div className={`${sizes[size]} border-surface-300 border-t-primary-500 rounded-full animate-spin ${className}`} />
    );
}

// ===== EMPTY STATE COMPONENT =====
export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className = ''
}) {
    return (
        <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
            {Icon && (
                <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-surface-400" />
                </div>
            )}
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">{title}</h3>
            {description && (
                <p className="text-surface-500 dark:text-surface-400 max-w-sm mb-6">{description}</p>
            )}
            {action}
        </div>
    );
}

// ===== MODAL COMPONENT =====
export function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md'
}) {
    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-[90vw]',
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="modal-overlay"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className={`modal ${sizes[size]}`}
            >
                {title && (
                    <div className="modal-header">
                        <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">{title}</h2>
                    </div>
                )}
                <div className="modal-body">
                    {children}
                </div>
                {footer && (
                    <div className="modal-footer">
                        {footer}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
