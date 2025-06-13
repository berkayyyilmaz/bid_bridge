export interface Port {
  id: string;
  name: string;
  company_id: string;
  company_name: string;
  created_at: string;
}

export interface PortApiResponse {
  id: string;
  name: string;
  companyId: string;
  companyName: string;
  createdAt: string;
}

export function transformPortFromApi(apiPort: PortApiResponse): Port {
  return {
    id: apiPort.id,
    name: apiPort.name,
    company_id: apiPort.companyId,
    company_name: apiPort.companyName,
    created_at: apiPort.createdAt,
  };
}
