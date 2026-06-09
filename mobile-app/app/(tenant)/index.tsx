import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar, FlatList } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { ListingCard, Listing } from '@/components/listing-card';

const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    title: '3 Bedroom Apartment, Admiralty Way',
    area: 'Lekki Phase 1',
    city: 'Lagos',
    annualRentKobo: 280000000,
    bedrooms: 3,
    bathrooms: 2,
    type: 'apartment',
    photos: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600'],
    isVerified: true,
    landlordName: 'Mr. Adeyemi',
  },
  {
    id: '2',
    title: 'Modern 2 Bed Flat, Opebi',
    area: 'Ikeja',
    city: 'Lagos',
    annualRentKobo: 150000000,
    bedrooms: 2,
    bathrooms: 2,
    type: 'flat',
    photos: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600'],
    isVerified: true,
    landlordName: 'Mrs. Nwosu',
  },
  {
    id: '3',
    title: 'Self-Contained Studio, GRA',
    area: 'GRA Phase 2',
    city: 'Port Harcourt',
    annualRentKobo: 72000000,
    bedrooms: 1,
    bathrooms: 1,
    type: 'studio',
    photos: [],
    isVerified: false,
    landlordName: 'Mr. Chukwu',
  },
  {
    id: '4',
    title: 'Luxury 4 Bed Duplex, VI',
    area: 'Victoria Island',
    city: 'Lagos',
    annualRentKobo: 600000000,
    bedrooms: 4,
    bathrooms: 4,
    type: 'duplex',
    photos: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600'],
    isVerified: true,
    landlordName: 'Prestige Properties',
  },
  {
    id: '5',
    title: '2 Bedroom Flat, Yaba',
    area: 'Yaba',
    city: 'Lagos',
    annualRentKobo: 110000000,
    bedrooms: 2,
    bathrooms: 1,
    type: 'flat',
    photos: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600'],
    isVerified: true,
    landlordName: 'Mr. Obi',
  },
];

const SECTIONS = [
  { key: 'forYou', label: 'For You', items: MOCK_LISTINGS.slice(0, 3) },
  { key: 'newThisWeek', label: 'New This Week', items: MOCK_LISTINGS.slice(1, 4) },
  { key: 'verifiedOnly', label: 'Verified Only', items: MOCK_LISTINGS.filter((l) => l.isVerified) },
];

export default function TenantHome() {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const toggleSave = (id: string) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <View className="flex-1 bg-cream">
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(50).duration(500)} className="px-5 pb-4 pt-14">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm text-charcoal/40" style={{ fontFamily: 'Geist_400Regular' }}>
                Good morning 👋
              </Text>
              <Text
                className="mt-0.5 text-[22px] leading-7 text-charcoal"
                style={{ fontFamily: 'Geist_700Bold', letterSpacing: -0.3 }}>
                Find your home
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

        {/* Sections */}
        {SECTIONS.map((section, sIdx) => (
          <Animated.View
            key={section.key}
            entering={FadeInDown.delay(100 + sIdx * 80).duration(500)}
            className="mb-6">
            <View className="mb-3 flex-row items-center justify-between px-5">
              <Text className="text-[17px] text-charcoal" style={{ fontFamily: 'Geist_700Bold' }}>
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
              /* Full-width cards for "For You" */
              <View className="gap-4 px-5">
                {section.items.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={{ ...listing, isSaved: savedIds.includes(listing.id) }}
                    onSave={() => toggleSave(listing.id)}
                  />
                ))}
              </View>
            ) : (
              /* Horizontal scroll for other sections */
              <FlatList
                data={section.items}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
                renderItem={({ item }) => (
                  <ListingCard
                    listing={{ ...item, isSaved: savedIds.includes(item.id) }}
                    onSave={() => toggleSave(item.id)}
                    variant="compact"
                  />
                )}
              />
            )}
          </Animated.View>
        ))}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}
