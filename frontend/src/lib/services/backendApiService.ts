import api from "@/lib/api";
import { supabase } from "@/lib/supabase";

// Backend API için interface'ler
interface Company {
  id: string;
  name: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
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
  /**
   * Supabase token'ını header'a ekle
   */
  private async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };
    } catch (error) {
      console.error("Get auth headers error:", error);
      return {
        "Content-Type": "application/json",
      };
    }
  }

  // ============ COMPANY API'LERİ ============

  /**
   * Tüm şirketleri getir
   */
  async getCompanies(): Promise<Company[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await api.get<Company[]>("/companies", { headers });
      return response.data;
    } catch (error) {
      console.error("Get companies error:", error);
      throw error;
    }
  }

  /**
   * Şirket detayını getir
   */
  async getCompany(id: string): Promise<Company> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await api.get<Company>(`/companies/${id}`, { headers });
      return response.data;
    } catch (error) {
      console.error("Get company error:", error);
      throw error;
    }
  }

  /**
   * Şirket oluştur
   */
  async createCompany(
    company: Omit<Company, "id" | "createdAt" | "updatedAt">
  ): Promise<Company> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await api.post<Company>("/companies", company, {
        headers,
      });
      return response.data;
    } catch (error) {
      console.error("Create company error:", error);
      throw error;
    }
  }

  /**
   * Şirket güncelle
   */
  async updateCompany(id: string, company: Partial<Company>): Promise<Company> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await api.put<Company>(`/companies/${id}`, company, {
        headers,
      });
      return response.data;
    } catch (error) {
      console.error("Update company error:", error);
      throw error;
    }
  }

  /**
   * Şirket sil
   */
  async deleteCompany(id: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      await api.delete(`/companies/${id}`, { headers });
    } catch (error) {
      console.error("Delete company error:", error);
      throw error;
    }
  }

  // ============ JOB API'LERİ ============

  /**
   * Tüm işleri getir
   */
  async getJobs(): Promise<Job[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await api.get<Job[]>("/jobs", { headers });
      return response.data;
    } catch (error) {
      console.error("Get jobs error:", error);
      throw error;
    }
  }

  /**
   * Şirkete ait işleri getir
   */
  async getJobsByCompany(companyId: string): Promise<Job[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await api.get<Job[]>(`/jobs/company/${companyId}`, {
        headers,
      });
      return response.data;
    } catch (error) {
      console.error("Get jobs by company error:", error);
      throw error;
    }
  }

  /**
   * İş detayını getir
   */
  async getJob(id: string): Promise<Job> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await api.get<Job>(`/jobs/${id}`, { headers });
      return response.data;
    } catch (error) {
      console.error("Get job error:", error);
      throw error;
    }
  }

  /**
   * İş oluştur
   */
  async createJob(
    job: Omit<Job, "id" | "createdAt" | "updatedAt">
  ): Promise<Job> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await api.post<Job>("/jobs", job, { headers });
      return response.data;
    } catch (error) {
      console.error("Create job error:", error);
      throw error;
    }
  }

  /**
   * İş güncelle
   */
  async updateJob(id: string, job: Partial<Job>): Promise<Job> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await api.put<Job>(`/jobs/${id}`, job, { headers });
      return response.data;
    } catch (error) {
      console.error("Update job error:", error);
      throw error;
    }
  }

  /**
   * İş sil
   */
  async deleteJob(id: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      await api.delete(`/jobs/${id}`, { headers });
    } catch (error) {
      console.error("Delete job error:", error);
      throw error;
    }
  }

  // ============ QUOTE API'LERİ ============

  /**
   * İşe ait teklifleri getir
   */
  async getQuotesByJob(jobId: string): Promise<Quote[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await api.get<Quote[]>(`/quotes/job/${jobId}`, {
        headers,
      });
      return response.data;
    } catch (error) {
      console.error("Get quotes by job error:", error);
      throw error;
    }
  }

  /**
   * Şirkete ait teklifleri getir
   */
  async getQuotesByCompany(companyId: string): Promise<Quote[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await api.get<Quote[]>(`/quotes/company/${companyId}`, {
        headers,
      });
      return response.data;
    } catch (error) {
      console.error("Get quotes by company error:", error);
      throw error;
    }
  }

  /**
   * Teklif oluştur
   */
  async createQuote(
    quote: Omit<Quote, "id" | "createdAt" | "updatedAt">
  ): Promise<Quote> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await api.post<Quote>("/quotes", quote, { headers });
      return response.data;
    } catch (error) {
      console.error("Create quote error:", error);
      throw error;
    }
  }

  /**
   * Teklif güncelle
   */
  async updateQuote(id: string, quote: Partial<Quote>): Promise<Quote> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await api.put<Quote>(`/quotes/${id}`, quote, {
        headers,
      });
      return response.data;
    } catch (error) {
      console.error("Update quote error:", error);
      throw error;
    }
  }

  /**
   * Teklif sil
   */
  async deleteQuote(id: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      await api.delete(`/quotes/${id}`, { headers });
    } catch (error) {
      console.error("Delete quote error:", error);
      throw error;
    }
  }

  // ============ NOTIFICATION API'LERİ ============

  /**
   * Kullanıcıya ait bildirimleri getir
   */
  async getNotifications(profileId: string): Promise<Notification[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await api.get<Notification[]>(
        `/notifications/profile/${profileId}`,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error("Get notifications error:", error);
      throw error;
    }
  }

  /**
   * Bildirimi okundu olarak işaretle
   */
  async markNotificationAsRead(id: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      await api.put(`/notifications/${id}/read`, {}, { headers });
    } catch (error) {
      console.error("Mark notification as read error:", error);
      throw error;
    }
  }

  /**
   * Tüm bildirimleri okundu olarak işaretle
   */
  async markAllNotificationsAsRead(profileId: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      await api.put(
        `/notifications/profile/${profileId}/read-all`,
        {},
        { headers }
      );
    } catch (error) {
      console.error("Mark all notifications as read error:", error);
      throw error;
    }
  }

  // ============ PROFILE API'LERİ ============

  /**
   * Profil bilgilerini getir
   */
  async getProfile(userId: string): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await api.get(`/profiles/${userId}`, { headers });
      return response.data;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  }

  /**
   * Profil güncelle
   */
  async updateProfile(userId: string, profile: any): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await api.put(`/profiles/${userId}`, profile, {
        headers,
      });
      return response.data;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  }
}

export default new BackendApiService();
