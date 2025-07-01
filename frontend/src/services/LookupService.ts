import { CrudOperations } from "@/hooks/useCrudOperations";
import {
  Incoterm,
  ShippingMethod,
  Port,
  LoadingPlace,
  LoadingStyle,
  Company,
  Quote,
  transformIncotermFromApi,
  transformShippingMethodFromApi,
  transformPortFromApi,
  transformLoadingPlaceFromApi,
  transformLoadingStyleFromApi,
  transformCompanyFromApi,
  transformQuoteFromApi,
} from "@/types/lookup";
import {
  IncotermFormData,
  ShippingMethodFormData,
  PortFormData,
  LoadingPlaceFormData,
  LoadingStyleFormData,
  CompanyFormData,
  QuoteFormData,
} from "@/config/lookup-form-configs";
import backendApiService from "@/lib/services/backendApiService";

// Company ID'sini al - şimdilik sabit, sonra user profile'dan gelecek
function getCurrentCompanyId(): string {
  // TODO: Gerçek kullanıcı company ID'sini user profile'dan al
  // Bu fonksiyon ileride user context'ten veya auth service'ten çağrılacak
  return "f0960931-19bd-4a42-88a0-d42e051c053a";
}

// Generic Lookup Service Factory (for reference data)
function createLookupService<T, TFormData>(
  endpoint: string,
  transformFn: (apiData: any) => T
): CrudOperations<T, TFormData, Partial<TFormData>> {
  return {
    async getAll(): Promise<T[]> {
      const apiData = await backendApiService.get<any[]>(`/${endpoint}`);
      return apiData.map(transformFn);
    },

    async getById(id: string): Promise<T> {
      const apiData = await backendApiService.get<any>(`/${endpoint}/${id}`);
      return transformFn(apiData);
    },

    async create(data: TFormData): Promise<T> {
      // Company ID'sini otomatik olarak ekle
      const dataWithCompanyId = {
        ...data,
        companyId: getCurrentCompanyId(),
      };
      console.log("Lookup service - sending data:", dataWithCompanyId);
      console.log("Endpoint:", `/${endpoint}`);
      const apiData = await backendApiService.post<any>(
        `/${endpoint}`,
        dataWithCompanyId
      );
      return transformFn(apiData);
    },

    async update(id: string, data: Partial<TFormData>): Promise<T> {
      // Update'de de company ID'sini ekle
      const dataWithCompanyId = {
        ...data,
        companyId: getCurrentCompanyId(),
      };
      const apiData = await backendApiService.put<any>(
        `/${endpoint}/${id}`,
        dataWithCompanyId
      );
      return transformFn(apiData);
    },

    async delete(id: string): Promise<void> {
      await backendApiService.delete(`/${endpoint}/${id}`);
    },
  };
}

// Simple CRUD Service Factory (for entities that don't need companyId)
function createSimpleCrudService<T, TFormData>(
  endpoint: string,
  transformFn: (apiData: any) => T
): CrudOperations<T, TFormData, Partial<TFormData>> {
  return {
    async getAll(): Promise<T[]> {
      const apiData = await backendApiService.get<any[]>(`/${endpoint}`);
      return apiData.map(transformFn);
    },

    async getById(id: string): Promise<T> {
      const apiData = await backendApiService.get<any>(`/${endpoint}/${id}`);
      return transformFn(apiData);
    },

    async create(data: TFormData): Promise<T> {
      const apiData = await backendApiService.post<any>(`/${endpoint}`, data);
      return transformFn(apiData);
    },

    async update(id: string, data: Partial<TFormData>): Promise<T> {
      const apiData = await backendApiService.put<any>(
        `/${endpoint}/${id}`,
        data
      );
      return transformFn(apiData);
    },

    async delete(id: string): Promise<void> {
      await backendApiService.delete(`/${endpoint}/${id}`);
    },
  };
}

// Incoterm Service
export const incotermCrudOperations = createLookupService<
  Incoterm,
  IncotermFormData
>("incoterms", transformIncotermFromApi);

// Shipping Method Service
export const shippingMethodCrudOperations = createLookupService<
  ShippingMethod,
  ShippingMethodFormData
>("shipping-methods", transformShippingMethodFromApi);

// Port Service
export const portCrudOperations = createLookupService<Port, PortFormData>(
  "ports",
  transformPortFromApi
);

// Loading Place Service
export const loadingPlaceCrudOperations = createLookupService<
  LoadingPlace,
  LoadingPlaceFormData
>("loading-places", transformLoadingPlaceFromApi);

// Loading Style Service
export const loadingStyleCrudOperations = createLookupService<
  LoadingStyle,
  LoadingStyleFormData
>("loading-styles", transformLoadingStyleFromApi);

// Company Service (doesn't need companyId)
export const companyCrudOperations = createSimpleCrudService<
  Company,
  CompanyFormData
>("companies", transformCompanyFromApi);

// Quote Service (has its own structure)
export const quoteCrudOperations = createSimpleCrudService<
  Quote,
  QuoteFormData
>("quotes", transformQuoteFromApi);

// Helper function to get options for dropdowns
export async function getIncotermOptions() {
  console.log("Getting incoterm options...");
  const incoterms = await incotermCrudOperations.getAll();
  console.log("Fetched incoterms:", incoterms);
  const options = incoterms.map((item) => ({
    label: item.name,
    value: item.id,
  }));
  console.log("Incoterm options:", options);
  return options;
}

export async function getShippingMethodOptions() {
  console.log("Getting shipping method options...");
  const shippingMethods = await shippingMethodCrudOperations.getAll();
  console.log("Fetched shipping methods:", shippingMethods);
  const options = shippingMethods.map((item) => ({
    label: item.name,
    value: item.id,
  }));
  console.log("Shipping method options:", options);
  return options;
}

export async function getPortOptions() {
  console.log("Getting port options...");
  const ports = await portCrudOperations.getAll();
  console.log("Fetched ports:", ports);
  const options = ports.map((item) => ({
    label: item.name,
    value: item.id,
  }));
  console.log("Port options:", options);
  return options;
}

export async function getLoadingPlaceOptions() {
  console.log("Getting loading place options...");
  const loadingPlaces = await loadingPlaceCrudOperations.getAll();
  console.log("Fetched loading places:", loadingPlaces);
  const options = loadingPlaces.map((item) => ({
    label: item.name,
    value: item.id,
  }));
  console.log("Loading place options:", options);
  return options;
}

export async function getLoadingStyleOptions() {
  console.log("Getting loading style options...");
  const loadingStyles = await loadingStyleCrudOperations.getAll();
  console.log("Fetched loading styles:", loadingStyles);
  const options = loadingStyles.map((item) => ({
    label: item.name,
    value: item.id,
  }));
  console.log("Loading style options:", options);
  return options;
}

export async function getCompanyOptions() {
  const companies = await companyCrudOperations.getAll();
  return companies.map((item) => ({
    label: item.name,
    value: item.id,
  }));
}

export async function getJobOptions() {
  // Jobs'ları backend'den çek
  const jobs = await backendApiService.getJobs();
  return jobs.map((job) => ({
    label: job.title,
    value: job.id,
  }));
}
