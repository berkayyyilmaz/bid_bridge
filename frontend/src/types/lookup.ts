// Base Lookup Interface
export interface BaseLookup {
  id: string;
  name: string;
  createdAt: string;
}

// Incoterm
export interface Incoterm extends BaseLookup {
  companyId?: string;
  companyName?: string;
}

export interface IncotermApiResponse {
  id: string;
  name: string;
  companyId?: string;
  companyName?: string;
  createdAt: string;
}

// Shipping Method
export interface ShippingMethod extends BaseLookup {
  companyId?: string;
  companyName?: string;
}

export interface ShippingMethodApiResponse {
  id: string;
  name: string;
  companyId?: string;
  companyName?: string;
  createdAt: string;
}

// Port
export interface Port extends BaseLookup {
  companyId?: string;
  companyName?: string;
}

export interface PortApiResponse {
  id: string;
  name: string;
  companyId?: string;
  companyName?: string;
  createdAt: string;
}

// Loading Place
export interface LoadingPlace extends BaseLookup {
  companyId?: string;
  companyName?: string;
}

export interface LoadingPlaceApiResponse {
  id: string;
  name: string;
  companyId?: string;
  companyName?: string;
  createdAt: string;
}

// Loading Style
export interface LoadingStyle extends BaseLookup {
  companyId?: string;
  companyName?: string;
}

export interface LoadingStyleApiResponse {
  id: string;
  name: string;
  companyId?: string;
  companyName?: string;
  createdAt: string;
}

// Company (güncellenmiş)
export interface Company {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyApiResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Quote (güncellenmiş - backend entity'sine uygun)
export interface Quote {
  id: string;
  jobId: string;
  jobTitle?: string;
  offeringCompanyId: string;
  offeringCompanyName?: string;
  price: number;
  currency: string;
  transitTime: number;
  validUntil: string;
  note?: string;
  address?: string;
  status: string;
  createdAt: string;
}

export interface QuoteApiResponse {
  id: string;
  jobId: string;
  jobTitle?: string;
  offeringCompanyId: string;
  offeringCompanyName?: string;
  price: number;
  currency: string;
  transitTime: number;
  validUntil: string;
  note?: string;
  address?: string;
  status: string;
  createdAt: string;
}

// Transform functions
export function transformIncotermFromApi(
  apiIncoterm: IncotermApiResponse
): Incoterm {
  return {
    id: apiIncoterm.id,
    name: apiIncoterm.name,
    companyId: apiIncoterm.companyId,
    companyName: apiIncoterm.companyName,
    createdAt: apiIncoterm.createdAt,
  };
}

export function transformShippingMethodFromApi(
  apiShippingMethod: ShippingMethodApiResponse
): ShippingMethod {
  return {
    id: apiShippingMethod.id,
    name: apiShippingMethod.name,
    companyId: apiShippingMethod.companyId,
    companyName: apiShippingMethod.companyName,
    createdAt: apiShippingMethod.createdAt,
  };
}

export function transformPortFromApi(apiPort: PortApiResponse): Port {
  return {
    id: apiPort.id,
    name: apiPort.name,
    companyId: apiPort.companyId,
    companyName: apiPort.companyName,
    createdAt: apiPort.createdAt,
  };
}

export function transformLoadingPlaceFromApi(
  apiLoadingPlace: LoadingPlaceApiResponse
): LoadingPlace {
  return {
    id: apiLoadingPlace.id,
    name: apiLoadingPlace.name,
    companyId: apiLoadingPlace.companyId,
    companyName: apiLoadingPlace.companyName,
    createdAt: apiLoadingPlace.createdAt,
  };
}

export function transformLoadingStyleFromApi(
  apiLoadingStyle: LoadingStyleApiResponse
): LoadingStyle {
  return {
    id: apiLoadingStyle.id,
    name: apiLoadingStyle.name,
    companyId: apiLoadingStyle.companyId,
    companyName: apiLoadingStyle.companyName,
    createdAt: apiLoadingStyle.createdAt,
  };
}

export function transformCompanyFromApi(
  apiCompany: CompanyApiResponse
): Company {
  return {
    id: apiCompany.id,
    name: apiCompany.name,
    createdAt: apiCompany.createdAt,
    updatedAt: apiCompany.updatedAt,
  };
}

export function transformQuoteFromApi(apiQuote: QuoteApiResponse): Quote {
  return {
    id: apiQuote.id,
    jobId: apiQuote.jobId,
    jobTitle: apiQuote.jobTitle,
    offeringCompanyId: apiQuote.offeringCompanyId,
    offeringCompanyName: apiQuote.offeringCompanyName,
    price: apiQuote.price,
    currency: apiQuote.currency,
    transitTime: apiQuote.transitTime,
    validUntil: apiQuote.validUntil,
    note: apiQuote.note,
    address: apiQuote.address,
    status: apiQuote.status,
    createdAt: apiQuote.createdAt,
  };
}
