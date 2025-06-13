export interface LoadingStyle {
  id: string;
  name: string;
  company_id: string;
  company_name: string;
  created_at: string;
}

export interface LoadingStyleApiResponse {
  id: string;
  name: string;
  companyId: string;
  companyName: string;
  createdAt: string;
}

export function transformLoadingStyleFromApi(
  apiLoadingStyle: LoadingStyleApiResponse
): LoadingStyle {
  return {
    id: apiLoadingStyle.id,
    name: apiLoadingStyle.name,
    company_id: apiLoadingStyle.companyId,
    company_name: apiLoadingStyle.companyName,
    created_at: apiLoadingStyle.createdAt,
  };
}
