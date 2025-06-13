// Tablo tipleri için merkezi tanımlamalar
export type TableType =
  | "profiles"
  | "companies"
  | "orders"
  | "incoterm"
  | "job";

// Tablo başlıkları için mapping
export const TABLE_TITLES: Record<TableType, string> = {
  profiles: "Kullanıcı Listesi",
  companies: "Şirket Listesi",
  orders: "Sipariş Listesi",
  incoterm: "Incoterm Listesi",
  job: "İş Listesi",
};

// Tablo kolonları için tip tanımlamaları
export interface TableColumnConfig {
  key: string;
  title: string;
  type: "text" | "number" | "date" | "boolean" | "select";
  filterable?: boolean;
  sortable?: boolean;
  width?: number;
  filterOptions?: Array<{ label: string; value: string }>;
  render?: (value: any, row: any) => React.ReactNode;
}

// Tablo konfigürasyonu için tip tanımlaması
export interface TableConfig {
  type: TableType;
  columns: TableColumnConfig[];
  title: string;
  searchable?: boolean;
  exportable?: boolean;
  selectable?: boolean;
  rowSelection?: "single" | "multiple";
  pageSize?: number;
  columnResizing?: boolean;
}

// Varsayılan tablo konfigürasyonu
const DEFAULT_TABLE_CONFIG: Omit<TableConfig, "type" | "columns" | "title"> = {
  searchable: true,
  exportable: true,
  selectable: true,
  rowSelection: "multiple",
  pageSize: 10,
  columnResizing: true,
};

// Tablo kolonları için merkezi tanımlamalar
export const TABLE_COLUMNS: Record<TableType, TableColumnConfig[]> = {
  profiles: [
    {
      key: "full_name",
      title: "Ad Soyad",
      type: "text",
      sortable: true,
      filterable: true,
    },
    {
      key: "role",
      title: "Rol",
      type: "select",
      sortable: true,
      filterable: true,
    },
    {
      key: "created_at",
      title: "Oluşturulma Tarihi",
      type: "date",
      sortable: true,
    },
  ],
  companies: [
    {
      key: "name",
      title: "Şirket Adı",
      type: "text",
      sortable: true,
      filterable: true,
    },
    {
      key: "contact_email",
      title: "İletişim E-postası",
      type: "text",
      sortable: true,
      filterable: true,
    },
    {
      key: "created_at",
      title: "Oluşturulma Tarihi",
      type: "date",
      sortable: true,
    },
  ],
  orders: [
    {
      key: "order_number",
      title: "Sipariş No",
      type: "text",
      sortable: true,
      filterable: true,
    },
    {
      key: "customer_name",
      title: "Müşteri Adı",
      type: "text",
      sortable: true,
      filterable: true,
    },
    {
      key: "total_amount",
      title: "Toplam Tutar",
      type: "number",
      sortable: true,
      filterable: true,
    },
    {
      key: "created_at",
      title: "Oluşturulma Tarihi",
      type: "date",
      sortable: true,
    },
  ],
  incoterm: [
    {
      key: "name",
      title: "Incoterm Adı",
      type: "text",
      sortable: true,
      filterable: true,
    },
    {
      key: "description",
      title: "Açıklama",
      type: "text",
      sortable: true,
    },
    {
      key: "created_at",
      title: "Oluşturulma Tarihi",
      type: "date",
      sortable: true,
    },
  ],
  job: [
    {
      key: "title",
      title: "İş Başlığı",
      type: "text",
      sortable: true,
      filterable: true,
    },
    {
      key: "status",
      title: "Durum",
      type: "select",
      sortable: true,
      filterable: true,
    },
    {
      key: "created_at",
      title: "Oluşturulma Tarihi",
      type: "date",
      sortable: true,
    },
  ],
};

// Generic tablo konfigürasyonu oluşturucu
export function createTableConfig(
  type: TableType,
  customConfig?: Partial<TableConfig>
): TableConfig {
  const columns = TABLE_COLUMNS[type];
  if (!columns) {
    console.warn(`Tablo tipi için kolon bulunamadı: ${type}`);
  }
  return {
    type,
    columns: columns || [],
    title: TABLE_TITLES[type],
    ...DEFAULT_TABLE_CONFIG,
    ...customConfig,
  };
}
