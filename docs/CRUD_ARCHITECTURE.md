# 🏗️ Generic CRUD Architecture

Bu dokümantasyon, projedeki **SOLID prensiplerine uygun**, **DRY** ve **ölçeklenebilir** generic CRUD mimarisini açıklar.

## 📁 Dosya Yapısı

```
frontend/src/
├── 📁 hooks/
│   └── 📄 useCrudOperations.ts          # Generic CRUD hook factory
├── 📁 config/
│   ├── 📄 form-configs.ts               # Form konfigürasyonları ve şemalar
│   └── 📄 table-configs.ts              # Tablo konfigürasyonları (mevcut)
├── 📁 components/
│   └── 📁 forms/
│       ├── 📄 DynamicForm.tsx           # Config-driven dinamik form
│       └── 📄 CrudEditModal.tsx         # Yeniden kullanılabilir modal
├── 📁 services/
│   ├── 📄 JobService.ts                 # Job entity CRUD operasyonları
│   ├── 📄 QuoteService.ts               # Quote entity CRUD operasyonları (örnek)
│   └── 📄 CompanyService.ts             # Company entity CRUD operasyonları (örnek)
└── 📁 app/(authenticated)/
    ├── 📁 jobs/
    │   └── 📄 page.tsx                  # Jobs sayfası (örnek implementasyon)
    ├── 📁 quotes/
    │   └── 📄 page.tsx                  # Quotes sayfası
    └── 📁 companies/
        └── 📄 page.tsx                  # Companies sayfası
```

## 🔧 Mimari Bileşenleri

### 1. **Generic CRUD Hook Factory** (`useCrudOperations.ts`)

```typescript
// Kullanım örneği
const useJobCrud = createCrudHook(jobCrudOperations);

const {
  data,
  loading,
  error,
  fetchAll,
  createItem,
  updateItem,
  deleteItem,
  selectedItem,
  setSelectedItem,
  refetch,
} = useJobCrud();
```

**Özellikler:**

- ✅ Generic tip desteği (`<T, TCreate, TUpdate>`)
- ✅ Otomatik state yönetimi
- ✅ Error handling
- ✅ Loading states
- ✅ Optimistic updates

### 2. **Config-Driven Form System** (`form-configs.ts`)

```typescript
// Form konfigürasyonu örneği
export const FORM_CONFIGS: Record<EntityType, FormConfig> = {
  job: {
    title: "İş Formu",
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
            required: true,
          },
          // ...
        ],
      },
    ],
  },
};
```

**Özellikler:**

- ✅ Zod schema validation
- ✅ Dynamic field options (async)
- ✅ Conditional field rendering
- ✅ Multiple layout options
- ✅ Section-based organization
- ✅ Field dependencies

### 3. **Dynamic Form Component** (`DynamicForm.tsx`)

```typescript
<DynamicForm<JobFormData>
  config={formConfig}
  initialData={editingJob}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  loading={loading}
/>
```

**Özellikler:**

- ✅ React Hook Form integration
- ✅ Automatic field rendering
- ✅ Real-time validation
- ✅ Dynamic options loading
- ✅ Responsive layouts

### 4. **Reusable CRUD Modal** (`CrudEditModal.tsx`)

```typescript
<CrudEditModal<JobFormData>
  isOpen={isModalOpen}
  onClose={handleClose}
  config={formConfig}
  initialData={initialData}
  onSubmit={handleSubmit}
  mode="create" // or "edit"
/>
```

**Özellikler:**

- ✅ Create/Edit mode support
- ✅ Auto-sizing modal
- ✅ Form integration
- ✅ Error handling

### 5. **Entity Services** (`JobService.ts`)

```typescript
export const jobCrudOperations: CrudOperations<
  Job,
  JobFormData,
  Partial<JobFormData>
> = {
  async getAll(): Promise<Job[]> {
    /* ... */
  },
  async getById(id: string): Promise<Job> {
    /* ... */
  },
  async create(data: JobFormData): Promise<Job> {
    /* ... */
  },
  async update(id: string, data: Partial<JobFormData>): Promise<Job> {
    /* ... */
  },
  async delete(id: string): Promise<void> {
    /* ... */
  },
};
```

**Özellikler:**

- ✅ Backend API integration
- ✅ Data transformation
- ✅ Type safety
- ✅ Error handling

## 🚀 Kullanım Örnekleri

### Yeni Entity Ekleme

1. **Type tanımları oluştur:**

```typescript
// types/product.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  createdAt: string;
}
```

2. **Form schema ve config oluştur:**

```typescript
// config/form-configs.ts
export const productFormSchema = z.object({
  name: z.string().min(1, "Ürün adı zorunludur"),
  price: z.number().min(0, "Fiyat 0'dan büyük olmalıdır"),
  categoryId: z.string().min(1, "Kategori seçimi zorunludur"),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
```

3. **Service oluştur:**

```typescript
// services/ProductService.ts
export const productCrudOperations: CrudOperations<Product, ProductFormData> = {
  // CRUD operasyonlarını implement et
};
```

4. **Sayfada kullan:**

```typescript
// app/(authenticated)/products/page.tsx
const useProductCrud = createCrudHook(productCrudOperations);

export default function ProductsPage() {
  const { data, loading, createItem, updateItem, deleteItem } =
    useProductCrud();
  // ...
}
```

### Dynamic Options Ekleme

```typescript
// Form config'inde
{
  name: 'categoryId',
  label: 'Kategori',
  type: 'select',
  options: async () => {
    const categories = await categoryService.getAll();
    return categories.map(cat => ({
      label: cat.name,
      value: cat.id
    }));
  }
}
```

### Conditional Fields

```typescript
{
  name: 'specialField',
  label: 'Özel Alan',
  type: 'text',
  conditionalRender: (values) => values.type === 'special'
}
```

## 🎯 Avantajlar

### SOLID Principles

- **S**ingle Responsibility: Her bileşen tek sorumluluğa sahip
- **O**pen/Closed: Yeni entity'ler için genişletilebilir
- **L**iskov Substitution: Generic tipler sayesinde değiştirilebilir
- **I**nterface Segregation: Küçük, odaklanmış interface'ler
- **D**ependency Inversion: Abstraction'lara bağımlı

### DRY (Don't Repeat Yourself)

- ✅ Tek form component'i tüm entity'ler için
- ✅ Tek modal component'i
- ✅ Tek CRUD hook factory
- ✅ Paylaşılan validation logic

### Scalability

- ✅ Yeni entity'ler kolayca eklenebilir
- ✅ Form field'ları config ile yönetilebilir
- ✅ Backend API değişiklikleri sadece service'te
- ✅ UI değişiklikleri merkezi component'lerde

### Developer Experience

- ✅ Type safety her seviyede
- ✅ Otomatik form validation
- ✅ Consistent UI/UX
- ✅ Minimal boilerplate code

## 🔄 Mevcut Sistem ile Entegrasyon

Bu generic CRUD sistemi, mevcut tablo sisteminizi **değiştirmeden** üzerine eklenir:

- ✅ Mevcut `DataTable` component'i korunur
- ✅ Mevcut `table-configs.ts` korunur
- ✅ Sadece CRUD operasyonları için yeni sistem kullanılır
- ✅ Kademeli geçiş mümkün

## 📝 Sonraki Adımlar

1. **Quote Service** implementasyonu
2. **Company Service** implementasyonu
3. **Lookup tables** için generic service
4. **Bulk operations** desteği
5. **Advanced validation** rules
6. **File upload** field type
7. **Multi-step forms** desteği

Bu mimari sayesinde, yeni entity'ler eklemek artık sadece birkaç dosya oluşturmak kadar basit!
