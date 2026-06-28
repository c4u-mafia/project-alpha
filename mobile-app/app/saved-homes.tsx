import React from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { ListingCard } from '@/components/listing-card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useSavedListings,
  useUnsaveListing,
  apiListingToCard,
} from '@/hooks/use-api';

export default function SavedHomes() {
  const { data, isLoading, isError, refetch } = useSavedListings();
  const unsave = useUnsaveListing();

  const listings = data ?? [];
  const savedIds = listings.map((l) => l.id);

  return (
    <View style={{ flex: 1, backgroundColor: '#FAF7F2' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />

      {/* Header */}
      <View
        style={{
          paddingTop: 56,
          paddingHorizontal: 20,
          paddingBottom: 14,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
        }}>
        <TouchableOpacity
          onPress={() => router.back()}
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
          <Ionicons name="arrow-back" size={20} color="#1A2332" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: 'Geist_700Bold',
              color: '#1A2332',
              fontSize: 22,
              letterSpacing: -0.3,
            }}>
            Saved Homes
          </Text>
          {!isLoading && (
            <Text
              style={{
                fontFamily: 'Geist_400Regular',
                color: '#9CA3AF',
                fontSize: 13,
                marginTop: 1,
              }}>
              {listings.length} {listings.length === 1 ? 'listing' : 'listings'} saved
            </Text>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 14 }}
        showsVerticalScrollIndicator={false}>
        {isLoading && (
          <>
            <Skeleton style={{ height: 280, borderRadius: 16 }} />
            <Skeleton style={{ height: 280, borderRadius: 16 }} />
          </>
        )}

        {isError && (
          <View style={{ alignItems: 'center', paddingVertical: 60 }}>
            <Ionicons name="cloud-offline-outline" size={40} color="#C0BBC4" />
            <Text
              style={{
                fontFamily: 'Geist_600SemiBold',
                color: '#1A2332',
                fontSize: 16,
                marginTop: 12,
              }}>
              {"Couldn't load saved homes"}
            </Text>
            <TouchableOpacity onPress={() => refetch()} style={{ marginTop: 12 }}>
              <Text style={{ fontFamily: 'Geist_600SemiBold', color: '#0E7C7B', fontSize: 14 }}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {!isLoading && !isError && listings.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 60 }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                backgroundColor: '#F0FAF9',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}>
              <Ionicons name="heart-outline" size={36} color="#0E7C7B" />
            </View>
            <Text
              style={{
                fontFamily: 'Geist_700Bold',
                color: '#1A2332',
                fontSize: 18,
                textAlign: 'center',
              }}>
              No saved homes yet
            </Text>
            <Text
              style={{
                fontFamily: 'Geist_400Regular',
                color: '#9CA3AF',
                fontSize: 14,
                textAlign: 'center',
                marginTop: 8,
                paddingHorizontal: 40,
                lineHeight: 20,
              }}>
              Tap the heart icon on any listing to keep track of it here.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(tenant)/search')}
              style={{
                marginTop: 20,
                paddingHorizontal: 22,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: '#0E7C7B',
              }}>
              <Text style={{ fontFamily: 'Geist_600SemiBold', color: 'white', fontSize: 14 }}>
                Browse listings
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {!isLoading &&
          !isError &&
          listings.map((listing, i) => (
            <Animated.View
              key={listing.id}
              entering={FadeInDown.delay(i * 50).duration(400)}>
              <ListingCard
                listing={apiListingToCard(listing, savedIds)}
                onPress={() => router.push(`/property/${listing.id}` as never)}
                onSave={() => unsave.mutate(listing.id)}
              />
            </Animated.View>
          ))}
      </ScrollView>
    </View>
  );
}
