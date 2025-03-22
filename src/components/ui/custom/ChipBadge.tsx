
import { cn } from '@/lib/utils';
import React from 'react';

interface ChipBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const ChipBadge = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: ChipBadgeProps) => {
  const variantClasses = {
    default: 'bg-secondary text-secondary-foreground',
    primary: 'bg-primary/10 text-primary-foreground border border-primary/20',
    secondary: 'bg-accent text-accent-foreground',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
    danger: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 rounded-full',
    md: 'text-sm px-3 py-1 rounded-full',
    lg: 'text-base px-4 py-1.5 rounded-full',
  };

  return (
    <div 
      className={cn(
        'inline-flex items-center font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default ChipBadge;
