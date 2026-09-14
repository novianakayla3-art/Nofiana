import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'blue-outline';
  children: React.ReactNode;
  className?: string;
  id?: string;
  key?: React.Key;
}

export function Badge({
  variant = 'default',
  className = '',
  children,
  ...props
}: BadgeProps) {
  let variantClasses = 'bg-slate-100 text-slate-800 border-transparent';

  if (variant === 'secondary') {
    variantClasses = 'bg-blue-50 text-blue-900 border border-blue-200/80';
  } else if (variant === 'outline') {
    variantClasses = 'border border-slate-300 text-slate-700 bg-transparent';
  } else if (variant === 'blue-outline') {
    variantClasses = 'border border-blue-600/30 text-blue-700 bg-blue-50/60 font-medium';
  } else if (variant === 'default') {
    variantClasses = 'bg-blue-600 text-white border-transparent';
  }

  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
