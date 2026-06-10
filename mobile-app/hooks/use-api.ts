import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ApiListing {
  id: string;
  landlordId: string;
  title: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  squareFootage: number | null;
  yearBuilt: number | null;
  description: string;
  annualRent: number;       // kobo
  serviceCharge: number;
  cautionDeposit: number;
  agencyFee: number;
  acceptedPaymentFrequencies: string[] | null;
  amenities: string[];
  state: string;
  city: string;
  area: string;
  // address is stripped on feed/search endpoints
  latitude: string | null;
  longitude: string | null;
  status: string;
  isBoosted: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiListingDetail extends ApiListing {
  photos: {
    id: string;
    propertyId: string;
    url: string;
    caption: string | null;
    displayOrder: number;
    photoType: string;
    isVideoTour: boolean;
    createdAt: string;
  }[];
}

export interface FeedResponse {
  forYou: ApiListing[];
  newThisWeek: ApiListing[];
  verifiedOnly: ApiListing[];
}

export interface SearchResponse {
  data: ApiListing[];
  page: number;
  limit: number;
}

export interface TenancyResponse {
  id: string;
  tenantId: string;
  landlordId: string;
  propertyId: string;
  leaseId: string;
  startDate: string;
  endDate: string;
  annualRentKobo: number;
  status: string;
  property?: ApiListing;
  healthPercentage: number;
  daysRemaining: number;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  type: string;
  tenancyId: string;
}

export interface RentGoal {
  id: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  message: string | null;
  contributions: {
    id: string;
    amount: number;
    sponsorName: string | null;
    message: string | null;
    createdAt: string;
  }[];
}

// ─── Listing Hooks ──────────────────────────────────────────────────────────

export function useFeed() {
  return useQuery<FeedResponse>({
    queryKey: ['feed'],
    queryFn: () => apiFetch<FeedResponse>('/feed'),
  });
}

export function useSearchListings(params: {
  area?: string;
  city?: string;
  type?: string;
  bedrooms?: number;
  minRent?: number;
  maxRent?: number;
  page?: number;
  limit?: number;
  q?: string;
}) {
  const queryString = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&');

  return useQuery<SearchResponse>({
    queryKey: ['listings', params],
    queryFn: () => apiFetch<SearchResponse>(`/listings?${queryString}`),
    placeholderData: (prev) => prev,
  });
}

export function useListingDetail(id: string) {
  return useQuery<ApiListingDetail>({
    queryKey: ['listing', id],
    queryFn: () => apiFetch<ApiListingDetail>(`/listings/${id}`),
    enabled: !!id,
  });
}

export function useSavedListings() {
  return useQuery<ApiListing[]>({
    queryKey: ['savedListings'],
    queryFn: () => apiFetch<ApiListing[]>('/me/saved-listings'),
  });
}

export function useSaveListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (propertyId: string) =>
      apiFetch(`/listings/${propertyId}/save`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedListings'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useUnsaveListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (propertyId: string) =>
      apiFetch(`/listings/${propertyId}/save`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedListings'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

// ─── Tenancy Hooks ──────────────────────────────────────────────────────────

export function useCurrentTenancy() {
  return useQuery<TenancyResponse>({
    queryKey: ['tenancy', 'current'],
    queryFn: () => apiFetch<TenancyResponse>('/tenancy/current'),
  });
}

export function useTenancyPayments(tenancyId: string) {
  return useQuery<PaymentRecord[]>({
    queryKey: ['tenancy', tenancyId, 'payments'],
    queryFn: () => apiFetch<PaymentRecord[]>(`/tenancy/${tenancyId}/payments`),
    enabled: !!tenancyId,
  });
}

// ─── Payment Hooks ──────────────────────────────────────────────────────────

export function usePaymentHistory() {
  return useQuery({
    queryKey: ['payments', 'history'],
    queryFn: () => apiFetch('/payments/history'),
  });
}

export function useWallet() {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: () => apiFetch('/wallet'),
  });
}
