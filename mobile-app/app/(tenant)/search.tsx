import React, { useState, useCallback, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, StatusBar, Modal } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import { ListingCard } from '@/components/listing-card';
import { Button, ButtonText } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useSearchListings,
  useSavedListings,
  useSaveListing,
  useUnsaveListing,
  apiListingToCard,
  ApiListing,
} from '@/hooks/use-api';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SearchCardSkeleton = () => (
  <View style={{ borderRadius: 16, overflow: 'hidden', backgroundColor: 'white' }}>
    <Skeleton style={{ height: 180, width: '100%', borderRadius: 0 }} />
    <View style={{ padding: 14, gap: 10 }}>
      <Skeleton style={{ height: 15, width: '75%', borderRadius: 6 }} />
      <Skeleton style={{ height: 12, width: '50%', borderRadius: 6 }} />
      <Skeleton style={{ height: 18, width: '40%', borderRadius: 6 }} />
    </View>
  </View>
);

// ─── Filter chip → API param mapping ─────────────────────────────────────────

type FilterChip = 'All' | 'Verified' | 'Apartments' | 'Flats' | '1 Bed' | '2 Beds' | '3+ Beds';
const FILTER_CHIPS: FilterChip[] = [
  'All',
  'Verified',
  'Apartments',
  'Flats',
  '1 Bed',
  '2 Beds',
  '3+ Beds',
];

function chipToParams(chip: FilterChip): { type?: string; bedrooms?: number } {
  switch (chip) {
    case 'Apartments':
      return { type: 'apartment' };
    case 'Flats':
      return { type: 'flat' };
    case '1 Bed':
      return { bedrooms: 1 };
    case '2 Beds':
      return { bedrooms: 2 };
    case '3+ Beds':
      return { bedrooms: 3 };
    default:
      return {};
  }
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function TenantSearch() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterChip>('All');
  const [showModal, setShowModal] = useState(false);
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');

  const filterParams = chipToParams(activeFilter);
  const { data, isLoading, isError, refetch } = useSearchListings({
    q: query || undefined,
    minRent: minRent ? Number(minRent) : undefined,
    maxRent: maxRent ? Number(maxRent) : undefined,
    ...filterParams,
    limit: 30,
  });

  const { data: savedListings } = useSavedListings();
  const saveMutation = useSaveListing();
  const unsaveMutation = useUnsaveListing();

  const savedIds = useMemo(() => savedListings?.map((l) => l.id) ?? [], [savedListings]);
  const toCard = useCallback((l: ApiListing) => apiListingToCard(l, savedIds), [savedIds]);

  const toggleSave = (id: string) => {
    if (savedIds.includes(id)) {
      unsaveMutation.mutate(id);
    } else {
      saveMutation.mutate(id);
    }
  };

  const listings = data?.data ?? [];

  return (
    <View className="flex-1 bg-cream">
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />

      {/* Search Header */}
      <View className="px-5 pb-3 pt-14">
        <Text
          className="mb-4 text-[20px] text-charcoal"
          style={{ fontFamily: 'Geist_700Bold', letterSpacing: -0.3 }}>
          Search Homes
        </Text>

        <View className="flex-row gap-2">
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: 'white',
              borderRadius: 12,
              paddingHorizontal: 14,
              height: 46,
              borderWidth: 1,
              borderColor: '#F0EBE4',
            }}>
            <Ionicons name="search-outline" size={18} color="#9CA3AF" />
            <TextInput
              placeholder="Area, city, or type..."
              value={query}
              onChangeText={setQuery}
              style={{ flex: 1, fontFamily: 'Geist_400Regular', fontSize: 14, color: '#1A2332' }}
              placeholderTextColor="#C0BBC4"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={18} color="#C0BBC4" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={() => setShowModal(true)}
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              backgroundColor: '#0E7C7B',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name="options-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 12, gap: 8 }}>
          {FILTER_CHIPS.map((chip) => {
            const active = activeFilter === chip;
            return (
              <TouchableOpacity
                key={chip}
                onPress={() => setActiveFilter(chip)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                  borderRadius: 999,
                  backgroundColor: active ? '#0E7C7B' : 'white',
                  borderWidth: 1.5,
                  borderColor: active ? '#0E7C7B' : '#E5E0D8',
                }}>
                <Text
                  style={{
                    fontFamily: active ? 'Geist_600SemiBold' : 'Geist_400Regular',
                    fontSize: 13,
                    color: active ? 'white' : '#6B7280',
                  }}>
                  {chip}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Results */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30, gap: 14 }}
        showsVerticalScrollIndicator={false}>
        {!isLoading && !isError && (
          <Text className="mb-1 text-sm text-charcoal/40" style={{ fontFamily: 'Geist_500Medium' }}>
            {listings.length} home{listings.length !== 1 ? 's' : ''} found
          </Text>
        )}

        {isLoading && (
          <>
            <SearchCardSkeleton />
            <SearchCardSkeleton />
            <SearchCardSkeleton />
            <SearchCardSkeleton />
          </>
        )}

        {isError && (
          <View className="items-center py-16">
            <Ionicons name="cloud-offline-outline" size={40} color="#C0BBC4" />
            <Text
              className="mt-3 text-center text-base text-charcoal"
              style={{ fontFamily: 'Geist_600SemiBold' }}>
              Search unavailable
            </Text>
            <TouchableOpacity onPress={() => refetch()} style={{ marginTop: 12 }}>
              <Text style={{ fontFamily: 'Geist_600SemiBold', color: '#0E7C7B', fontSize: 14 }}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {!isLoading &&
          !isError &&
          listings.map((listing, i) => (
            <Animated.View key={listing.id} entering={FadeInDown.delay(i * 40).duration(400)}>
              <ListingCard listing={toCard(listing)} onSave={() => toggleSave(listing.id)} />
            </Animated.View>
          ))}

        {!isLoading && !isError && listings.length === 0 && (
          <View className="items-center py-16">
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🔍</Text>
            <Text
              className="text-center text-lg text-charcoal"
              style={{ fontFamily: 'Geist_600SemiBold' }}>
              No results found
            </Text>
            <Text
              className="mt-2 text-center text-sm text-charcoal/40"
              style={{ fontFamily: 'Geist_400Regular' }}>
              Try adjusting your filters or search term
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <View
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              paddingBottom: 40,
            }}>
            <View className="mb-6 flex-row items-center justify-between">
              <Text className="text-lg text-charcoal" style={{ fontFamily: 'Geist_700Bold' }}>
                Filters
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="#1A2332" />
              </TouchableOpacity>
            </View>

            <Text
              className="mb-3 text-xs font-bold uppercase tracking-wider text-charcoal/60"
              style={{ fontFamily: 'Geist_600SemiBold' }}>
              Budget Range (Annual ₦)
            </Text>
            <View className="mb-6 flex-row gap-3">
              <TextInput
                placeholder="Min (e.g. 500000)"
                value={minRent}
                onChangeText={setMinRent}
                keyboardType="number-pad"
                style={{
                  flex: 1,
                  height: 46,
                  borderRadius: 10,
                  borderWidth: 1.5,
                  borderColor: '#E5E0D8',
                  backgroundColor: '#FAF7F2',
                  paddingHorizontal: 12,
                  fontFamily: 'Geist_400Regular',
                  fontSize: 13,
                  color: '#1A2332',
                }}
                placeholderTextColor="#C0BBC4"
              />
              <TextInput
                placeholder="Max (e.g. 5000000)"
                value={maxRent}
                onChangeText={setMaxRent}
                keyboardType="number-pad"
                style={{
                  flex: 1,
                  height: 46,
                  borderRadius: 10,
                  borderWidth: 1.5,
                  borderColor: '#E5E0D8',
                  backgroundColor: '#FAF7F2',
                  paddingHorizontal: 12,
                  fontFamily: 'Geist_400Regular',
                  fontSize: 13,
                  color: '#1A2332',
                }}
                placeholderTextColor="#C0BBC4"
              />
            </View>

            <Button
              size="lg"
              onPress={() => setShowModal(false)}
              style={{ height: 50, borderRadius: 12, backgroundColor: '#0E7C7B' }}>
              <ButtonText className="text-base text-white" style={{ fontFamily: 'Geist_700Bold' }}>
                Apply Filters
              </ButtonText>
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}
