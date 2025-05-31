# DataTable Component Kullanım Kılavuzu

Bu rehber, yeniden kullanılabilir DataTable componentinin nasıl kullanılacağını açıklar.

## Özellikler

- ✅ **Sıralama** - Kolonlara göre sıralama
- ✅ **Filtreleme** - Global arama ve kolon bazlı filtreler
- ✅ **Seçim** - Tekli/çoklu satır seçimi
- ✅ **Sayfalama** - Otomatik sayfalama
- ✅ **CSV Export** - Verileri CSV olarak indirme
- ✅ **Kolon Görünürlüğü** - Kolonları gizleme/gösterme
- ✅ **Responsive** - Mobil uyumlu tasarım
- ✅ **Loading State** - Yükleme durumu
- ✅ **Özelleştirilebilir Rendering** - Custom cell rendering

## Temel Kullanım

### 1. Gerekli Import'lar

```tsx
import { DataTable } from "@/components/ui/data-table";
import { createTableConfig } from "@/config/field-mappings";
import { TableConfig } from "@/types/table";
```

### 2. Basit Tablo

```tsx
"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { createTableConfig } from "@/config/field-mappings";

interface User {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
}

export default function UsersPage() {
  const [users] = useState<User[]>([
    {
      id: "1",
      full_name: "Ahmet Yılmaz",
      role: "ADMIN",
      created_at: "2023-01-15T10:00:00.000Z",
    },
  ]);

  // Otomatik mapping ile tablo konfigürasyonu
  const tableConfig = createTableConfig(
    "profiles",
    ["full_name", "role", "created_at"],
    {
      title: "Kullanıcı Listesi",
    }
  );

  return (
    <div className="container mx-auto py-6">
      <DataTable data={users} config={tableConfig} />
    </div>
  );
}
```

### 3. Gelişmiş Kullanım

```tsx
const tableConfig: TableConfig<User> = {
  columns: [
    {
      key: "full_name",
      title: "Ad Soyad",
      sortable: true,
      filterable: true,
      type: "text",
    },
    {
      key: "role",
      title: "Rol",
      sortable: true,
      filterable: true,
      type: "select",
      filterOptions: [
        { label: "Admin", value: "ADMIN" },
        { label: "Kullanıcı", value: "USER" },
      ],
      render: (value) => (
        <Badge variant={value === "ADMIN" ? "destructive" : "default"}>
          {value === "ADMIN" ? "Admin" : "Kullanıcı"}
        </Badge>
      ),
    },
    {
      key: "created_at",
      title: "Kayıt Tarihi",
      sortable: true,
      type: "date",
    },
  ],
  title: "Kullanıcı Yönetimi",
  searchable: true,
  exportable: true,
  selectable: true,
  rowSelection: "multiple",
  columnResizing: true,
  pageSize: 10,
};
```

## Field Mapping Sistemi

### Mevcut Mappings

`src/config/field-mappings.ts` dosyasında tanımlı:

```typescript
export const FIELD_MAPPINGS = {
  common: {
    id: "ID",
    created_at: "Oluşturulma Tarihi",
    updated_at: "Güncellenme Tarihi",
    // ...
  },
  profiles: {
    full_name: "Ad Soyad",
    role: "Rol",
    company_id: "Şirket",
  },
  companies: {
    name: "Şirket Adı",
    contact_email: "İletişim E-postası",
    // ...
  },
};
```

### Yeni Mapping Ekleme

```typescript
// field-mappings.ts dosyasına ekleyin
export const FIELD_MAPPINGS = {
  // ...existing mappings

  orders: {
    order_number: "Sipariş No",
    customer_name: "Müşteri Adı",
    total_amount: "Toplam Tutar",
    order_status: "Durum",
  },
};
```

## Event Handling

```tsx
<DataTable
  data={data}
  config={tableConfig}
  onRowClick={(row) => {
    // Satır tıklandığında
    console.log("Tıklanan satır:", row);
  }}
  onSelectionChange={(selectedRows) => {
    // Seçim değiştiğinde
    console.log("Seçilen satırlar:", selectedRows);
  }}
  onRowEdit={(row) => {
    // Düzenleme butonuna tıklandığında
    setSelectedItem(row);
    setIsEditModalOpen(true);
  }}
  onRowDelete={(row) => {
    // Silme butonuna tıklandığında
    if (confirm("Silmek istediğinize emin misiniz?")) {
      handleDelete(row.id);
    }
  }}
/>
```

## EditModal ile Entegrasyon

```tsx
import { EditModal } from "@/components/ui/edit-modal";
import { FormField } from "@/types/table";

const formFields: FormField[] = [
  { key: "full_name", label: "Ad Soyad", type: "text", required: true },
  {
    key: "role",
    label: "Rol",
    type: "select",
    options: [
      { label: "Admin", value: "ADMIN" },
      { label: "Kullanıcı", value: "USER" },
    ],
  },
];

<EditModal
  isOpen={isEditModalOpen}
  onClose={() => setIsEditModalOpen(false)}
  onSave={handleSave}
  data={selectedItem}
  fields={formFields}
  title="Kullanıcı Düzenle"
  loading={loading}
/>;
```

## Performans İpuçları

### 1. Büyük Veri Setleri

- `pageSize` özelliğini kullanarak sayfa başına gösterilen kayıt sayısını sınırlayın
- Server-side pagination implementasyonu düşünün

### 2. Custom Rendering

- `render` fonksiyonunda complex hesaplamalar yapmaktan kaçının
- Memoization kullanın

### 3. Re-rendering Optimizasyonu

```tsx
const tableConfig = useMemo(() => createTableConfig(...), [dependencies]);
const memoizedData = useMemo(() => processData(rawData), [rawData]);
```

## Özelleştirme

### Column Types

- `text` - Metin değerler
- `number` - Sayısal değerler (Türkçe formatında)
- `date` - Tarih değerler (tr-TR locale)
- `boolean` - Boolean değerler (Evet/Hayır badge)
- `select` - Seçenekli değerler (filtreleme ile)

### Custom Rendering

```tsx
{
  key: 'status',
  title: 'Durum',
  render: (value, row) => {
    switch (value) {
      case 'active':
        return <Badge variant="default">Aktif</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Pasif</Badge>;
      default:
        return <Badge variant="outline">Bilinmeyen</Badge>;
    }
  }
}
```

## Test

Test sayfası: `/test-table`

Bu sayfa tüm özellikleri test etmek için oluşturulmuştur ve mock veriler kullanır.

## Silinecek Dosyalar (Üretim Öncesi)

Aşağıdaki dosyalar sadece geliştirme ve test amaçlıdır:

- ❌ `src/lib/mock-data.ts`
- ❌ `src/app/test-table/page.tsx`
- ❌ Bu README dosyasında yer alan test bölümleri

## Best Practices

1. **Field Mappings**: Her yeni tablo için `field-mappings.ts` dosyasına mapping ekleyin
2. **Type Safety**: Interface'leri doğru tanımlayın
3. **Performance**: Büyük veri setleri için server-side işlemler kullanın
4. **Accessibility**: ARIA label'ları ve keyboard navigation otomatik olarak dahildir
5. **Responsive**: Mobil cihazlarda da kullanılabilir
