import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';

interface Property {
  id: string;
  title: string;
  area: string;
  city: string;
  annualRentKobo: number;
  bedrooms: number;
  bathrooms: number;
  type: string;
  status: 'draft' | 'submitted_for_review' | 'listed' | 'paused' | 'occupied' | 'rejected';
  photos: number;
  applications: number;
  viewings: number;
}

const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: '3 Bed Flat, Admiralty Way',
    area: 'Lekki Phase 1',
    city: 'Lagos',
    annualRentKobo: 280000000,
    bedrooms: 3,
    bathrooms: 2,
    type: 'apartment',
    status: 'occupied',
    photos: 8,
    applications: 5,
    viewings: 12,
  },
  {
    id: '2',
    title: 'Modern 2 Bed, Opebi Road',
    area: 'Ikeja',
    city: 'Lagos',
    annualRentKobo: 150000000,
    bedrooms: 2,
    bathrooms: 2,
    type: 'flat',
    status: 'listed',
    photos: 6,
    applications: 3,
    viewings: 7,
  },
  {
    id: '3',
    title: 'Studio, Surulere',
    area: 'Surulere',
    city: 'Lagos',
    annualRentKobo: 90000000,
    bedrooms: 1,
    bathrooms: 1,
    type: 'studio',
    status: 'draft',
    photos: 2,
    applications: 0,
    viewings: 0,
  },
  {
    id: '4',
    title: '4 Bed Duplex, VI',
    area: 'Victoria Island',
    city: 'Lagos',
    annualRentKobo: 600000000,
    bedrooms: 4,
    bathrooms: 4,
    type: 'duplex',
    status: 'submitted_for_review',
    photos: 9,
    applications: 0,
    viewings: 0,
  },
];

const STATUS_CONFIG: Record<Property['status'], { label: string; color: string; bg: string }> = {
  draft: { label: 'Draft', color: '#9CA3AF', bg: '#F5F5F0' },
  submitted_for_review: { label: 'Under Review', color: '#F2A65A', bg: '#FEF3C7' },
  listed: { label: 'Live', color: '#1E9E5C', bg: '#D1FAE5' },
  paused: { label: 'Paused', color: '#E89B2C', bg: '#FEF3C7' },
  occupied: { label: 'Occupied', color: '#0E7C7B', bg: '#D4EDE6' },
  rejected: { label: 'Rejected', color: '#D54545', bg: '#FEE2E2' },
};

const formatNaira = (kobo: number) => {
  const n = kobo / 100;
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}k`;
  return `₦${n}`;
};

export default function LandlordProperties() {
  const [filter, setFilter] = useState<'all' | Property['status']>('all');

  const filtered = MOCK_PROPERTIES.filter((p) => filter === 'all' || p.status === filter);

  return (
    <View className="flex-1 bg-cream">
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />

      {/* Header */}
      <Animated.View entering={FadeInDown.delay(50).duration(500)} className="px-5 pb-4 pt-14">
        <View className="mb-4 flex-row items-center justify-between">
          <View>
            <Text
              style={{
                fontFamily: 'Geist_700Bold',
                color: '#1A2332',
                fontSize: 22,
                letterSpacing: -0.3,
              }}>
              My Properties
            </Text>
            <Text
              style={{
                fontFamily: 'Geist_400Regular',
                color: '#9CA3AF',
                fontSize: 13,
                marginTop: 1,
              }}>
              {MOCK_PROPERTIES.length} properties in total
            </Text>
          </View>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: 14,
              paddingVertical: 9,
              borderRadius: 12,
              backgroundColor: '#0E7C7B',
            }}>
            <Ionicons name="add" size={16} color="white" />
            <Text style={{ fontFamily: 'Geist_600SemiBold', color: 'white', fontSize: 13 }}>
              Add
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}>
          {(['all', 'listed', 'occupied', 'draft', 'submitted_for_review', 'paused'] as const).map(
            (s) => {
              const active = filter === s;
              const cfg =
                s === 'all' ? { label: 'All', color: '#0E7C7B', bg: '#D4EDE6' } : STATUS_CONFIG[s];
              return (
                <TouchableOpacity
                  key={s}
                  onPress={() => setFilter(s)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 999,
                    backgroundColor: active ? cfg.color : 'white',
                    borderWidth: 1.5,
                    borderColor: active ? cfg.color : '#E5E0D8',
                  }}>
                  <Text
                    style={{
                      fontFamily: active ? 'Geist_600SemiBold' : 'Geist_400Regular',
                      fontSize: 12,
                      color: active ? 'white' : '#6B7280',
                    }}>
                    {cfg.label}
                  </Text>
                </TouchableOpacity>
              );
            }
          )}
        </ScrollView>
      </Animated.View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30, gap: 14 }}
        showsVerticalScrollIndicator={false}>
        {filtered.map((property, i) => {
          const statusCfg = STATUS_CONFIG[property.status];
          return (
            <Animated.View key={property.id} entering={FadeInDown.delay(i * 60).duration(400)}>
              <TouchableOpacity
                style={{
                  backgroundColor: 'white',
                  borderRadius: 18,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: '#F0EBE4',
                }}
                activeOpacity={0.85}>
                {/* Top section */}
                <View style={{ padding: 16 }}>
                  <View className="mb-3 flex-row items-start justify-between">
                    <View className="flex-1 pr-3">
                      <Text
                        style={{
                          fontFamily: 'Geist_600SemiBold',
                          color: '#1A2332',
                          fontSize: 15,
                          lineHeight: 20,
                        }}>
                        {property.title}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 3,
                          marginTop: 3,
                        }}>
                        <Ionicons name="location-outline" size={12} color="#9CA3AF" />
                        <Text
                          style={{
                            fontFamily: 'Geist_400Regular',
                            color: '#9CA3AF',
                            fontSize: 12,
                          }}>
                          {property.area}, {property.city}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 999,
                        backgroundColor: statusCfg.bg,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Geist_600SemiBold',
                          color: statusCfg.color,
                          fontSize: 12,
                        }}>
                        {statusCfg.label}
                      </Text>
                    </View>
                  </View>

                  {/* Rent + specs */}
                  <View className="flex-row items-center justify-between">
                    <Text style={{ fontFamily: 'Geist_700Bold', color: '#0E7C7B', fontSize: 17 }}>
                      {formatNaira(property.annualRentKobo)}/yr
                    </Text>
                    <View className="flex-row gap-4">
                      <View className="flex-row items-center gap-1">
                        <Ionicons name="bed-outline" size={14} color="#6B7280" />
                        <Text
                          style={{ fontFamily: 'Geist_500Medium', color: '#6B7280', fontSize: 13 }}>
                          {property.bedrooms}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-1">
                        <Ionicons name="water-outline" size={14} color="#6B7280" />
                        <Text
                          style={{ fontFamily: 'Geist_500Medium', color: '#6B7280', fontSize: 13 }}>
                          {property.bathrooms}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-1">
                        <Ionicons name="images-outline" size={14} color="#6B7280" />
                        <Text
                          style={{ fontFamily: 'Geist_500Medium', color: '#6B7280', fontSize: 13 }}>
                          {property.photos}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Stats bar */}
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: '#FAF7F2',
                    borderTopWidth: 1,
                    borderTopColor: '#F0EBE4',
                  }}>
                  {[
                    {
                      label: 'Applications',
                      value: property.applications,
                      icon: 'document-text-outline' as const,
                    },
                    {
                      label: 'Viewings',
                      value: property.viewings,
                      icon: 'calendar-outline' as const,
                    },
                    {
                      label: 'Photos',
                      value: `${property.photos}/6`,
                      icon: 'images-outline' as const,
                    },
                  ].map((stat, idx) => (
                    <View
                      key={stat.label}
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        paddingVertical: 10,
                        borderRightWidth: idx < 2 ? 1 : 0,
                        borderRightColor: '#EDE8E1',
                      }}>
                      <Text style={{ fontFamily: 'Geist_700Bold', color: '#1A2332', fontSize: 15 }}>
                        {stat.value}
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Geist_400Regular',
                          color: '#9CA3AF',
                          fontSize: 10,
                          marginTop: 1,
                        }}>
                        {stat.label}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Actions */}
                {property.status === 'draft' && (
                  <View style={{ padding: 12, paddingTop: 0, paddingHorizontal: 16 }}>
                    <Button
                      size="sm"
                      style={{
                        height: 38,
                        borderRadius: 10,
                        backgroundColor: property.photos >= 6 ? '#0E7C7B' : '#D0CCC6',
                        marginTop: 10,
                      }}
                      isDisabled={property.photos < 6}>
                      <ButtonText
                        style={{ fontFamily: 'Geist_600SemiBold', color: 'white', fontSize: 13 }}>
                        {property.photos < 6
                          ? `Add ${6 - property.photos} more photos to submit`
                          : 'Submit for Review'}
                      </ButtonText>
                    </Button>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}
