"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/custom/Button";
import { Input } from "@/components/custom/Input";
import { Checkbox } from "@/components/custom/Checkbox";
import supabaseAuthService from "@/lib/services/supabaseAuthService";
import AuthGuard from "@/components/auth/AuthGuard";

// Form validation schema
const loginSchema = z.object({
  email: z.string().email("Geçerli bir email adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Handle form submission
  const onSubmit = async (data: LoginFormValues) => {
    try {
      setApiError(null);

      // Supabase auth ile giriş yap
      const result = await supabaseAuthService.login({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        setApiError(result.error);
        return;
      }

      if (result.user) {
        // Başarılı giriş - dashboard'a yönlendir
        router.push("/dashboard");
      } else {
        setApiError("Giriş başarısız oldu");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      setApiError("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  // Register sayfasına yönlendir
  const handleRegisterClick = () => {
    router.push("/register");
  };

  return (
    <AuthGuard requireAuth={false}>
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
              <h1 className="mb-8 text-4xl font-bold">Hoş Geldiniz,</h1>

              {apiError && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
                  {apiError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Field */}
                <div>
                  <Input
                    {...register("email")}
                    type="email"
                    label="E-posta Adresiniz"
                    placeholder="your@email.com"
                    color="green"
                    error={errors.email?.message}
                  />
                </div>

                {/* Password Field */}
                <div>
                  <Input
                    {...register("password")}
                    type="password"
                    label="Şifreniz"
                    placeholder="••••••••"
                    color="green"
                    error={errors.password?.message}
                  />
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between">
                  <Checkbox
                    {...register("rememberMe")}
                    label="Beni hatırla"
                    color="green"
                  />
                  <a
                    href="#"
                    className="text-sm text-green-600 hover:text-green-500 transition-colors"
                  >
                    Şifremi unuttum
                  </a>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  customVariant="primary"
                  customSize="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Giriş yapılıyor..." : "Giriş Yap"}
                </Button>

                {/* Register Link */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Hesabınız yok mu?{" "}
                    <button
                      type="button"
                      onClick={handleRegisterClick}
                      className="text-green-600 hover:text-green-500 font-medium transition-colors"
                    >
                      Kayıt olun
                    </button>
                  </p>
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
            style={{ objectFit: "cover", objectPosition: "bottom" }}
            priority
            quality={100}
          />
        </div>
      </div>
    </AuthGuard>
  );
}
