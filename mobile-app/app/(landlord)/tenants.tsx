import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import { RentHealthBar } from '@/components/rent-health-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { useLandlordTenants } from '@/hooks/use-api';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatNaira = (kobo: number) => `₦${(kobo / 100).toLocaleString('en-NG')}`;

function getHealthColor(pct: number) {
  if (pct > 50) return '#1E9E5C';
  if (pct > 25) return '#E89B2C';
  if (pct > 10) return '#E2683C';
  return '#D54545';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const TenantCardSkeleton = () => (
  <View
    style={{
      backgroundColor: 'white',
      borderRadius: 18,
      padding: 18,
      borderWidth: 1,
      borderColor: '#F0EBE4',
      gap: 16,
    }}>
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
      <Skeleton style={{ width: 44, height: 44, borderRadius: 14 }} />
      <View style={{ flex: 1, gap: 8 }}>
        <Skeleton style={{ height: 15, width: '60%', borderRadius: 6 }} />
        <Skeleton style={{ height: 12, width: '80%', borderRadius: 6 }} />
      </View>
    </View>
    <Skeleton style={{ height: 10, width: '100%', borderRadius: 5 }} />
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Skeleton style={{ height: 18, width: 60, borderRadius: 6 }} />
      <Skeleton style={{ height: 18, width: 80, borderRadius: 6 }} />
      <Skeleton style={{ height: 18, width: 70, borderRadius: 6 }} />
    </View>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function LandlordTenants() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: tenants, isLoading, isError, refetch } = useLandlordTenants();

  const total = tenants?.length ?? 0;

  return (
    <View className="flex-1 bg-cream">
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />

      {/* Header */}
      <Animated.View entering={FadeInDown.delay(50).duration(500)} className="px-5 pb-5 pt-14">
        <Text
          style={{
            fontFamily: 'Geist_700Bold',
            color: '#1A2332',
            fontSize: 22,
            letterSpacing: -0.3,
          }}>
          My Tenants
        </Text>
        {!isLoading && (
          <Text
            style={{
              fontFamily: 'Geist_400Regular',
              color: '#9CA3AF',
              fontSize: 13,
              marginTop: 1,
            }}>
            {total} active {total === 1 ? 'tenancy' : 'tenancies'}
          </Text>
        )}
      </Animated.View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30, gap: 14 }}
        showsVerticalScrollIndicator={false}>
        {isLoading && (
          <>
            <TenantCardSkeleton />
            <TenantCardSkeleton />
            <TenantCardSkeleton />
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
              {"Couldn't load tenants"}
            </Text>
            <TouchableOpacity onPress={() => refetch()} style={{ marginTop: 12 }}>
              <Text style={{ fontFamily: 'Geist_600SemiBold', color: '#0E7C7B', fontSize: 14 }}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {!isLoading && !isError && total === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 60 }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                backgroundColor: '#F0FAF9',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}>
              <Ionicons name="people-outline" size={32} color="#0E7C7B" />
            </View>
            <Text
              style={{
                fontFamily: 'Geist_600SemiBold',
                color: '#1A2332',
                fontSize: 16,
                textAlign: 'center',
              }}>
              No tenants yet
            </Text>
            <Text
              style={{
                fontFamily: 'Geist_400Regular',
                color: '#9CA3AF',
                fontSize: 13,
                textAlign: 'center',
                marginTop: 6,
                lineHeight: 20,
              }}>
              Tenants will appear here once a lease is signed and activated.
            </Text>
          </View>
        )}

        {!isLoading &&
          !isError &&
          (tenants ?? []).map((tenant, i) => {
            const color = getHealthColor(tenant.healthPercentage);
            const isSelected = selectedId === tenant.tenancyId;

            return (
              <Animated.View
                key={tenant.tenancyId}
                entering={FadeInDown.delay(i * 80).duration(400)}>
                <TouchableOpacity
                  onPress={() => setSelectedId(isSelected ? null : tenant.tenancyId)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 18,
                    padding: 18,
                    borderWidth: 1,
                    borderColor: isSelected ? '#0E7C7B' : '#F0EBE4',
                  }}
                  activeOpacity={0.85}>
                  {/* Top row */}
                  <View className="mb-4 flex-row items-start gap-3">
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        backgroundColor: '#F0FAF9',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text style={{ fontFamily: 'Geist_700Bold', color: '#0E7C7B', fontSize: 18 }}>
                        {tenant.tenant.name[0]?.toUpperCase() ?? '?'}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between">
                        <Text
                          style={{
                            fontFamily: 'Geist_600SemiBold',
                            color: '#1A2332',
                            fontSize: 15,
                          }}>
                          {tenant.tenant.name}
                        </Text>
                        {tenant.paymentStatus === 'overdue' && (
                          <View
                            style={{
                              paddingHorizontal: 8,
                              paddingVertical: 4,
                              borderRadius: 999,
                              backgroundColor: '#FEE2E2',
                            }}>
                            <Text
                              style={{
                                fontFamily: 'Geist_600SemiBold',
                                color: '#D54545',
                                fontSize: 11,
                              }}>
                              Overdue
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text
                        style={{
                          fontFamily: 'Geist_400Regular',
                          color: '#9CA3AF',
                          fontSize: 12,
                          marginTop: 2,
                        }}>
                        {tenant.property.title}
                      </Text>
                    </View>
                  </View>

                  {/* Rent Health Bar */}
                  <RentHealthBar percentage={tenant.healthPercentage} height={10} />

                  {/* Stats */}
                  <View className="mt-4 flex-row justify-between">
                    <View>
                      <Text
                        style={{ fontFamily: 'Geist_400Regular', color: '#9CA3AF', fontSize: 11 }}>
                        Days remaining
                      </Text>
                      <Text
                        style={{ fontFamily: 'Geist_700Bold', color, fontSize: 18, marginTop: 1 }}>
                        {tenant.daysRemaining}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{ fontFamily: 'Geist_400Regular', color: '#9CA3AF', fontSize: 11 }}>
                        Annual rent
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Geist_700Bold',
                          color: '#1A2332',
                          fontSize: 15,
                          marginTop: 1,
                        }}>
                        {formatNaira(tenant.annualRentKobo)}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{ fontFamily: 'Geist_400Regular', color: '#9CA3AF', fontSize: 11 }}>
                        Expires
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Geist_500Medium',
                          color: '#1A2332',
                          fontSize: 13,
                          marginTop: 1,
                        }}>
                        {formatDate(tenant.endDate)}
                      </Text>
                    </View>
                  </View>

                  {/* Expanded detail */}
                  {isSelected && (
                    <Animated.View
                      entering={FadeInDown.duration(300)}
                      style={{
                        marginTop: 16,
                        paddingTop: 16,
                        borderTopWidth: 1,
                        borderTopColor: '#F0EBE4',
                      }}>
                      <View className="flex-row gap-3">
                        <TouchableOpacity
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            height: 40,
                            borderRadius: 10,
                            backgroundColor: '#F0FAF9',
                            borderWidth: 1,
                            borderColor: '#D4EDE6',
                          }}>
                          <Ionicons name="mail-outline" size={16} color="#0E7C7B" />
                          <Text
                            style={{
                              fontFamily: 'Geist_600SemiBold',
                              color: '#0E7C7B',
                              fontSize: 13,
                            }}>
                            Message
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            height: 40,
                            borderRadius: 10,
                            backgroundColor: '#1A2332',
                          }}>
                          <Ionicons name="document-text-outline" size={16} color="white" />
                          <Text
                            style={{
                              fontFamily: 'Geist_600SemiBold',
                              color: 'white',
                              fontSize: 13,
                            }}>
                            Lease
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </Animated.View>
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
