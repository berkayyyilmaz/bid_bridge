'use client';

import React, { forwardRef } from 'react';
import { Checkbox as ShadcnCheckbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof ShadcnCheckbox> {
  label?: string;
  description?: string;
  containerClassName?: string;
  labelClassName?: string;
  color?: 'green' | 'blue' | 'default';
}

export const Checkbox = forwardRef<React.ElementRef<typeof ShadcnCheckbox>, CheckboxProps>(({
  label,
  description,
  containerClassName,
  labelClassName,
  color = 'green',
  className,
  id,
  ...props
}, ref) => {
  const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  const colorVariants = {
    green: 'data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 focus-visible:ring-green-500',
    blue: 'data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 focus-visible:ring-blue-500',
    default: '',
  };

  return (
    <div className={cn('flex items-start gap-2', containerClassName)}>
      <ShadcnCheckbox
        ref={ref}
        id={checkboxId}
        className={cn(
          'h-4 w-4 border border-gray-300 bg-white',
          colorVariants[color],
          className
        )}
        {...props}
      />
      {(label || description) && (
        <div className="grid gap-1 leading-none">
          {label && (
            <Label
              htmlFor={checkboxId}
              className={cn(
                'text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer',
                color === 'green' && 'text-green-700',
                color === 'blue' && 'text-blue-700',
                labelClassName
              )}
            >
              {label}
            </Label>
          )}
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}); 