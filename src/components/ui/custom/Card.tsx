
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated';
  interactive?: boolean;
  children: React.ReactNode;
}

const Card = ({
  className,
  variant = 'default',
  interactive = false,
  children,
  ...props
}: CardProps) => {
  const variants = {
    default: 'bg-card border border-border rounded-xl shadow-soft',
    glass: 'glass-morphism rounded-xl backdrop-blur',
    elevated: 'bg-card border border-border rounded-xl shadow-medium'
  };

  const interactiveClasses = interactive
    ? 'transition-all duration-300 hover:shadow-medium hover:-translate-y-1 cursor-pointer'
    : '';

  return (
    <motion.div
      className={cn(variants[variant], interactiveClasses, className)}
      whileHover={interactive ? { y: -5, boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)' } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
