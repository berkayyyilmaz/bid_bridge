import { Company, CompanyApiResponse } from "./company";
import { Job, JobApiResponse } from "./job";
import { Quote, QuoteApiResponse } from "./quote";

export function transformCompanyFromApi(api: CompanyApiResponse): Company {
  return {
    id: api.id,
    name: api.name,
    created_at: api.createdAt,
    updated_at: api.updatedAt,
  };
}

export function transformJobFromApi(api: JobApiResponse): Job {
  return {
    id: api.id,
    title: api.title,
    incoterm_id: api.incotermId,
    incoterm_name: api.incotermName,
    shipping_method_id: api.shippingMethodId,
    shipping_method_name: api.shippingMethodName,
    loading_place_id: api.loadingPlaceId,
    loading_place_name: api.loadingPlaceName,
    port_id: api.portId,
    port_name: api.portName,
    loading_date: api.loadingDate,
    loading_style_id: api.loadingStyleId,
    loading_style_name: api.loadingStyleName,
    estimated_annual_tonnage: api.estimatedAnnualTonnage,
    address: api.address,
    note: api.note,
    owner_company_id: api.ownerCompanyId,
    owner_company_name: api.ownerCompanyName,
    created_at: api.createdAt,
  };
}

export function transformQuoteFromApi(api: QuoteApiResponse): Quote {
  return {
    id: api.id,
    job_id: api.jobId,
    offering_company_id: api.offeringCompanyId,
    price: api.price,
    currency: api.currency,
    transit_time: api.transitTime,
    valid_until: api.validUntil,
    note: api.note,
    address: api.address,
    status: api.status,
    created_at: api.createdAt,
  };
}
