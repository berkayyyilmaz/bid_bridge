"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabaseAuthService from "@/lib/services/supabaseAuthService";
import { AuthUser, Profile } from "@/lib/supabase";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function AuthGuard({
  children,
  requireAuth = true,
}: AuthGuardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Önce localStorage'dan kontrol et
        const storedInfo = supabaseAuthService.getStoredUserInfo();

        if (storedInfo.user && storedInfo.profile) {
          setUser(storedInfo.user);
          setProfile(storedInfo.profile);
        }

        // Sonra Supabase'den güncel durumu kontrol et
        const isLoggedIn = await supabaseAuthService.isLoggedIn();

        if (requireAuth && !isLoggedIn) {
          router.replace("/login");
          return;
        }

        if (!requireAuth && isLoggedIn) {
          router.replace("/dashboard");
          return;
        }

        if (isLoggedIn) {
          const currentUser = await supabaseAuthService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            // Profile bilgisi localStorage'da yoksa backend'den al
            if (!storedInfo.profile) {
              // Backend'den profil bilgilerini al
              // Bu işlem supabaseAuthService içinde yapılacak
            }
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        if (requireAuth) {
          router.replace("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Auth durumu değişikliklerini dinle
    const {
      data: { subscription },
    } = supabaseAuthService.onAuthStateChange((user, profile) => {
      setUser(user);
      setProfile(profile);

      if (requireAuth && !user) {
        router.replace("/login");
      } else if (!requireAuth && user) {
        router.replace("/dashboard");
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [router, requireAuth]);

  // Loading durumunda spinner göster
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Auth gerekli ama kullanıcı giriş yapmamışsa hiçbir şey gösterme
  if (requireAuth && !user) {
    return null;
  }

  // Auth gerekli değil ama kullanıcı giriş yapmışsa hiçbir şey gösterme
  if (!requireAuth && user) {
    return null;
  }

  return <>{children}</>;
}
