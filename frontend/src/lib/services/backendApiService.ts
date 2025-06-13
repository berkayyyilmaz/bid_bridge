import { supabase } from "@/lib/supabase";
import { CompanyApiResponse } from "@/types/company";
import { JobApiResponse } from "@/types/job";
import { QuoteApiResponse } from "@/types/quote";

// Backend API için interface'ler
interface Company {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupDate: string;
  deliveryDate: string;
  weight: number;
  volume: number;
  status: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

interface Quote {
  id: string;
  jobId: string;
  companyId: string;
  price: number;
  currency: string;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Notification {
  id: string;
  profileId: string;
  userFullName: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

class BackendApiService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  private async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });
    if (!response.ok) {
      if (response.status === 401) {
        await supabase.auth.signOut();
        window.location.href = "/login";
      }
      throw new Error(`API error: ${response.statusText}`);
    }
    if (response.status === 204) return undefined as T; // No Content
    return response.json();
  }

  // ============ COMPANY API'LERİ ============

  /**
   * Tüm şirketleri getir
   */
  async getCompanies(): Promise<CompanyApiResponse[]> {
    return this.fetchApi<CompanyApiResponse[]>("/api/companies");
  }

  /**
   * Şirket detayını getir
   */
  async getCompany(id: string): Promise<Company> {
    return this.fetchApi<Company>(`/api/companies/${id}`);
  }

  /**
   * Şirket oluştur
   */
  async createCompany(
    company: Omit<Company, "id" | "createdAt" | "updatedAt">
  ): Promise<Company> {
    return this.fetchApi<Company>(`/api/companies`, {
      method: "POST",
      body: JSON.stringify(company),
    });
  }

  /**
   * Şirket güncelle
   */
  async updateCompany(id: string, company: Partial<Company>): Promise<Company> {
    return this.fetchApi<Company>(`/api/companies/${id}`, {
      method: "PUT",
      body: JSON.stringify(company),
    });
  }

  /**
   * Şirket sil
   */
  async deleteCompany(id: string): Promise<void> {
    await this.fetchApi<void>(`/api/companies/${id}`, { method: "DELETE" });
  }

  // ============ JOB API'LERİ ============

  /**
   * Tüm işleri getir
   */
  async getJobs(): Promise<JobApiResponse[]> {
    return this.fetchApi<JobApiResponse[]>("/api/jobs");
  }

  /**
   * Şirkete ait işleri getir
   */
  async getJobsByCompany(companyId: string): Promise<Job[]> {
    return this.fetchApi<Job[]>(`/api/jobs/company/${companyId}`);
  }

  /**
   * İş detayını getir
   */
  async getJob(id: string): Promise<Job> {
    return this.fetchApi<Job>(`/api/jobs/${id}`);
  }

  /**
   * İş oluştur
   */
  async createJob(
    job: Omit<Job, "id" | "createdAt" | "updatedAt">
  ): Promise<Job> {
    return this.fetchApi<Job>(`/api/jobs`, {
      method: "POST",
      body: JSON.stringify(job),
    });
  }

  /**
   * İş güncelle
   */
  async updateJob(id: string, job: Partial<Job>): Promise<Job> {
    return this.fetchApi<Job>(`/api/jobs/${id}`, {
      method: "PUT",
      body: JSON.stringify(job),
    });
  }

  /**
   * İş sil
   */
  async deleteJob(id: string): Promise<void> {
    await this.fetchApi<void>(`/api/jobs/${id}`, { method: "DELETE" });
  }

  // ============ QUOTE API'LERİ ============

  /**
   * İşe ait teklifleri getir
   */
  async getQuotesByJob(jobId: string): Promise<Quote[]> {
    return this.fetchApi<Quote[]>(`/api/quotes/job/${jobId}`);
  }

  /**
   * Şirkete ait teklifleri getir
   */
  async getQuotesByCompany(companyId: string): Promise<Quote[]> {
    return this.fetchApi<Quote[]>(`/api/quotes/company/${companyId}`);
  }

  /**
   * Teklif oluştur
   */
  async createQuote(
    quote: Omit<Quote, "id" | "createdAt" | "updatedAt">
  ): Promise<Quote> {
    return this.fetchApi<Quote>(`/api/quotes`, {
      method: "POST",
      body: JSON.stringify(quote),
    });
  }

  /**
   * Teklif güncelle
   */
  async updateQuote(id: string, quote: Partial<Quote>): Promise<Quote> {
    return this.fetchApi<Quote>(`/api/quotes/${id}`, {
      method: "PUT",
      body: JSON.stringify(quote),
    });
  }

  /**
   * Teklif sil
   */
  async deleteQuote(id: string): Promise<void> {
    await this.fetchApi<void>(`/api/quotes/${id}`, { method: "DELETE" });
  }

  // ============ NOTIFICATION API'LERİ ============

  /**
   * Kullanıcıya ait bildirimleri getir
   */
  async getNotifications(profileId: string): Promise<Notification[]> {
    return this.fetchApi<Notification[]>(
      `/api/notifications/profile/${profileId}`
    );
  }

  /**
   * Bildirimi okundu olarak işaretle
   */
  async markNotificationAsRead(id: string): Promise<void> {
    await this.fetchApi<void>(`/api/notifications/${id}/read`, {
      method: "POST",
    });
  }

  /**
   * Tüm bildirimleri okundu olarak işaretle
   */
  async markAllNotificationsAsRead(profileId: string): Promise<void> {
    await this.fetchApi<void>(
      `/api/notifications/profile/${profileId}/read-all`,
      { method: "POST" }
    );
  }

  // ============ PROFILE API'LERİ ============

  /**
   * Profil bilgilerini getir
   */
  async getProfile(userId: string): Promise<any> {
    return this.fetchApi<any>(`/api/profiles/${userId}`);
  }

  /**
   * Profil güncelle
   */
  async updateProfile(userId: string, profile: any): Promise<any> {
    return this.fetchApi<any>(`/api/profiles/${userId}`, {
      method: "PUT",
      body: JSON.stringify(profile),
    });
  }

  // ============ NEW API'LER ============

  async getQuotes(): Promise<QuoteApiResponse[]> {
    return this.fetchApi<QuoteApiResponse[]>("/api/quotes");
  }
}

export default new BackendApiService();
