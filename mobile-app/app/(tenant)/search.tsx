import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, StatusBar, Modal } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import { ListingCard, Listing } from '@/components/listing-card';
import { Button, ButtonText } from '@/components/ui/button';

const ALL_LISTINGS: Listing[] = [
  {
    id: '1',
    title: '3 Bed Apartment, Admiralty Way',
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
    title: 'Studio, GRA Phase 2',
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
  {
    id: '6',
    title: '1 Bed Serviced Apartment',
    area: 'Lekki Phase 2',
    city: 'Lagos',
    annualRentKobo: 180000000,
    bedrooms: 1,
    bathrooms: 1,
    type: 'apartment',
    photos: [],
    isVerified: false,
    landlordName: 'Lagos Homes',
  },
];

const FILTER_CHIPS = ['All', 'Verified', 'Apartments', 'Flats', '1 Bed', '2 Beds', '3+ Beds'];

export default function TenantSearch() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const toggleSave = (id: string) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const filteredListings = ALL_LISTINGS.filter((l) => {
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      l.title.toLowerCase().includes(q) ||
      l.area.toLowerCase().includes(q) ||
      l.city.toLowerCase().includes(q);
    const matchesVerified = activeFilter !== 'Verified' || l.isVerified;
    const matchesType =
      !['Apartments', 'Flats'].includes(activeFilter) ||
      (activeFilter === 'Apartments' && l.type === 'apartment') ||
      (activeFilter === 'Flats' && l.type === 'flat');
    const matchesBed =
      !['1 Bed', '2 Beds', '3+ Beds'].includes(activeFilter) ||
      (activeFilter === '1 Bed' && l.bedrooms === 1) ||
      (activeFilter === '2 Beds' && l.bedrooms === 2) ||
      (activeFilter === '3+ Beds' && l.bedrooms >= 3);
    return matchesQuery && matchesVerified && matchesType && matchesBed;
  });

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
        <Text className="mb-1 text-sm text-charcoal/40" style={{ fontFamily: 'Geist_500Medium' }}>
          {filteredListings.length} homes found
        </Text>

        {filteredListings.map((listing, i) => (
          <Animated.View key={listing.id} entering={FadeInDown.delay(i * 50).duration(400)}>
            <ListingCard
              listing={{ ...listing, isSaved: savedIds.includes(listing.id) }}
              onSave={() => toggleSave(listing.id)}
            />
          </Animated.View>
        ))}

        {filteredListings.length === 0 && (
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
