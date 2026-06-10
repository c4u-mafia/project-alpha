import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLandlordProperties, LandlordProperty } from '@/hooks/use-api';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  LandlordProperty['status'],
  { label: string; color: string; bg: string }
> = {
  draft: { label: 'Draft', color: '#9CA3AF', bg: '#F5F5F0' },
  submitted_for_review: { label: 'Under Review', color: '#F2A65A', bg: '#FEF3C7' },
  listed: { label: 'Live', color: '#1E9E5C', bg: '#D1FAE5' },
  paused: { label: 'Paused', color: '#E89B2C', bg: '#FEF3C7' },
  occupied: { label: 'Occupied', color: '#0E7C7B', bg: '#D4EDE6' },
  rejected: { label: 'Rejected', color: '#D54545', bg: '#FEE2E2' },
};

type FilterValue = 'all' | LandlordProperty['status'];

const formatNaira = (kobo: number) => {
  const n = kobo / 100;
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}k`;
  return `₦${n}`;
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const PropertyCardSkeleton = () => (
  <View
    style={{
      backgroundColor: 'white',
      borderRadius: 18,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#F0EBE4',
    }}>
    <View style={{ padding: 16, gap: 12 }}>
      <View
        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, gap: 8, paddingRight: 12 }}>
          <Skeleton style={{ height: 15, width: '80%', borderRadius: 6 }} />
          <Skeleton style={{ height: 12, width: '50%', borderRadius: 6 }} />
        </View>
        <Skeleton style={{ height: 26, width: 70, borderRadius: 999 }} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton style={{ height: 18, width: 80, borderRadius: 6 }} />
        <Skeleton style={{ height: 14, width: 80, borderRadius: 6 }} />
      </View>
    </View>
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#FAF7F2',
        borderTopWidth: 1,
        borderTopColor: '#F0EBE4',
      }}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={{
            flex: 1,
            alignItems: 'center',
            paddingVertical: 12,
            borderRightWidth: i < 2 ? 1 : 0,
            borderRightColor: '#EDE8E1',
          }}>
          <Skeleton style={{ height: 16, width: 30, borderRadius: 4, marginBottom: 4 }} />
          <Skeleton style={{ height: 10, width: 60, borderRadius: 4 }} />
        </View>
      ))}
    </View>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function LandlordProperties() {
  const [filter, setFilter] = useState<FilterValue>('all');
  const { data: properties, isLoading, isError, refetch } = useLandlordProperties();

  const filtered = (properties ?? []).filter((p) => filter === 'all' || p.status === filter);
  const total = properties?.length ?? 0;

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
            {!isLoading && (
              <Text
                style={{
                  fontFamily: 'Geist_400Regular',
                  color: '#9CA3AF',
                  fontSize: 13,
                  marginTop: 1,
                }}>
                {total} {total === 1 ? 'property' : 'properties'} in total
              </Text>
            )}
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
        {isLoading && (
          <>
            <PropertyCardSkeleton />
            <PropertyCardSkeleton />
            <PropertyCardSkeleton />
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
              {"Couldn't load properties"}
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
          filtered.map((property, i) => {
            const statusCfg = STATUS_CONFIG[property.status];
            const photoCount = property.photos?.length ?? 0;
            const applications = property._count?.applications ?? 0;
            const viewings = property._count?.viewingRequests ?? 0;

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

                    <View className="flex-row items-center justify-between">
                      <Text style={{ fontFamily: 'Geist_700Bold', color: '#0E7C7B', fontSize: 17 }}>
                        {formatNaira(property.annualRent)}/yr
                      </Text>
                      <View className="flex-row gap-4">
                        <View className="flex-row items-center gap-1">
                          <Ionicons name="bed-outline" size={14} color="#6B7280" />
                          <Text
                            style={{
                              fontFamily: 'Geist_500Medium',
                              color: '#6B7280',
                              fontSize: 13,
                            }}>
                            {property.bedrooms}
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                          <Ionicons name="water-outline" size={14} color="#6B7280" />
                          <Text
                            style={{
                              fontFamily: 'Geist_500Medium',
                              color: '#6B7280',
                              fontSize: 13,
                            }}>
                            {property.bathrooms}
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                          <Ionicons name="images-outline" size={14} color="#6B7280" />
                          <Text
                            style={{
                              fontFamily: 'Geist_500Medium',
                              color: '#6B7280',
                              fontSize: 13,
                            }}>
                            {photoCount}
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
                        value: applications,
                        icon: 'document-text-outline' as const,
                      },
                      { label: 'Viewings', value: viewings, icon: 'calendar-outline' as const },
                      {
                        label: 'Photos',
                        value: `${photoCount}/6`,
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
                        <Text
                          style={{ fontFamily: 'Geist_700Bold', color: '#1A2332', fontSize: 15 }}>
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

                  {/* Draft CTA */}
                  {property.status === 'draft' && (
                    <View style={{ padding: 12, paddingTop: 0, paddingHorizontal: 16 }}>
                      <Button
                        size="sm"
                        style={{
                          height: 38,
                          borderRadius: 10,
                          backgroundColor: photoCount >= 6 ? '#0E7C7B' : '#D0CCC6',
                          marginTop: 10,
                        }}
                        isDisabled={photoCount < 6}>
                        <ButtonText
                          style={{ fontFamily: 'Geist_600SemiBold', color: 'white', fontSize: 13 }}>
                          {photoCount < 6
                            ? `Add ${6 - photoCount} more photo${6 - photoCount !== 1 ? 's' : ''} to submit`
                            : 'Submit for Review'}
                        </ButtonText>
                      </Button>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}

        {!isLoading && !isError && filtered.length === 0 && !isError && (
          <View style={{ alignItems: 'center', paddingVertical: 60 }}>
            <Text style={{ fontFamily: 'Geist_600SemiBold', color: '#9CA3AF', fontSize: 15 }}>
              {filter === 'all'
                ? 'No properties yet'
                : `No ${STATUS_CONFIG[filter as LandlordProperty['status']]?.label ?? filter} properties`}
            </Text>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}
