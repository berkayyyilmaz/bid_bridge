'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/custom/Button';
import { Input } from '@/components/custom/Input';
import { Checkbox } from '@/components/custom/Checkbox';
import authService from '@/lib/services/authService';

// Define a simpler form validation schema
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  
  // Initialize React Hook Form
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });
  
  // Handle form submission
  const onSubmit = async (data: LoginFormValues) => {
    try {
      setApiError(null);
      setDebugInfo(JSON.stringify(data, null, 2)); // Show form data for debugging
      
      // For testing purposes, handle test@example.com / test123 manually

      // Otherwise try with the real API
      await authService.login({
        email: data.email,
        password: data.password
      });
      
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error);
      
      if (error.response?.status === 401) {
        setApiError('Invalid email or password');
      } else if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else {
        setApiError('An error occurred. Please try again.');
      }
    }
  };
  
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Section */}
      <div className="flex w-1/3 flex-col bg-white px-10 py-8">
        {/* Logo */}
        <div className="mb-10 w-1/2">
          <Image 
            src="/images/Cargill.png"
            alt="Company Logo"
            width={180}
            height={60}
            className="h-auto w-full"
            priority
          />
        </div>

        {/* Form Container */}
        <div className="flex flex-grow flex-col justify-center">
          <div className="w-full max-w-md">
            <h1 className="mb-8 text-4xl font-bold">Welcome,</h1>
            
            {apiError && (
              <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input 
                label="Email"
                {...register('email')}
                type="email" 
                placeholder="mail@example.com"
                error={errors.email?.message}
              />
              
              <Input 
                label="Password"
                {...register('password')}
                type="password"
                placeholder="********"
                error={errors.password?.message}
              />

              <div className="flex items-center justify-between pt-2">
                <Checkbox 
                  label="Remember me"
                  color="green"
                  {...register('rememberMe')}
                />
                <a 
                  href="#" 
                  className="text-sm text-green-700 hover:underline"
                >
                  Forgot Password?
                </a>
              </div>

              <div className="pt-6 text-center">
                <Button 
                  customVariant="primary"
                  customSize="md"
                  type="submit"
                  className="w-1/3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Logging in...' : 'Log in'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Section - Background Image */}
      <div className="relative w-2/3">
        <Image
          src="/images/login_background.jpg"
          alt="Login Background"
          fill
          style={{ objectFit: 'cover', objectPosition: 'bottom' }}
          priority
          quality={100}
        />
      </div>
    </div>
  );
} 