# 🏗️ Lookup Entities CRUD Sistemi Rehberi

Bu rehber, Bid Bridge projesinde lookup entity'ler için oluşturulan kapsamlı CRUD sistemini açıklar.

## 📋 **Oluşturulan Entity'ler**

### 1. **Incoterm** (`/incoterms`)

- **Amaç**: Uluslararası ticaret terimleri (FOB, CIF, EXW, vb.)
- **Alanlar**: `name`, `companyId`, `createdAt`
- **Endpoint**: `/api/incoterms`

### 2. **Shipping Method** (`/shipping-methods`)

- **Amaç**: Nakliye yöntemleri (Deniz, Hava, Kara yolu)
- **Alanlar**: `name`, `companyId`, `createdAt`
- **Endpoint**: `/api/shipping-methods`

### 3. **Port** (`/ports`)

- **Amaç**: Liman tanımları
- **Alanlar**: `name`, `companyId`, `createdAt`
- **Endpoint**: `/api/ports`

### 4. **Loading Place** (`/loading-places`)

- **Amaç**: Yükleme yeri tanımları
- **Alanlar**: `name`, `companyId`, `createdAt`
- **Endpoint**: `/api/loading-places`

### 5. **Loading Style** (`/loading-styles`)

- **Amaç**: Yükleme stili tanımları (Konteyner, Dökme, Paletli)
- **Alanlar**: `name`, `companyId`, `createdAt`
- **Endpoint**: `/api/loading-styles`

### 6. **Company** (`/companies`)

- **Amaç**: Şirket tanımları
- **Alanlar**: `name`, `createdAt`, `updatedAt`
- **Endpoint**: `/api/companies`

### 7. **Quote** (`/quotes`)

- **Amaç**: İş teklifleri
- **Alanlar**: `jobId`, `offeringCompanyId`, `price`, `currency`, `transitTime`, `validUntil`, `note`, `address`, `status`, `createdAt`
- **Endpoint**: `/api/quotes`

## 🏗️ **Sistem Mimarisi**

### **1. Tablo Konfigürasyonları** (`/config/table-configs.ts`)

```typescript
// Yeni lookup entity'ler için tablo tipleri eklendi
export type TableType =
  | "incoterm" | "shippingMethod" | "port" | "loadingPlace"
  | "loadingStyle" | "quote" | "companies" | // ...

// Tablo başlıkları
export const TABLE_TITLES: Record<TableType, string> = {
  incoterm: "Incoterm Listesi",
  shippingMethod: "Nakliye Yöntemleri",
  // ...
};

// Tablo kolonları - merkezi tanımlamalar
export const TABLE_COLUMNS: Record<TableType, TableColumnConfig[]> = {
  incoterm: [
    { key: "name", title: "Incoterm Adı", type: "text", sortable: true },
    { key: "companyName", title: "Şirket", type: "text", sortable: true },
    { key: "createdAt", title: "Oluşturulma Tarihi", type: "date", sortable: true },
  ],
  // ...
};

// Generic factory - mevcut sistem kullanılıyor
export function createTableConfig(type: TableType, customConfig?: Partial<TableConfig>)
```

### **2. Type Tanımları** (`/types/lookup.ts`)

```typescript
// Her entity için interface ve API response type'ları
export interface Incoterm extends BaseLookup {
  companyId?: string;
  companyName?: string;
}

export interface IncotermApiResponse {
  id: string;
  name: string;
  companyId?: string;
  companyName?: string;
  createdAt: string;
}

// Transform fonksiyonları
export function transformIncotermFromApi(
  apiIncoterm: IncotermApiResponse
): Incoterm;
```

### **3. Form Konfigürasyonları** (`/config/lookup-form-configs.ts`)

```typescript
// Zod schema'ları
export const incotermFormSchema = z.object({
  name: z.string().min(1, "Ad zorunludur").max(100, "Ad çok uzun"),
});

// Form config'leri
export const LOOKUP_FORM_CONFIGS: Record<LookupEntityType, FormConfig> = {
  incoterm: {
    title: "Incoterm",
    description: "Yeni incoterm ekleyin veya düzenleyin",
    schema: incotermFormSchema,
    layout: "single",
    sections: [
      /* ... */
    ],
  },
  // ...
};
```

### **4. Service Layer** (`/services/LookupService.ts`)

```typescript
// Generic service factory
function createLookupService<T, TFormData>(
  endpoint: string,
  transformFn: (apiData: any) => T
): CrudOperations<T, TFormData, Partial<TFormData>>;

// Entity-specific services
export const incotermCrudOperations = createLookupService<
  Incoterm,
  IncotermFormData
>("incoterms", transformIncotermFromApi);

// Dropdown options helper'ları
export async function getIncotermOptions() {
  const incoterms = await incotermCrudOperations.getAll();
  return incoterms.map((item) => ({
    label: item.name,
    value: item.id,
  }));
}
```

### **5. Sayfa Bileşenleri** (`/app/(authenticated)/*/page.tsx`)

```typescript
// Generic CRUD hook kullanımı
const useIncotermCrud = createCrudHook<
  Incoterm,
  IncotermFormData,
  Partial<IncotermFormData>
>(incotermCrudOperations);

// Standart sayfa yapısı
export default function IncotermsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Incoterm | null>(null);

  const {
    data: incoterms,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refetch,
  } = useIncotermCrud();

  // CRUD handlers
  // DataTable + CrudEditModal kullanımı
  return (
    <DataTable
      data={incoterms}
      config={createTableConfig("incoterm")} // ✅ createTableConfig kullanımı
      onRowEdit={handleEdit}
      onRowDelete={handleDelete}
    />
  );
}
```

## 🔄 **Job Form Entegrasyonu**

Job formu artık gerçek API'lerden dropdown verilerini çekiyor:

```typescript
// form-configs.ts içinde
{
  name: "incotermId",
  label: "Incoterm",
  type: "select",
  required: true,
  options: async () => {
    const { getIncotermOptions } = await import('@/services/LookupService');
    return getIncotermOptions();
  },
},
```

## 📊 **Veri Akışı**

1. **Sayfa Yükleme**: `useIncotermCrud()` → `incotermCrudOperations.getAll()` → API çağrısı
2. **Modal Açma**: Form config'i yüklenir, dropdown'lar için async options çağrılır
3. **Form Submit**: Validation → API çağrısı → Başarılı ise modal kapanır ve tablo yenilenir
4. **Job Form**: Dropdown açıldığında ilgili lookup service'den options çekilir

## 🎯 **Özellikler**

### ✅ **Tamamlanan**

- [x] 7 lookup entity için tam CRUD sistemi
- [x] Generic service factory pattern
- [x] Type-safe form validasyonu (Zod)
- [x] Async dropdown options
- [x] Job form entegrasyonu
- [x] DataTable ile listeleme
- [x] Modal ile ekleme/düzenleme
- [x] Silme işlemleri
- [x] Error handling
- [x] Loading states

### 🔄 **Backend Entegrasyonu Gerekli**

- [ ] Backend API endpoint'leri oluşturulmalı
- [ ] Database migration'ları çalıştırılmalı
- [ ] Authentication/Authorization eklenmeli

## 🚀 **Kullanım**

### **Yeni Lookup Entity Ekleme (3 Adım)**

1. **Type tanımla** (`/types/lookup.ts`):

```typescript
export interface NewEntity extends BaseLookup {
  // additional fields
}
```

2. **Form config ekle** (`/config/lookup-form-configs.ts`):

```typescript
export const newEntityFormSchema = z.object({
  name: z.string().min(1, "Ad zorunludur"),
});

// LOOKUP_FORM_CONFIGS'e ekle
```

3. **Service ve sayfa oluştur**:

```typescript
export const newEntityCrudOperations = createLookupService<
  NewEntity,
  NewEntityFormData
>("new-entities", transformNewEntityFromApi);
```

### **Job Form'a Yeni Dropdown Ekleme**

```typescript
// form-configs.ts içinde job config'ine ekle
{
  name: "newEntityId",
  label: "New Entity",
  type: "select",
  required: true,
  options: async () => {
    const { getNewEntityOptions } = await import('@/services/LookupService');
    return getNewEntityOptions();
  },
},
```

## 🔧 **Teknik Detaylar**

- **Framework**: Next.js 14, TypeScript
- **Form Management**: React Hook Form + Zod
- **State Management**: Custom CRUD hooks
- **UI Components**: ShadCN UI + DataTable
- **Table System**: `createTableConfig()` factory pattern - mevcut sistemle uyumlu
- **API Layer**: Fetch-based service pattern
- **Type Safety**: End-to-end TypeScript support

## 📝 **Notlar**

- ✅ **`createTableConfig()` kullanımı** - Mevcut sistemle uyumlu
- ✅ **Merkezi tablo konfigürasyonları** - `table-configs.ts`'de tanımlı
- ✅ **Tüm lookup entity'ler company-scoped** (şirket bazlı filtreleme)
- ✅ **Form validasyonu** client-side (Zod) + server-side gerekli
- ✅ **Async dropdown loading** ile performans optimizasyonu
- ✅ **Generic pattern** sayesinde yeni entity ekleme çok kolay
- ✅ **Mevcut DataTable sistemi** ile tam uyumlu

Bu sistem, SOLID prensiplerine uygun, DRY, scalable ve maintainable bir yapı sunmaktadır.
