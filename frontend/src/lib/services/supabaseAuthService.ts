import { supabase, type AuthUser, type Profile } from "@/lib/supabase";
import { AuthError, User } from "@supabase/supabase-js";

// Supabase Auth için interface'ler
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  companyName: string;
}

interface AuthResponse {
  user: AuthUser | null;
  profile: Profile | null;
  error: string | null;
}

class SupabaseAuthService {
  /**
   * Kullanıcı girişi (Supabase Auth)
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return {
          user: null,
          profile: null,
          error: this.getErrorMessage(error),
        };
      }

      if (data.user) {
        // Kullanıcının profil bilgilerini al
        const profile = await this.getUserProfile(data.user.id);

        // Session bilgilerini localStorage'a kaydet
        this.saveSession(data.user, profile);

        return {
          user: this.mapSupabaseUser(data.user),
          profile,
          error: null,
        };
      }

      return {
        user: null,
        profile: null,
        error: "Giriş başarısız oldu",
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        user: null,
        profile: null,
        error: "Beklenmeyen bir hata oluştu",
      };
    }
  }

  /**
   * Kullanıcı kaydı (Supabase Auth + Backend Profile)
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // 1. Supabase'de kullanıcı oluştur
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            display_name: data.fullName,
          },
        },
      });

      if (authError) {
        return {
          user: null,
          profile: null,
          error: this.getErrorMessage(authError),
        };
      }

      if (authData.user) {
        // 2. Backend'de profil oluştur (Java API'ye istek)
        const profile = await this.createProfileInBackend({
          userId: authData.user.id,
          fullName: data.fullName,
          email: data.email,
          companyName: data.companyName,
        });

        if (profile) {
          this.saveSession(authData.user, profile);

          return {
            user: this.mapSupabaseUser(authData.user),
            profile,
            error: null,
          };
        } else {
          // Profil oluşturulamazsa Supabase kullanıcısını sil
          await supabase.auth.admin.deleteUser(authData.user.id);
          return {
            user: null,
            profile: null,
            error: "Profil oluşturulamadı",
          };
        }
      }

      return {
        user: null,
        profile: null,
        error: "Kayıt başarısız oldu",
      };
    } catch (error) {
      console.error("Register error:", error);
      return {
        user: null,
        profile: null,
        error: "Beklenmeyen bir hata oluştu",
      };
    }
  }

  /**
   * Çıkış yap
   */
  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
      this.clearSession();
    } catch (error) {
      console.error("Logout error:", error);
      this.clearSession(); // Hata olsa bile session'ı temizle
    }
  }

  /**
   * Mevcut kullanıcıyı al
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user ? this.mapSupabaseUser(user) : null;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  }

  /**
   * Kullanıcının giriş durumunu kontrol et
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return !!session;
    } catch (error) {
      console.error("Check login status error:", error);
      return false;
    }
  }

  /**
   * Auth durumu değişikliklerini dinle
   */
  onAuthStateChange(
    callback: (user: AuthUser | null, profile: Profile | null) => void
  ) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = this.mapSupabaseUser(session.user);
        const profile = await this.getUserProfile(session.user.id);
        this.saveSession(session.user, profile);
        callback(user, profile);
      } else {
        this.clearSession();
        callback(null, null);
      }
    });
  }

  /**
   * Backend'den kullanıcı profili al
   */
  private async getUserProfile(userId: string): Promise<Profile | null> {
    try {
      // Java backend'den profil bilgilerini al
      const response = await fetch(`/api/profiles/${userId}`, {
        headers: {
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error("Get user profile error:", error);
      return null;
    }
  }

  /**
   * Backend'de profil oluştur
   */
  private async createProfileInBackend(data: {
    userId: string;
    fullName: string;
    email: string;
    companyName: string;
  }): Promise<Profile | null> {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
        body: JSON.stringify({
          userId: data.userId,
          fullName: data.fullName,
          email: data.email,
          companyName: data.companyName,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return result.profile;
      }
      return null;
    } catch (error) {
      console.error("Create profile error:", error);
      return null;
    }
  }

  /**
   * Supabase access token al
   */
  private async getAccessToken(): Promise<string | null> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return session?.access_token || null;
    } catch (error) {
      console.error("Get access token error:", error);
      return null;
    }
  }

  /**
   * Supabase User'ı AuthUser'a dönüştür
   */
  private mapSupabaseUser(user: User): AuthUser {
    return {
      id: user.id,
      email: user.email || "",
      user_metadata: user.user_metadata,
    };
  }

  /**
   * Session bilgilerini localStorage'a kaydet
   */
  private saveSession(user: User, profile: Profile | null): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "supabase_user",
        JSON.stringify({
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata,
        })
      );

      if (profile) {
        localStorage.setItem("user_profile", JSON.stringify(profile));
      }
    }
  }

  /**
   * Session bilgilerini temizle
   */
  private clearSession(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("supabase_user");
      localStorage.removeItem("user_profile");
      localStorage.removeItem("auth_token"); // Eski token'ı da temizle
      localStorage.removeItem("user_info"); // Eski user info'yu da temizle
    }
  }

  /**
   * Hata mesajını kullanıcı dostu hale getir
   */
  private getErrorMessage(error: AuthError): string {
    switch (error.message) {
      case "Invalid login credentials":
        return "Geçersiz email veya şifre";
      case "Email not confirmed":
        return "Email adresinizi doğrulamanız gerekiyor";
      case "User already registered":
        return "Bu email adresi zaten kayıtlı";
      case "Password should be at least 6 characters":
        return "Şifre en az 6 karakter olmalıdır";
      default:
        return error.message || "Bilinmeyen bir hata oluştu";
    }
  }

  /**
   * Kayıtlı kullanıcı bilgilerini al (localStorage'dan)
   */
  getStoredUserInfo(): { user: AuthUser | null; profile: Profile | null } {
    if (typeof window === "undefined") {
      return { user: null, profile: null };
    }

    try {
      const storedUser = localStorage.getItem("supabase_user");
      const storedProfile = localStorage.getItem("user_profile");

      return {
        user: storedUser ? JSON.parse(storedUser) : null,
        profile: storedProfile ? JSON.parse(storedProfile) : null,
      };
    } catch (error) {
      console.error("Get stored user info error:", error);
      return { user: null, profile: null };
    }
  }
}

export default new SupabaseAuthService();
