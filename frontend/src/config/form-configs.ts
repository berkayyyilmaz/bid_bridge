import { z } from "zod";
import { ReactNode } from "react";

// Form field tipleri
export type FormFieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "select"
  | "multiselect"
  | "date"
  | "checkbox"
  | "radio";

// Dropdown option interface
export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

// Form field konfigürasyonu
export interface FormFieldConfig {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  options?: SelectOption[] | (() => Promise<SelectOption[]>); // Static veya dynamic options
  validation?: z.ZodSchema<any>;
  dependencies?: string[]; // Bu field hangi fieldlara bağımlı
  conditionalRender?: (values: any) => boolean; // Koşullu görünürlük
  className?: string;
  gridColumn?: string; // CSS Grid column span
}

// Form section (gruplandırma için)
export interface FormSection {
  title?: string;
  description?: string;
  fields: FormFieldConfig[];
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

// Form konfigürasyonu
export interface FormConfig<T = any> {
  title: string;
  description?: string;
  schema: z.ZodSchema<T>;
  sections: FormSection[];
  submitButtonText?: string;
  cancelButtonText?: string;
  layout?: "single" | "two-column" | "grid";
  onSubmit?: (data: T) => Promise<void>;
  onCancel?: () => void;
}

// Entity tipleri
export type EntityType = "job" | "quote" | "company" | "user";

// Form config factory
export function createFormConfig<T>(
  entityType: EntityType,
  customConfig?: Partial<FormConfig<T>>
): FormConfig<T> {
  const baseConfig = FORM_CONFIGS[entityType] as FormConfig<T>;
  return {
    ...baseConfig,
    ...customConfig,
    sections: customConfig?.sections || baseConfig.sections,
  };
}

// Job form schema (Backend Job entity'sine uygun)
export const jobFormSchema = z.object({
  title: z
    .string()
    .min(1, "İş başlığı zorunludur")
    .max(200, "İş başlığı çok uzun"),
  incotermId: z.string().min(1, "Incoterm seçimi zorunludur"),
  shippingMethodId: z.string().min(1, "Nakliye yöntemi seçimi zorunludur"),
  loadingPlaceId: z.string().min(1, "Yükleme yeri seçimi zorunludur"),
  portId: z.string().min(1, "Liman seçimi zorunludur"),
  loadingDate: z.string().min(1, "Yükleme tarihi zorunludur"),
  loadingStyleId: z.string().min(1, "Yükleme stili seçimi zorunludur"),
  estimatedAnnualTonnage: z.string().min(1, "Tahmini yıllık tonaj zorunludur"),
  address: z.string().min(1, "Adres zorunludur").max(500, "Adres çok uzun"),
  note: z.string().optional(),
  // ownerCompanyId backend'de otomatik set edilecek (current user'ın company'si)
});

export type JobFormData = z.infer<typeof jobFormSchema>;

// Quote form schema
export const quoteFormSchema = z.object({
  jobId: z.string().min(1, "İş seçimi zorunludur"),
  price: z.number().min(0, "Fiyat 0'dan büyük olmalıdır"),
  currency: z.string().min(1, "Para birimi seçimi zorunludur"),
  transitTime: z.number().min(1, "Transit süresi 1'den büyük olmalıdır"),
  validUntil: z.string().min(1, "Geçerlilik tarihi zorunludur"),
  notes: z.string().optional(),
});

export type QuoteFormData = z.infer<typeof quoteFormSchema>;

// Company form schema
export const companyFormSchema = z.object({
  name: z
    .string()
    .min(1, "Şirket adı zorunludur")
    .max(200, "Şirket adı çok uzun"),
  contactEmail: z.string().email("Geçerli bir e-posta adresi giriniz"),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  website: z
    .string()
    .url("Geçerli bir website adresi giriniz")
    .optional()
    .or(z.literal("")),
  description: z.string().optional(),
});

export type CompanyFormData = z.infer<typeof companyFormSchema>;

// Form konfigürasyonları
export const FORM_CONFIGS: Record<EntityType, FormConfig> = {
  job: {
    title: "İş Formu",
    description: "Yeni bir nakliye işi oluşturun veya mevcut işi düzenleyin",
    schema: jobFormSchema,
    layout: "two-column",
    sections: [
      {
        title: "Temel Bilgiler",
        fields: [
          {
            name: "title",
            label: "İş Başlığı",
            type: "text",
            placeholder: "Örn: İstanbul-Hamburg Konteyner Taşımacılığı",
            required: true,
            gridColumn: "col-span-2",
          },
          {
            name: "incotermId",
            label: "Incoterm",
            type: "select",
            required: true,
            options: async () => {
              const { getIncotermOptions } = await import(
                "@/services/LookupService"
              );
              return getIncotermOptions();
            },
          },
          {
            name: "shippingMethodId",
            label: "Nakliye Yöntemi",
            type: "select",
            required: true,
            options: async () => {
              const { getShippingMethodOptions } = await import(
                "@/services/LookupService"
              );
              return getShippingMethodOptions();
            },
          },
        ],
      },
      {
        title: "Lokasyon Bilgileri",
        fields: [
          {
            name: "loadingPlaceId",
            label: "Yükleme Yeri",
            type: "select",
            required: true,
            options: async () => {
              const { getLoadingPlaceOptions } = await import(
                "@/services/LookupService"
              );
              return getLoadingPlaceOptions();
            },
          },
          {
            name: "portId",
            label: "Liman",
            type: "select",
            required: true,
            options: async () => {
              const { getPortOptions } = await import(
                "@/services/LookupService"
              );
              return getPortOptions();
            },
          },
          {
            name: "address",
            label: "Detaylı Adres",
            type: "textarea",
            placeholder: "Tam adres bilgilerini giriniz",
            required: true,
            gridColumn: "col-span-2",
          },
        ],
      },
      {
        title: "Yükleme Detayları",
        fields: [
          {
            name: "loadingDate",
            label: "Yükleme Tarihi",
            type: "date",
            required: true,
          },
          {
            name: "loadingStyleId",
            label: "Yükleme Stili",
            type: "select",
            required: true,
            options: async () => {
              const { getLoadingStyleOptions } = await import(
                "@/services/LookupService"
              );
              return getLoadingStyleOptions();
            },
          },
          {
            name: "estimatedAnnualTonnage",
            label: "Tahmini Yıllık Tonaj",
            type: "text",
            placeholder: "Örn: 1000 ton",
            required: true,
          },
          {
            name: "note",
            label: "Notlar",
            type: "textarea",
            placeholder: "Ek bilgiler ve özel talepler",
            gridColumn: "col-span-2",
          },
        ],
      },
    ],
    submitButtonText: "İşi Kaydet",
    cancelButtonText: "İptal",
  },

  quote: {
    title: "Teklif Formu",
    description: "İş için teklif verin",
    schema: quoteFormSchema,
    layout: "single",
    sections: [
      {
        title: "Teklif Bilgileri",
        fields: [
          {
            name: "jobId",
            label: "İş",
            type: "select",
            required: true,
            options: async () => {
              const { getJobOptions } = await import(
                "@/services/LookupService"
              );
              return getJobOptions();
            },
          },
          {
            name: "price",
            label: "Fiyat",
            type: "number",
            placeholder: "0.00",
            required: true,
          },
          {
            name: "currency",
            label: "Para Birimi",
            type: "select",
            required: true,
            options: [
              { label: "USD", value: "USD" },
              { label: "EUR", value: "EUR" },
              { label: "TRY", value: "TRY" },
            ],
          },
          {
            name: "transitTime",
            label: "Transit Süresi (Gün)",
            type: "number",
            placeholder: "15",
            required: true,
          },
          {
            name: "validUntil",
            label: "Geçerlilik Tarihi",
            type: "date",
            required: true,
          },
          {
            name: "notes",
            label: "Notlar",
            type: "textarea",
            placeholder: "Teklif ile ilgili ek bilgiler",
          },
        ],
      },
    ],
    submitButtonText: "Teklifi Gönder",
    cancelButtonText: "İptal",
  },

  company: {
    title: "Şirket Formu",
    description: "Şirket bilgilerini düzenleyin",
    schema: companyFormSchema,
    layout: "single",
    sections: [
      {
        title: "Şirket Bilgileri",
        fields: [
          {
            name: "name",
            label: "Şirket Adı",
            type: "text",
            placeholder: "Şirket adını giriniz",
            required: true,
          },
          {
            name: "contactEmail",
            label: "İletişim E-postası",
            type: "email",
            placeholder: "info@sirket.com",
            required: true,
          },
          {
            name: "contactPhone",
            label: "İletişim Telefonu",
            type: "text",
            placeholder: "+90 555 123 45 67",
          },
          {
            name: "website",
            label: "Website",
            type: "text",
            placeholder: "https://www.sirket.com",
          },
          {
            name: "address",
            label: "Adres",
            type: "textarea",
            placeholder: "Şirket adresi",
          },
          {
            name: "description",
            label: "Açıklama",
            type: "textarea",
            placeholder: "Şirket hakkında kısa bilgi",
          },
        ],
      },
    ],
    submitButtonText: "Şirketi Kaydet",
    cancelButtonText: "İptal",
  },

  user: {
    title: "Kullanıcı Formu",
    description: "Kullanıcı bilgilerini düzenleyin",
    schema: z.object({
      fullName: z.string().min(1, "Ad soyad zorunludur"),
      email: z.string().email("Geçerli bir e-posta adresi giriniz"),
      role: z.string().min(1, "Rol seçimi zorunludur"),
    }),
    layout: "single",
    sections: [
      {
        title: "Kullanıcı Bilgileri",
        fields: [
          {
            name: "fullName",
            label: "Ad Soyad",
            type: "text",
            placeholder: "Ad ve soyadınızı giriniz",
            required: true,
          },
          {
            name: "email",
            label: "E-posta",
            type: "email",
            placeholder: "ornek@email.com",
            required: true,
          },
          {
            name: "role",
            label: "Rol",
            type: "select",
            required: true,
            options: [
              { label: "Yönetici", value: "admin" },
              { label: "Kullanıcı", value: "user" },
            ],
          },
        ],
      },
    ],
    submitButtonText: "Kullanıcıyı Kaydet",
    cancelButtonText: "İptal",
  },
};
