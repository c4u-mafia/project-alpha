import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './ui/text';

export interface Listing {
  id: string;
  title: string;
  area: string;
  city: string;
  annualRentKobo: number;
  bedrooms: number;
  bathrooms: number;
  type: string;
  photos: string[];
  isVerified: boolean;
  landlordName: string;
  isSaved?: boolean;
}

interface Props {
  listing: Listing;
  onPress?: () => void;
  onSave?: () => void;
  variant?: 'default' | 'compact';
}

const formatRent = (kobo: number) => {
  const naira = kobo / 100;
  if (naira >= 1_000_000) return `₦${(naira / 1_000_000).toFixed(1)}m`;
  if (naira >= 1_000) return `₦${(naira / 1_000).toFixed(0)}k`;
  return `₦${naira.toLocaleString()}`;
};

export const ListingCard = ({ listing, onPress, onSave, variant = 'default' }: Props) => {
  const isCompact = variant === 'compact';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: 'white',
        shadowColor: '#1A2332',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 3,
        width: isCompact ? 200 : '100%',
      }}
    >
      {/* Image */}
      <View style={{ height: isCompact ? 130 : 180, backgroundColor: '#E5E0D8' }}>
        {listing.photos[0] ? (
          <Image
            source={{ uri: listing.photos[0] }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="home-outline" size={40} color="#C0BBC4" />
          </View>
        )}

        {/* Overlays */}
        <View style={{ position: 'absolute', top: 10, left: 10, right: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {listing.isVerified && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, backgroundColor: '#0E7C7B' }}>
              <Ionicons name="shield-checkmark" size={11} color="white" />
              <Text style={{ fontFamily: 'Geist_600SemiBold', color: 'white', fontSize: 10 }}>
                Verified
              </Text>
            </View>
          )}
          <TouchableOpacity
            onPress={onSave}
            style={{
              marginLeft: 'auto',
              width: 32,
              height: 32,
              borderRadius: 999,
              backgroundColor: 'rgba(0,0,0,0.35)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name={listing.isSaved ? 'heart' : 'heart-outline'}
              size={16}
              color={listing.isSaved ? '#F2A65A' : 'white'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Info */}
      <View style={{ padding: 14 }}>
        <Text
          numberOfLines={1}
          style={{ fontFamily: 'Geist_600SemiBold', color: '#1A2332', fontSize: 15, marginBottom: 2 }}
        >
          {listing.title}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 10 }}>
          <Ionicons name="location-outline" size={12} color="#9CA3AF" />
          <Text style={{ fontFamily: 'Geist_400Regular', color: '#9CA3AF', fontSize: 12 }}>
            {listing.area}, {listing.city}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontFamily: 'Geist_700Bold', color: '#0E7C7B', fontSize: 17 }}>
              {formatRent(listing.annualRentKobo)}
            </Text>
            <Text style={{ fontFamily: 'Geist_400Regular', color: '#9CA3AF', fontSize: 11 }}>
              per year
            </Text>
          </View>

          {!isCompact && (
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <Ionicons name="bed-outline" size={14} color="#6B7280" />
                <Text style={{ fontFamily: 'Geist_500Medium', color: '#6B7280', fontSize: 12 }}>
                  {listing.bedrooms}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <Ionicons name="water-outline" size={14} color="#6B7280" />
                <Text style={{ fontFamily: 'Geist_500Medium', color: '#6B7280', fontSize: 12 }}>
                  {listing.bathrooms}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
