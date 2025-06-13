export interface Quote {
  id: string;
  job_id: string;
  offering_company_id: string;
  price: number;
  currency: string;
  transit_time: number;
  valid_until: string;
  note: string;
  address: string;
  status: string;
  created_at: string;
}

export interface QuoteApiResponse {
  id: string;
  jobId: string;
  offeringCompanyId: string;
  price: number;
  currency: string;
  transitTime: number;
  validUntil: string;
  note: string;
  address: string;
  status: string;
  createdAt: string;
}

export function transformQuoteFromApi(apiQuote: QuoteApiResponse): Quote {
  return {
    id: apiQuote.id,
    job_id: apiQuote.jobId,
    offering_company_id: apiQuote.offeringCompanyId,
    price: apiQuote.price,
    currency: apiQuote.currency,
    transit_time: apiQuote.transitTime,
    valid_until: apiQuote.validUntil,
    note: apiQuote.note,
    address: apiQuote.address,
    status: apiQuote.status,
    created_at: apiQuote.createdAt,
  };
}
