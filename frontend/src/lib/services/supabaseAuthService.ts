import { supabase, type AuthUser } from "@/lib/supabase";
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
          error: this.getErrorMessage(error),
        };
      }

      if (data.user) {
        const user = this.mapSupabaseUser(data.user);
        this.saveSession(user, null);
        return {
          user,
          error: null,
        };
      }

      return {
        user: null,
        error: "Giriş başarısız oldu",
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        user: null,
        error: "Beklenmeyen bir hata oluştu",
      };
    }
  }

  /**
   * Kullanıcı kaydı (Supabase Auth + Backend Profile)
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
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
          error: this.getErrorMessage(authError),
        };
      }

      if (authData.user) {
        const user = this.mapSupabaseUser(authData.user);
        this.saveSession(user, null);
        return {
          user,
          error: null,
        };
      }

      return {
        user: null,
        error: "Kayıt başarısız oldu",
      };
    } catch (error) {
      console.error("Register error:", error);
      return {
        user: null,
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
      this.clearSession();
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
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Session hatası:", error);
        return false;
      }

      return !!session;
    } catch (error) {
      console.error("Check login status error:", error);
      return false;
    }
  }

  /**
   * Auth durumu değişikliklerini dinle
   */
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = this.mapSupabaseUser(session.user);
        this.saveSession(user, null);
        callback(user);
      } else {
        this.clearSession();
        callback(null);
      }
    });
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
  saveSession(user: User | AuthUser, profile: null): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "supabase_user",
        JSON.stringify({
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata,
        })
      );
    }
  }

  /**
   * Session bilgilerini temizle
   */
  private clearSession(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("supabase_user");
      localStorage.removeItem("user_profile");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_info");
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
  getStoredUserInfo(): { user: AuthUser | null; profile: null } {
    if (typeof window === "undefined") {
      return { user: null, profile: null };
    }

    try {
      const storedUser = localStorage.getItem("supabase_user");
      return {
        user: storedUser ? JSON.parse(storedUser) : null,
        profile: null,
      };
    } catch (error) {
      console.error("Get stored user info error:", error);
      return { user: null, profile: null };
    }
  }
}

export default new SupabaseAuthService();
