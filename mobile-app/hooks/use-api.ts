import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { Listing } from '@/components/listing-card';

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
  annualRent: number; // kobo
  serviceCharge: number;
  cautionDeposit: number;
  agencyFee: number;
  acceptedPaymentFrequencies: string[] | null;
  amenities: string[];
  state: string;
  city: string;
  area: string;
  latitude: string | null;
  longitude: string | null;
  status: string;
  isBoosted: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  // Included in feed/search responses for display
  photos?: { url: string; displayOrder: number }[];
  landlord?: { name: string; verificationStatus?: string };
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
  property?: ApiListing & { title: string };
  healthPercentage: number;
  daysRemaining: number;
  landlord?: { name: string };
}

export interface PaymentRecord {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  type: string;
  tenancyId: string;
  description?: string;
}

export interface RentGoal {
  id: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  message: string | null;
  status: string;
  token: string;
  contributions: {
    id: string;
    amount: number;
    sponsorName: string | null;
    message: string | null;
    isAnonymous: boolean;
    createdAt: string;
  }[];
}

export interface LandlordProperty {
  id: string;
  title: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  city: string;
  state: string;
  annualRent: number; // kobo
  status: 'draft' | 'submitted_for_review' | 'listed' | 'paused' | 'occupied' | 'rejected';
  publishedAt: string | null;
  createdAt: string;
  photos: { id: string; url: string; displayOrder: number }[];
  _count?: {
    applications: number;
    viewingRequests: number;
  };
}

export interface LandlordTenantView {
  tenancyId: string;
  tenant: {
    id: string;
    name: string;
    email: string;
  };
  property: {
    id: string;
    title: string;
    area: string;
    city: string;
  };
  startDate: string;
  endDate: string;
  annualRentKobo: number;
  healthPercentage: number;
  daysRemaining: number;
  status: string;
  paymentStatus?: 'up_to_date' | 'overdue' | 'pending';
}

export interface WalletResponse {
  balance: number;
  pendingBalance: number;
  recentTransactions: {
    id: string;
    amount: number;
    type: string;
    description?: string;
    createdAt: string;
  }[];
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  profile?: {
    phone?: string;
    ninStatus?: string;
    city?: string;
    gender?: string;
  };
  landlordProfile?: {
    verificationStatus: string;
  };
  tenantProfile?: {
    ninStatus: string;
  };
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  data: NotificationItem[];
  total: number;
  page: number;
}

// ─── Adapter ────────────────────────────────────────────────────────────────

export function apiListingToCard(
  l: ApiListing,
  savedIds: string[] = []
): Listing & { isSaved: boolean } {
  return {
    id: l.id,
    title: l.title,
    area: l.area,
    city: l.city,
    annualRentKobo: l.annualRent,
    bedrooms: l.bedrooms,
    bathrooms: l.bathrooms,
    type: l.type,
    photos: l.photos?.map((p) => p.url) ?? [],
    isVerified: l.landlord?.verificationStatus === 'approved',
    landlordName: l.landlord?.name ?? '',
    isSaved: savedIds.includes(l.id),
  };
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
  return useQuery<TenancyResponse | null>({
    queryKey: ['tenancy', 'current'],
    queryFn: () =>
      apiFetch<TenancyResponse>('/tenancy/current').catch((e: Error) => {
        if (e.message.includes('404')) return null;
        throw e;
      }),
  });
}

export function useTenancyPayments(tenancyId: string) {
  return useQuery<PaymentRecord[]>({
    queryKey: ['tenancy', tenancyId, 'payments'],
    queryFn: () => apiFetch<PaymentRecord[]>(`/tenancy/${tenancyId}/payments`),
    enabled: !!tenancyId,
  });
}

// ─── Payment / Wallet Hooks ──────────────────────────────────────────────────

export function usePaymentHistory() {
  return useQuery({
    queryKey: ['payments', 'history'],
    queryFn: () => apiFetch('/payments/history'),
  });
}

export function useWallet() {
  return useQuery<WalletResponse>({
    queryKey: ['wallet'],
    queryFn: () => apiFetch<WalletResponse>('/wallet'),
  });
}

// ─── Sponsorship Hooks ───────────────────────────────────────────────────────

export function useSponsorshipGoals() {
  return useQuery<RentGoal[]>({
    queryKey: ['sponsorships', 'goals', 'mine'],
    queryFn: () => apiFetch<RentGoal[]>('/sponsorships/goals/mine'),
  });
}

// ─── User Hooks ──────────────────────────────────────────────────────────────

export function useCurrentUser() {
  return useQuery<CurrentUser>({
    queryKey: ['me'],
    queryFn: () => apiFetch<CurrentUser>('/me'),
  });
}

// ─── Notification Hooks ──────────────────────────────────────────────────────

export function useNotifications(page = 1, limit = 10) {
  return useQuery<NotificationsResponse>({
    queryKey: ['notifications', page],
    queryFn: () => apiFetch<NotificationsResponse>(`/notifications?page=${page}&limit=${limit}`),
  });
}

// ─── Landlord Hooks ──────────────────────────────────────────────────────────

export function useLandlordProperties() {
  return useQuery<LandlordProperty[]>({
    queryKey: ['landlord', 'properties'],
    queryFn: () => apiFetch<LandlordProperty[]>('/properties'),
  });
}

export function useLandlordTenants() {
  return useQuery<LandlordTenantView[]>({
    queryKey: ['landlord', 'tenants'],
    queryFn: () => apiFetch<LandlordTenantView[]>('/landlord/tenants'),
  });
}
