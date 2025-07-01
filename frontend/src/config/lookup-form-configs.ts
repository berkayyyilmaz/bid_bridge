import { z } from "zod";
import { FormConfig } from "./form-configs";

// Lookup Entity Types
export type LookupEntityType =
  | "incoterm"
  | "shippingMethod"
  | "port"
  | "loadingPlace"
  | "loadingStyle"
  | "company"
  | "quote";

// Base Lookup Schema (name + company_id)
const baseLookupSchema = z.object({
  name: z.string().min(1, "Ad zorunludur").max(100, "Ad çok uzun"),
  companyId: z.string().optional(),
});

// Incoterm Schema
export const incotermFormSchema = baseLookupSchema;
export type IncotermFormData = z.infer<typeof incotermFormSchema>;

// Shipping Method Schema
export const shippingMethodFormSchema = baseLookupSchema;
export type ShippingMethodFormData = z.infer<typeof shippingMethodFormSchema>;

// Port Schema
export const portFormSchema = baseLookupSchema;
export type PortFormData = z.infer<typeof portFormSchema>;

// Loading Place Schema
export const loadingPlaceFormSchema = baseLookupSchema;
export type LoadingPlaceFormData = z.infer<typeof loadingPlaceFormSchema>;

// Loading Style Schema
export const loadingStyleFormSchema = baseLookupSchema;
export type LoadingStyleFormData = z.infer<typeof loadingStyleFormSchema>;

// Company Schema (genişletilmiş)
export const companyFormSchema = z.object({
  name: z
    .string()
    .min(1, "Şirket adı zorunludur")
    .max(200, "Şirket adı çok uzun"),
});
export type CompanyFormData = z.infer<typeof companyFormSchema>;

// Quote Schema (Job entity'sine uygun)
export const quoteFormSchema = z.object({
  jobId: z.string().min(1, "İş seçimi zorunludur"),
  price: z.number().min(0, "Fiyat 0'dan büyük olmalıdır"),
  currency: z.string().min(1, "Para birimi seçimi zorunludur"),
  transitTime: z.number().min(1, "Transit süresi 1'den büyük olmalıdır"),
  validUntil: z.string().min(1, "Geçerlilik tarihi zorunludur"),
  note: z.string().optional(),
  address: z.string().optional(),
  status: z.string().optional(),
});
export type QuoteFormData = z.infer<typeof quoteFormSchema>;

// Lookup Form Configurations
export const LOOKUP_FORM_CONFIGS: Record<LookupEntityType, FormConfig> = {
  incoterm: {
    title: "Incoterm",
    description: "Yeni incoterm ekleyin veya düzenleyin",
    schema: incotermFormSchema,
    layout: "single",
    sections: [
      {
        title: "Incoterm Bilgileri",
        fields: [
          {
            name: "name",
            label: "Incoterm Adı",
            type: "text",
            placeholder: "Örn: FOB, CIF, EXW",
            required: true,
          },
        ],
      },
    ],
    submitButtonText: "Incoterm Kaydet",
    cancelButtonText: "İptal",
  },

  shippingMethod: {
    title: "Nakliye Yöntemi",
    description: "Yeni nakliye yöntemi ekleyin veya düzenleyin",
    schema: shippingMethodFormSchema,
    layout: "single",
    sections: [
      {
        title: "Nakliye Yöntemi Bilgileri",
        fields: [
          {
            name: "name",
            label: "Nakliye Yöntemi Adı",
            type: "text",
            placeholder: "Örn: Deniz Yolu, Hava Yolu, Kara Yolu",
            required: true,
          },
        ],
      },
    ],
    submitButtonText: "Nakliye Yöntemi Kaydet",
    cancelButtonText: "İptal",
  },

  port: {
    title: "Liman",
    description: "Yeni liman ekleyin veya düzenleyin",
    schema: portFormSchema,
    layout: "single",
    sections: [
      {
        title: "Liman Bilgileri",
        fields: [
          {
            name: "name",
            label: "Liman Adı",
            type: "text",
            placeholder: "Örn: İstanbul Limanı, İzmir Limanı",
            required: true,
          },
        ],
      },
    ],
    submitButtonText: "Liman Kaydet",
    cancelButtonText: "İptal",
  },

  loadingPlace: {
    title: "Yükleme Yeri",
    description: "Yeni yükleme yeri ekleyin veya düzenleyin",
    schema: loadingPlaceFormSchema,
    layout: "single",
    sections: [
      {
        title: "Yükleme Yeri Bilgileri",
        fields: [
          {
            name: "name",
            label: "Yükleme Yeri Adı",
            type: "text",
            placeholder: "Örn: Fabrika, Depo, Liman",
            required: true,
          },
        ],
      },
    ],
    submitButtonText: "Yükleme Yeri Kaydet",
    cancelButtonText: "İptal",
  },

  loadingStyle: {
    title: "Yükleme Stili",
    description: "Yeni yükleme stili ekleyin veya düzenleyin",
    schema: loadingStyleFormSchema,
    layout: "single",
    sections: [
      {
        title: "Yükleme Stili Bilgileri",
        fields: [
          {
            name: "name",
            label: "Yükleme Stili Adı",
            type: "text",
            placeholder: "Örn: Konteyner, Dökme, Paletli",
            required: true,
          },
        ],
      },
    ],
    submitButtonText: "Yükleme Stili Kaydet",
    cancelButtonText: "İptal",
  },

  company: {
    title: "Şirket",
    description: "Yeni şirket ekleyin veya düzenleyin",
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
        ],
      },
    ],
    submitButtonText: "Şirket Kaydet",
    cancelButtonText: "İptal",
  },

  quote: {
    title: "Teklif",
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
            options: [], // Bu dinamik olarak doldurulacak
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
            name: "address",
            label: "Adres",
            type: "textarea",
            placeholder: "Teslim adresi",
          },
          {
            name: "note",
            label: "Notlar",
            type: "textarea",
            placeholder: "Teklif ile ilgili ek bilgiler",
          },
          {
            name: "status",
            label: "Durum",
            type: "select",
            options: [
              { label: "Beklemede", value: "PENDING" },
              { label: "Onaylandı", value: "APPROVED" },
              { label: "Reddedildi", value: "REJECTED" },
            ],
          },
        ],
      },
    ],
    submitButtonText: "Teklifi Gönder",
    cancelButtonText: "İptal",
  },
};

// Helper function to get lookup form config
export function getLookupFormConfig<T>(
  entityType: LookupEntityType,
  customConfig?: Partial<FormConfig<T>>
): FormConfig<T> {
  const baseConfig = LOOKUP_FORM_CONFIGS[entityType] as FormConfig<T>;
  return {
    ...baseConfig,
    ...customConfig,
  };
}
