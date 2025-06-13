"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabaseAuthService from "@/lib/services/supabaseAuthService";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const user = await supabaseAuthService.getCurrentUser();

        if (user) {
          // Kullanıcı giriş yapmış, dashboard'a yönlendir
          router.push("/dashboard");
        } else {
          // Kullanıcı giriş yapmamış, login sayfasına yönlendir
          router.push("/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        // Hata durumunda login sayfasına yönlendir
        router.push("/login");
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  // Loading state gösterebiliriz
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Yönlendiriliyorsunuz...</p>
      </div>
    </div>
  );
}
