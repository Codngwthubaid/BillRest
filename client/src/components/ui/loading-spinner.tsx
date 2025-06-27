import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  className 
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div 
        className={cn(
          'animate-spin rounded-full border-2 border-slate-200 border-t-blue-600',
          sizeClasses[size],
          className
        )}
      />
      <p className="text-sm text-slate-600 dark:text-slate-400">Loading report data...</p>
    </div>
  );
};