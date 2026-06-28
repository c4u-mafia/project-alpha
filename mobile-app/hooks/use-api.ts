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

export interface WalletTransaction {
  id: string;
  walletId: string;
  paymentId: string | null;
  type: 'credit' | 'debit';
  amount: number; // kobo
  balanceAfter: number;
  description: string;
  createdAt: string;
}

export interface WalletResponse {
  id: string;
  userId: string;
  balance: number; // kobo
  pendingBalance: number; // kobo
  currency: string;
  recentTransactions: WalletTransaction[];
}

export interface UserProfileFields {
  id: string;
  phone: string | null;
  phoneVerified: boolean;
  dateOfBirth: string | null;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
  city: string | null;
  ninStatus: 'not_submitted' | 'pending' | 'verified' | 'failed';
  onboardingCompleted: boolean;
}

export interface TenantRoleProfile {
  id: string;
  employerName: string | null;
  jobRole: string | null;
  monthlyIncomeRange: string | null;
  preferredBudgetMin: number | null;
  preferredBudgetMax: number | null;
  preferredAreas: string[] | null;
  preferredBedrooms: number[] | null;
  moveInTimeline: string | null;
  employmentStepCompleted: boolean;
  preferencesStepCompleted: boolean;
}

export interface LandlordRoleProfile {
  id: string;
  isCompany: boolean;
  companyName: string | null;
  isDiaspora: boolean;
  verificationStatus:
    | 'unverified'
    | 'documents_submitted'
    | 'under_review'
    | 'approved'
    | 'rejected';
  bankAccountName: string | null;
  bankAccountNumber: string | null;
  bankName: string | null;
  bankStepCompleted: boolean;
  onboardingCompleted: boolean;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: 'tenant' | 'landlord' | 'admin';
  createdAt: string;
  profile: UserProfileFields | null;
  roleProfile: TenantRoleProfile | LandlordRoleProfile | null;
}

export interface OnboardingStatus {
  role: 'tenant' | 'landlord' | string;
  steps: Record<string, boolean>;
  completed: boolean;
}

export interface UpdateProfilePayload {
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  city?: string;
}

export interface ApplicationRecord {
  id: string;
  tenantId: string;
  landlordId: string;
  propertyId: string;
  viewingRequestId: string | null;
  status: 'submitted' | 'under_review' | 'approved' | 'declined' | 'withdrawn';
  moveInDate: string;
  employmentProofUrl: string | null;
  personalMessage: string | null;
  landlordNote: string | null;
  createdAt: string;
  updatedAt: string;
  property: {
    id: string;
    title: string;
    area: string;
    city: string;
    annualRent: number;
  } | null;
}

export interface ViewingRequestRecord {
  id: string;
  tenantId: string;
  propertyId: string;
  slotId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  tenantMessage: string | null;
  addressRevealed: boolean;
  landlordRating: number | null;
  tenantRating: number | null;
  createdAt: string;
  scheduledFor: string | null; // ISO date+time built from slot.date + slot.startTime
  property: {
    id: string;
    title: string;
    area: string;
    city: string;
  } | null;
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  readAt: string | null;
  sentAt: string | null;
  createdAt: string;
}

export interface NotificationsResponse {
  data: NotificationItem[];
  page: number;
  limit: number;
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

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      apiFetch('/me/profile', { method: 'PATCH', body: JSON.stringify(payload) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['onboardingStatus'] });
    },
  });
}

export function useOnboardingStatus() {
  return useQuery<OnboardingStatus>({
    queryKey: ['onboardingStatus'],
    queryFn: () => apiFetch<OnboardingStatus>('/me/onboarding-status'),
  });
}

// ─── Notification Hooks ──────────────────────────────────────────────────────

export function useNotifications(page = 1, limit = 10) {
  return useQuery<NotificationsResponse>({
    queryKey: ['notifications', page],
    queryFn: () => apiFetch<NotificationsResponse>(`/notifications?page=${page}&limit=${limit}`),
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch(`/notifications/${id}/read`, { method: 'PATCH' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiFetch(`/notifications/read-all`, { method: 'PATCH' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

// ─── Tenant Applications & Viewings ─────────────────────────────────────────

export function useMyApplications() {
  return useQuery<ApplicationRecord[]>({
    queryKey: ['applications', 'mine'],
    queryFn: () => apiFetch<ApplicationRecord[]>('/applications/mine'),
  });
}

export function useMyViewings() {
  return useQuery<ViewingRequestRecord[]>({
    queryKey: ['viewings', 'mine'],
    queryFn: () => apiFetch<ViewingRequestRecord[]>('/viewings/mine'),
  });
}

export function useCancelViewing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch(`/viewings/${id}/cancel`, { method: 'PATCH' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['viewings'] }),
  });
}

// ─── Payment History (typed) ────────────────────────────────────────────────

export interface PaymentHistoryItem {
  id: string;
  amount: number; // kobo
  status: string;
  type: string;
  description?: string | null;
  reference?: string | null;
  createdAt: string;
}

export interface PaymentHistoryResponse {
  data: PaymentHistoryItem[];
  total: number;
  page: number;
  limit: number;
}

export function useTypedPaymentHistory(page = 1, limit = 20) {
  return useQuery<PaymentHistoryResponse>({
    queryKey: ['payments', 'history', page],
    queryFn: () =>
      apiFetch<PaymentHistoryResponse>(`/payments/history?page=${page}&limit=${limit}`),
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

export function useLandlordApplications() {
  return useQuery<ApplicationRecord[]>({
    queryKey: ['landlord', 'applications'],
    queryFn: () => apiFetch<ApplicationRecord[]>('/landlord/applications'),
  });
}

export function useLandlordViewingRequests() {
  return useQuery<ViewingRequestRecord[]>({
    queryKey: ['landlord', 'viewing-requests'],
    queryFn: () => apiFetch<ViewingRequestRecord[]>('/landlord/viewing-requests'),
  });
}
