'use client';

import React, { forwardRef } from 'react';
import { Input as ShadcnInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  label,
  helperText,
  error,
  containerClassName,
  id,
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <Label 
          htmlFor={inputId} 
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </Label>
      )}
      
      <ShadcnInput
        ref={ref}
        id={inputId}
        className={cn(
          'rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 transition-colors',
          'focus:border-green-500 focus:ring-2 focus:ring-green-500/20',
          'placeholder:text-gray-400',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      />
      
      {(helperText || error) && (
        <p className={cn(
          'text-xs',
          error ? 'text-red-500' : 'text-gray-500'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}); 