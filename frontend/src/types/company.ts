export interface Company {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// API response için interface (backend'den dönen format)
export interface CompanyApiResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Backend'den frontend'e dönüştürme utility
export function transformCompanyFromApi(
  apiCompany: CompanyApiResponse
): Company {
  return {
    id: apiCompany.id,
    name: apiCompany.name,
    created_at: apiCompany.createdAt,
    updated_at: apiCompany.updatedAt,
  };
}
