import React from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar, FlatList } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { ListingCard } from '@/components/listing-card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useFeed,
  useSavedListings,
  useSaveListing,
  useUnsaveListing,
  useCurrentUser,
  apiListingToCard,
  ApiListing,
} from '@/hooks/use-api';

// ─── Skeleton ────────────────────────────────────────────────────────────────

const ListingCardSkeleton = ({ compact = false }: { compact?: boolean }) => (
  <View
    style={{
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: 'white',
      width: compact ? 200 : '100%',
    }}>
    <Skeleton style={{ height: compact ? 130 : 180, width: '100%', borderRadius: 0 }} />
    <View style={{ padding: 14, gap: 10 }}>
      <Skeleton style={{ height: 15, width: '75%', borderRadius: 6 }} />
      <Skeleton style={{ height: 12, width: '50%', borderRadius: 6 }} />
      <Skeleton style={{ height: 18, width: '40%', borderRadius: 6 }} />
    </View>
  </View>
);

const SectionSkeleton = () => (
  <View style={{ marginBottom: 24 }}>
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 12,
      }}>
      <Skeleton style={{ height: 18, width: 120, borderRadius: 6 }} />
      <Skeleton style={{ height: 14, width: 50, borderRadius: 6 }} />
    </View>
    <View style={{ paddingHorizontal: 20, gap: 16 }}>
      <ListingCardSkeleton />
      <ListingCardSkeleton />
    </View>
  </View>
);

// ─── Error State ─────────────────────────────────────────────────────────────

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
    <Ionicons name="cloud-offline-outline" size={48} color="#C0BBC4" />
    <Text
      style={{
        fontFamily: 'Geist_600SemiBold',
        color: '#1A2332',
        fontSize: 16,
        marginTop: 16,
        textAlign: 'center',
      }}>
      Failed to load feed
    </Text>
    <TouchableOpacity
      onPress={onRetry}
      style={{
        marginTop: 16,
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#0E7C7B',
      }}>
      <Text style={{ fontFamily: 'Geist_600SemiBold', color: 'white', fontSize: 14 }}>
        Try again
      </Text>
    </TouchableOpacity>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function TenantHome() {
  const { data: feed, isLoading, isError, refetch } = useFeed();
  const { data: savedListings } = useSavedListings();
  const { data: user } = useCurrentUser();
  const saveMutation = useSaveListing();
  const unsaveMutation = useUnsaveListing();

  const savedIds = savedListings?.map((l) => l.id) ?? [];

  const toggleSave = (id: string) => {
    if (savedIds.includes(id)) {
      unsaveMutation.mutate(id);
    } else {
      saveMutation.mutate(id);
    }
  };

  const toCard = (l: ApiListing) => apiListingToCard(l, savedIds);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const sections = feed
    ? [
        { key: 'forYou', label: 'For You', items: feed.forYou },
        { key: 'newThisWeek', label: 'New This Week', items: feed.newThisWeek },
        { key: 'verifiedOnly', label: 'Verified Only', items: feed.verifiedOnly },
      ]
    : [];

  return (
    <View className="flex-1 bg-cream">
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(50).duration(500)} className="px-5 pb-4 pt-14">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm text-charcoal/40" style={{ fontFamily: 'Geist_400Regular' }}>
                {greeting} {user?.name ? `👋` : ''}
              </Text>
              <Text
                className="mt-0.5 text-[22px] leading-7 text-charcoal"
                style={{ fontFamily: 'Geist_700Bold', letterSpacing: -0.3 }}>
                {user?.name ? `Hi, ${user.name.split(' ')[0]}` : 'Find your home'}
              </Text>
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: '#F0EBE4',
                }}>
                <Ionicons name="notifications-outline" size={20} color="#1A2332" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <TouchableOpacity
            onPress={() => router.push('/(tenant)/search')}
            style={{
              marginTop: 16,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              backgroundColor: 'white',
              borderRadius: 14,
              paddingHorizontal: 16,
              height: 48,
              borderWidth: 1,
              borderColor: '#F0EBE4',
            }}>
            <Ionicons name="search-outline" size={18} color="#9CA3AF" />
            <Text
              className="flex-1 text-[15px] text-charcoal/30"
              style={{ fontFamily: 'Geist_400Regular' }}>
              Search by area, city or type...
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Feed */}
        {isLoading && (
          <>
            <SectionSkeleton />
            <SectionSkeleton />
            <SectionSkeleton />
          </>
        )}

        {isError && <ErrorState onRetry={refetch} />}

        {!isLoading &&
          !isError &&
          sections.map((section, sIdx) => {
            if (section.items.length === 0) return null;
            return (
              <Animated.View
                key={section.key}
                entering={FadeInDown.delay(100 + sIdx * 80).duration(500)}
                className="mb-6">
                <View className="mb-3 flex-row items-center justify-between px-5">
                  <Text
                    className="text-[17px] text-charcoal"
                    style={{ fontFamily: 'Geist_700Bold' }}>
                    {section.label}
                  </Text>
                  <TouchableOpacity>
                    <Text
                      className="text-sm text-[#0E7C7B]"
                      style={{ fontFamily: 'Geist_600SemiBold' }}>
                      See all
                    </Text>
                  </TouchableOpacity>
                </View>

                {section.key === 'forYou' ? (
                  <View className="gap-4 px-5">
                    {section.items.map((listing) => (
                      <ListingCard
                        key={listing.id}
                        listing={toCard(listing)}
                        onSave={() => toggleSave(listing.id)}
                      />
                    ))}
                  </View>
                ) : (
                  <FlatList
                    data={section.items}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
                    renderItem={({ item }) => (
                      <ListingCard
                        listing={toCard(item)}
                        onSave={() => toggleSave(item.id)}
                        variant="compact"
                      />
                    )}
                  />
                )}
              </Animated.View>
            );
          })}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}
