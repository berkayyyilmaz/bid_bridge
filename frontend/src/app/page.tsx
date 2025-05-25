"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabaseAuthService from "@/lib/services/supabaseAuthService";

export default function HomePage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const isLoggedIn = await supabaseAuthService.isLoggedIn();

        if (isLoggedIn) {
          router.replace("/dashboard");
        } else {
          router.replace("/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.replace("/login");
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Yönlendiriliyor...</p>
    </div>
  );
}
