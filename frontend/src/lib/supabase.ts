import { createClient } from "@supabase/supabase-js";

// Supabase yapılandırması
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Supabase client'ını oluştur
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    storageKey: "supabase.auth.token",
    flowType: "pkce",
  },
  global: {
    headers: {
      "x-application-name": "bid-bridge",
    },
  },
});

// Test fonksiyonu
export const testSupabaseConnection = async () => {
  try {
    console.log("Supabase URL:", supabaseUrl);
    console.log("Supabase Anon Key:", supabaseAnonKey);

    const { data, error } = await supabase.auth.getSession();
    console.log("Test connection result:", {
      hasSession: !!data.session,
      sessionData: data.session,
      error: error,
    });

    return { success: !error, error };
  } catch (error) {
    console.error("Test connection error:", error);
    return { success: false, error };
  }
};

// Auth durumu için tip tanımları
export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    display_name?: string;
  };
}

export interface Profile {
  id: string;
  full_name: string;
  role: string;
  company_id?: string;
  created_at: string;
  updated_at: string;
}
