
import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated';
}

const Card: React.FC<CardProps> = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const cardVariants = {
      default: "bg-background border border-border-DEFAULT rounded-lg",
      elevated: "bg-background border border-border-DEFAULT rounded-lg shadow-md",
    };

    return (
      <div
        ref={ref}
        className={cn(cardVariants[variant], className)}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

export default Card;
