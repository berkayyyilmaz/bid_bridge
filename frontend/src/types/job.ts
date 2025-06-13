export interface Job {
  id: string;
  title: string;
  incoterm_id: string;
  incoterm_name: string;
  shipping_method_id: string;
  shipping_method_name: string;
  loading_place_id: string;
  loading_place_name: string;
  port_id: string;
  port_name: string;
  loading_date: string;
  loading_style_id: string;
  loading_style_name: string;
  estimated_annual_tonnage: string;
  address: string;
  note: string;
  owner_company_id: string;
  owner_company_name: string;
  created_at: string;
}

export interface JobApiResponse {
  id: string;
  title: string;
  incotermId: string;
  incotermName: string;
  shippingMethodId: string;
  shippingMethodName: string;
  loadingPlaceId: string;
  loadingPlaceName: string;
  portId: string;
  portName: string;
  loadingDate: string;
  loadingStyleId: string;
  loadingStyleName: string;
  estimatedAnnualTonnage: string;
  address: string;
  note: string;
  ownerCompanyId: string;
  ownerCompanyName: string;
  createdAt: string;
}

export function transformJobFromApi(apiJob: JobApiResponse): Job {
  return {
    id: apiJob.id,
    title: apiJob.title,
    incoterm_id: apiJob.incotermId,
    incoterm_name: apiJob.incotermName,
    shipping_method_id: apiJob.shippingMethodId,
    shipping_method_name: apiJob.shippingMethodName,
    loading_place_id: apiJob.loadingPlaceId,
    loading_place_name: apiJob.loadingPlaceName,
    port_id: apiJob.portId,
    port_name: apiJob.portName,
    loading_date: apiJob.loadingDate,
    loading_style_id: apiJob.loadingStyleId,
    loading_style_name: apiJob.loadingStyleName,
    estimated_annual_tonnage: apiJob.estimatedAnnualTonnage,
    address: apiJob.address,
    note: apiJob.note,
    owner_company_id: apiJob.ownerCompanyId,
    owner_company_name: apiJob.ownerCompanyName,
    created_at: apiJob.createdAt,
  };
}
