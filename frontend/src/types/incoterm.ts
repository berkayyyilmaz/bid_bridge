export interface Incoterm {
  id: string;
  name: string;
  company_id: string;
  company_name: string;
  created_at: string;
}

export interface IncotermApiResponse {
  id: string;
  name: string;
  companyId: string;
  companyName: string;
  createdAt: string;
}

export function transformIncotermFromApi(
  apiIncoterm: IncotermApiResponse
): Incoterm {
  return {
    id: apiIncoterm.id,
    name: apiIncoterm.name,
    company_id: apiIncoterm.companyId,
    company_name: apiIncoterm.companyName,
    created_at: apiIncoterm.createdAt,
  };
}
