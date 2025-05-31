// ⚠️ Bu dosya sadece test amaçlıdır - üretimde silinecek
// Gerçek API entegrasyonu sonrası kaldırılacak

export interface Profile {
  id: string;
  full_name: string;
  role: string;
  company_id: string;
  company_name?: string; // Join işlemi sonucu
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}
