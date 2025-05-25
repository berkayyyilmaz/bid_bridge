"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/custom/Button";
import { Input } from "@/components/custom/Input";
import supabaseAuthService from "@/lib/services/supabaseAuthService";
import AuthGuard from "@/components/auth/AuthGuard";

// Form validation schema
const registerSchema = z
  .object({
    companyName: z.string().min(2, "Şirket adı en az 2 karakter olmalıdır"),
    fullName: z.string().min(2, "Ad soyad en az 2 karakter olmalıdır"),
    email: z.string().email("Geçerli bir email adresi giriniz"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
    confirmPassword: z
      .string()
      .min(6, "Şifre tekrarı en az 6 karakter olmalıdır"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      companyName: "",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setApiError(null);
      setSuccessMessage(null);

      // Supabase auth ile kayıt ol
      const result = await supabaseAuthService.register({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        companyName: data.companyName,
      });

      if (result.error) {
        setApiError(result.error);
        return;
      }

      if (result.user) {
        setSuccessMessage(
          "Kayıt başarılı! Email adresinizi doğruladıktan sonra giriş yapabilirsiniz."
        );
        // 3 saniye sonra login sayfasına yönlendir
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setApiError("Kayıt başarısız oldu");
      }
    } catch (error: any) {
      console.error("Register failed:", error);
      setApiError("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  // Login sayfasına yönlendir
  const handleLoginClick = () => {
    router.push("/login");
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
              <h1 className="mb-8 text-4xl font-bold">Kayıt Ol</h1>

              {apiError && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
                  {apiError}
                </div>
              )}

              {successMessage && (
                <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-600">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Şirket Adı"
                  {...register("companyName")}
                  type="text"
                  placeholder="Şirket adınızı giriniz"
                  error={errors.companyName?.message}
                />

                <Input
                  label="Ad Soyad"
                  {...register("fullName")}
                  type="text"
                  placeholder="Adınızı ve soyadınızı giriniz"
                  error={errors.fullName?.message}
                />

                <Input
                  label="Email"
                  {...register("email")}
                  type="email"
                  placeholder="ornek@email.com"
                  error={errors.email?.message}
                />

                <Input
                  label="Şifre"
                  {...register("password")}
                  type="password"
                  placeholder="En az 6 karakter"
                  error={errors.password?.message}
                />

                <Input
                  label="Şifre Tekrarı"
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="Şifrenizi tekrar giriniz"
                  error={errors.confirmPassword?.message}
                />

                <div className="pt-6 text-center">
                  <Button
                    customVariant="primary"
                    customSize="md"
                    type="submit"
                    className="w-1/2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Kayıt yapılıyor..." : "Kayıt Ol"}
                  </Button>
                </div>

                <div className="pt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Zaten hesabınız var mı?{" "}
                    <button
                      type="button"
                      onClick={handleLoginClick}
                      className="text-green-700 hover:underline font-medium"
                    >
                      Giriş Yap
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
            alt="Register Background"
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
