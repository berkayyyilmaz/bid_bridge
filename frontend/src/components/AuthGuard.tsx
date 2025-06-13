import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabaseAuthService from "@/lib/services/supabaseAuthService";

const AuthGuard: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      console.log("AuthGuard: Auth kontrolü başlıyor");
      const storedInfo = await supabaseAuthService.getStoredUserInfo();
      console.log("AuthGuard: Stored info:", storedInfo);

      const isLoggedIn = await supabaseAuthService.isLoggedIn();
      console.log("AuthGuard: isLoggedIn:", isLoggedIn);

      if (!isLoggedIn) {
        console.log(
          "AuthGuard: Kullanıcı giriş yapmamış, login sayfasına yönlendiriliyor"
        );
        router.push("/login");
        return;
      }

      const currentUser = await supabaseAuthService.getCurrentUser();
      console.log("AuthGuard: currentUser:", currentUser);

      if (!currentUser) {
        console.log(
          "AuthGuard: Kullanıcı bilgisi alınamadı, login sayfasına yönlendiriliyor"
        );
        router.push("/login");
        return;
      }

      setLoading(false);
    } catch (error) {
      console.error("AuthGuard: Hata oluştu:", error);
      router.push("/login");
    }
  };

  useEffect(() => {
    checkAuth();
  }, [router]);

  return <div>{/* Render your component content here */}</div>;
};

export default AuthGuard;
