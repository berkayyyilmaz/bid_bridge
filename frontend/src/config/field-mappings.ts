// Field mappings - Veritabanı field'larını kullanıcı dostu başlıklara çevirir
import { TableConfig, TableType } from "@/config/table-configs";

export const FIELD_MAPPINGS = {
  // Genel fieldlar - tüm tablolarda kullanılabilir
  common: {
    id: "ID",
    created_at: "Oluşturulma Tarihi",
    updated_at: "Güncellenme Tarihi",
    is_active: "Aktif",
    status: "Durum",
    name: "Ad",
    email: "E-posta",
    phone: "Telefon",
    address: "Adres",
  },

  // Profiles tablosu için mappings
  profiles: {
    full_name: "Ad Soyad",
    role: "Rol",
    company_id: "Şirket",
  },

  // Companies tablosu için mappings
  companies: {
    name: "Şirket Adı",
    contact_email: "İletişim E-postası",
    contact_phone: "İletişim Telefonu",
    address: "Adres",
  },
} as const;

// Utility function - Field başlığını alır
export function getFieldTitle(tableName: string, fieldName: string): string {
  const tableMapping = FIELD_MAPPINGS[tableName as keyof typeof FIELD_MAPPINGS];
  const commonMapping = FIELD_MAPPINGS.common;

  // Önce tablo özelinde arar, sonra common'da arar, bulamazsa field adını düzenler
  return (
    (tableMapping as any)?.[fieldName] ||
    (commonMapping as any)[fieldName] ||
    fieldName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
}

// Helper function - Tablo konfigürasyonu oluşturur
export function createTableConfig<T extends Record<string, any>>(
  tableName: keyof typeof FIELD_MAPPINGS,
  columns: (keyof T)[],
  customConfig?: Partial<TableConfig>
): TableConfig {
  const defaultColumns = columns.map((key) => ({
    key: String(key),
    title: getFieldTitle(tableName as string, String(key)),
    sortable: true,
    filterable: true,
    type: "text" as const,
  }));

  return {
    type: tableName as TableType,
    columns: defaultColumns,
    title: getFieldTitle(tableName as string, "title"),
    searchable: true,
    exportable: true,
    pageSize: 10,
    selectable: true,
    rowSelection: "multiple",
    ...customConfig,
  };
}
