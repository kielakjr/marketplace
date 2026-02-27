import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className }: CardProps) => {
  return (
    <div className={cn('rounded-2xl border border-brand-200 bg-white p-6 shadow-sm', className)}>
      {children}
    </div>
  );
};

export default Card;
