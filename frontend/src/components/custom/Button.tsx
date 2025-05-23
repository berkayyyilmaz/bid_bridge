'use client';

import { Button as ShadcnButton } from '@/components/ui/button';
import { type ButtonProps as ShadcnButtonProps } from '@/components/ui/button';
import React from 'react';
import { cn } from '@/lib/utils';

interface CustomButtonProps extends Omit<ShadcnButtonProps, 'variant' | 'size'> {
  customVariant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  customSize?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button: React.FC<CustomButtonProps> = ({
  className,
  customVariant = 'primary',
  customSize = 'md',
  ...props
}) => {
  // Map our custom variants to shadcn variants
  const variantMap: Record<string, string> = {
    primary: 'bg-green-600 hover:bg-green-700 text-white',
    secondary: 'bg-blue-500 hover:bg-blue-600 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  };

  // Map our custom sizes to tailwind classes
  const sizeMap: Record<string, string> = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-6 text-lg',
    icon: 'h-10 w-10 p-2',
  };

  return (
    <ShadcnButton
      className={cn(
        variantMap[customVariant],
        sizeMap[customSize],
        'font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
        className
      )}
      variant="default"
      {...props}
    />
  );
}; 