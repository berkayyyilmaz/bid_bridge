import { supabase } from "@/lib/supabase";
import { CompanyApiResponse } from "@/types/company";
import { JobApiResponse } from "@/types/job";
import { QuoteApiResponse } from "@/types/quote";
import { useState, useCallback, useEffect } from "react";

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
  private baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

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

      // Response body'den error mesajını almaya çalış
      let errorMessage = `API error: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (e) {
        // JSON parse edemez ise varsayılan mesajı kullan
        console.error("Error parsing error response:", e);
      }

      console.error(
        `API Error - Status: ${response.status}, Message: ${errorMessage}, URL: ${this.baseUrl}${endpoint}`
      );
      throw new Error(errorMessage);
    }
    if (response.status === 204) return undefined as T; // No Content
    return response.json();
  }

  // Generic CRUD operations
  async get<T>(endpoint: string): Promise<T> {
    return this.fetchApi<T>(endpoint);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.fetchApi<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.fetchApi<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = void>(endpoint: string): Promise<T> {
    return this.fetchApi<T>(endpoint, { method: "DELETE" });
  }

  // ============ COMPANY API'LERİ ============

  /**
   * Tüm şirketleri getir
   */
  async getCompanies(): Promise<CompanyApiResponse[]> {
    return this.fetchApi<CompanyApiResponse[]>("/companies");
  }

  /**
   * Şirket detayını getir
   */
  async getCompany(id: string): Promise<Company> {
    return this.fetchApi<Company>(`/companies/${id}`);
  }

  /**
   * Şirket oluştur
   */
  async createCompany(
    company: Omit<Company, "id" | "createdAt" | "updatedAt">
  ): Promise<Company> {
    return this.fetchApi<Company>(`/companies`, {
      method: "POST",
      body: JSON.stringify(company),
    });
  }

  /**
   * Şirket güncelle
   */
  async updateCompany(id: string, company: Partial<Company>): Promise<Company> {
    return this.fetchApi<Company>(`/companies/${id}`, {
      method: "PUT",
      body: JSON.stringify(company),
    });
  }

  /**
   * Şirket sil
   */
  async deleteCompany(id: string): Promise<void> {
    await this.fetchApi<void>(`/companies/${id}`, { method: "DELETE" });
  }

  // ============ JOB API'LERİ ============

  /**
   * Tüm işleri getir
   */
  async getJobs(): Promise<JobApiResponse[]> {
    return this.fetchApi<JobApiResponse[]>("/jobs");
  }

  /**
   * Şirkete ait işleri getir
   */
  async getJobsByCompany(companyId: string): Promise<Job[]> {
    return this.fetchApi<Job[]>(`/jobs/company/${companyId}`);
  }

  /**
   * İş detayını getir
   */
  async getJob(id: string): Promise<Job> {
    return this.fetchApi<Job>(`/jobs/${id}`);
  }

  /**
   * İş oluştur
   */
  async createJob(
    job: Omit<Job, "id" | "createdAt" | "updatedAt">
  ): Promise<Job> {
    return this.fetchApi<Job>(`/jobs`, {
      method: "POST",
      body: JSON.stringify(job),
    });
  }

  /**
   * İş güncelle
   */
  async updateJob(id: string, job: Partial<Job>): Promise<Job> {
    return this.fetchApi<Job>(`/jobs/${id}`, {
      method: "PUT",
      body: JSON.stringify(job),
    });
  }

  /**
   * İş sil
   */
  async deleteJob(id: string): Promise<void> {
    await this.fetchApi<void>(`/jobs/${id}`, { method: "DELETE" });
  }

  // ============ QUOTE API'LERİ ============

  /**
   * İşe ait teklifleri getir
   */
  async getQuotesByJob(jobId: string): Promise<Quote[]> {
    return this.fetchApi<Quote[]>(`/quotes/job/${jobId}`);
  }

  /**
   * Şirkete ait teklifleri getir
   */
  async getQuotesByCompany(companyId: string): Promise<Quote[]> {
    return this.fetchApi<Quote[]>(`/quotes/company/${companyId}`);
  }

  /**
   * Teklif oluştur
   */
  async createQuote(
    quote: Omit<Quote, "id" | "createdAt" | "updatedAt">
  ): Promise<Quote> {
    return this.fetchApi<Quote>(`/quotes`, {
      method: "POST",
      body: JSON.stringify(quote),
    });
  }

  /**
   * Teklif güncelle
   */
  async updateQuote(id: string, quote: Partial<Quote>): Promise<Quote> {
    return this.fetchApi<Quote>(`/quotes/${id}`, {
      method: "PUT",
      body: JSON.stringify(quote),
    });
  }

  /**
   * Teklif sil
   */
  async deleteQuote(id: string): Promise<void> {
    await this.fetchApi<void>(`/quotes/${id}`, { method: "DELETE" });
  }

  // ============ NOTIFICATION API'LERİ ============

  /**
   * Kullanıcıya ait bildirimleri getir
   */
  async getNotifications(profileId: string): Promise<Notification[]> {
    return this.fetchApi<Notification[]>(`/notifications/profile/${profileId}`);
  }

  /**
   * Bildirimi okundu olarak işaretle
   */
  async markNotificationAsRead(id: string): Promise<void> {
    await this.fetchApi<void>(`/notifications/${id}/read`, {
      method: "POST",
    });
  }

  /**
   * Tüm bildirimleri okundu olarak işaretle
   */
  async markAllNotificationsAsRead(profileId: string): Promise<void> {
    await this.fetchApi<void>(`/notifications/profile/${profileId}/read-all`, {
      method: "POST",
    });
  }

  // ============ PROFILE API'LERİ ============

  /**
   * Profil bilgilerini getir
   */
  async getProfile(userId: string): Promise<any> {
    return this.fetchApi<any>(`/profiles/${userId}`);
  }

  /**
   * Profil güncelle
   */
  async updateProfile(userId: string, profile: any): Promise<any> {
    return this.fetchApi<any>(`/profiles/${userId}`, {
      method: "PUT",
      body: JSON.stringify(profile),
    });
  }

  // ============ NEW API'LER ============

  async getQuotes(): Promise<QuoteApiResponse[]> {
    return this.fetchApi<QuoteApiResponse[]>("/quotes");
  }
}

export default new BackendApiService();
