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
  },
});

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
