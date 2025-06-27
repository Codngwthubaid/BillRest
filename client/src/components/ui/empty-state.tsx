import React from 'react';
import { type DivideIcon as LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: typeof LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  compact?: boolean;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  compact = false,
  className
}) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center',
      compact ? 'py-8' : 'py-16',
      className
    )}>
      <div className={cn(
        'rounded-full bg-slate-100 dark:bg-slate-800 p-4 mb-4',
        compact ? 'p-3' : 'p-6'
      )}>
        <Icon className={cn(
          'text-slate-400 dark:text-slate-500',
          compact ? 'h-6 w-6' : 'h-8 w-8'
        )} />
      </div>
      <h3 className={cn(
        'font-semibold text-slate-900 dark:text-slate-100 mb-2',
        compact ? 'text-base' : 'text-lg'
      )}>
        {title}
      </h3>
      <p className={cn(
        'text-slate-600 dark:text-slate-400 mb-6 max-w-sm',
        compact ? 'text-sm mb-4' : 'text-base'
      )}>
        {description}
      </p>
      {action && action}
    </div>
  );
};