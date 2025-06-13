"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabaseAuthService from "@/lib/services/supabaseAuthService";
import { AuthUser } from "@/lib/supabase";

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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedInfo = supabaseAuthService.getStoredUserInfo();

        if (storedInfo.user) {
          setUser(storedInfo.user);
        }

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
            supabaseAuthService.saveSession(currentUser, null);
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

    const {
      data: { subscription },
    } = supabaseAuthService.onAuthStateChange((user) => {
      setUser(user);

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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return null;
  }

  if (!requireAuth && user) {
    return null;
  }

  return <>{children}</>;
}
