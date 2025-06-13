export interface ShippingMethod {
  id: string;
  name: string;
  company_id: string;
  company_name: string;
  created_at: string;
}

export interface ShippingMethodApiResponse {
  id: string;
  name: string;
  companyId: string;
  companyName: string;
  createdAt: string;
}

export function transformShippingMethodFromApi(
  apiShippingMethod: ShippingMethodApiResponse
): ShippingMethod {
  return {
    id: apiShippingMethod.id,
    name: apiShippingMethod.name,
    company_id: apiShippingMethod.companyId,
    company_name: apiShippingMethod.companyName,
    created_at: apiShippingMethod.createdAt,
  };
}
