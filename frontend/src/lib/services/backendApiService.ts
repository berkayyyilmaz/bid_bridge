import api from "@/lib/api";
import { supabase } from "@/lib/supabase";

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
  // ============ COMPANY API'LERİ ============

  /**
   * Tüm şirketleri getir
   */
  async getCompanies(): Promise<Company[]> {
    try {
      const response = await api.get<Company[]>("/companies");
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
      const response = await api.get<Company>(`/companies/${id}`);
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
      const response = await api.post<Company>("/companies", company);
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
      const response = await api.put<Company>(`/companies/${id}`, company);
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
      await api.delete(`/companies/${id}`);
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
      const response = await api.get<Job[]>("/jobs");
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
      const response = await api.get<Job[]>(`/jobs/company/${companyId}`);
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
      const response = await api.get<Job>(`/jobs/${id}`);
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
      const response = await api.post<Job>("/jobs", job);
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
      const response = await api.put<Job>(`/jobs/${id}`, job);
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
      await api.delete(`/jobs/${id}`);
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
      const response = await api.get<Quote[]>(`/quotes/job/${jobId}`);
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
      const response = await api.get<Quote[]>(`/quotes/company/${companyId}`);
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
      const response = await api.post<Quote>("/quotes", quote);
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
      const response = await api.put<Quote>(`/quotes/${id}`, quote);
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
      await api.delete(`/quotes/${id}`);
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
      const response = await api.get<Notification[]>(
        `/notifications/profile/${profileId}`
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
      await api.put(`/notifications/${id}/read`);
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
      await api.put(`/notifications/profile/${profileId}/read-all`);
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
      const response = await api.get(`/profiles/${userId}`);
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
      const response = await api.put(`/profiles/${userId}`, profile);
      return response.data;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  }
}

export default new BackendApiService();
