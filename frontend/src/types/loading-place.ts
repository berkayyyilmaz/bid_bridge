export interface LoadingPlace {
  id: string;
  name: string;
  company_id: string;
  company_name: string;
  created_at: string;
}

export interface LoadingPlaceApiResponse {
  id: string;
  name: string;
  companyId: string;
  companyName: string;
  createdAt: string;
}

export function transformLoadingPlaceFromApi(
  apiLoadingPlace: LoadingPlaceApiResponse
): LoadingPlace {
  return {
    id: apiLoadingPlace.id,
    name: apiLoadingPlace.name,
    company_id: apiLoadingPlace.companyId,
    company_name: apiLoadingPlace.companyName,
    created_at: apiLoadingPlace.createdAt,
  };
}
