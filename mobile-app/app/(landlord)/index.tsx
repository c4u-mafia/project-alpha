import React from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import { RentHealthBar } from '@/components/rent-health-bar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useCurrentUser,
  useLandlordTenants,
  useLandlordProperties,
  useWallet,
  useNotifications,
} from '@/hooks/use-api';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatNaira = (n: number) => `₦${(n / 100).toLocaleString('en-NG')}`;

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const NOTIF_ICON: Record<
  string,
  {
    icon:
      | 'document-text-outline'
      | 'card-outline'
      | 'calendar-outline'
      | 'checkmark-circle-outline';
    color: string;
  }
> = {
  application_submitted: { icon: 'document-text-outline', color: '#0E7C7B' },
  payment_received: { icon: 'card-outline', color: '#1E9E5C' },
  viewing_booked: { icon: 'calendar-outline', color: '#F2A65A' },
  viewing_confirmed: { icon: 'calendar-outline', color: '#F2A65A' },
  tenancy_created: { icon: 'checkmark-circle-outline', color: '#0E7C7B' },
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const DashboardSkeleton = () => (
  <>
    {/* Header skeleton */}
    <View
      style={{
        backgroundColor: '#0E7C7B',
        paddingTop: 60,
        paddingBottom: 28,
        paddingHorizontal: 24,
        gap: 16,
      }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ gap: 6 }}>
          <Skeleton
            style={{
              height: 13,
              width: 100,
              borderRadius: 6,
              backgroundColor: 'rgba(255,255,255,0.2)',
            }}
          />
          <Skeleton
            style={{
              height: 22,
              width: 160,
              borderRadius: 8,
              backgroundColor: 'rgba(255,255,255,0.2)',
            }}
          />
        </View>
        <Skeleton
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: 'rgba(255,255,255,0.2)',
          }}
        />
      </View>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
        {[0, 1, 2].map((i) => (
          <Skeleton
            key={i}
            style={{
              flex: 1,
              height: 70,
              borderRadius: 14,
              backgroundColor: 'rgba(255,255,255,0.2)',
            }}
          />
        ))}
      </View>
    </View>
    <View style={{ gap: 16, paddingHorizontal: 20, paddingTop: 20 }}>
      <Skeleton style={{ height: 88, borderRadius: 20 }} />
      <View style={{ gap: 12 }}>
        <Skeleton style={{ height: 18, width: 160, borderRadius: 6 }} />
        <Skeleton style={{ height: 80, borderRadius: 16 }} />
        <Skeleton style={{ height: 80, borderRadius: 16 }} />
      </View>
      <View style={{ gap: 12 }}>
        <Skeleton style={{ height: 18, width: 140, borderRadius: 6 }} />
        <Skeleton style={{ height: 160, borderRadius: 16 }} />
      </View>
    </View>
  </>
);

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function LandlordDashboard() {
  const { data: user, isLoading: loadingUser } = useCurrentUser();
  const { data: properties, isLoading: loadingProps } = useLandlordProperties();
  const { data: tenants, isLoading: loadingTenants } = useLandlordTenants();
  const { data: wallet, isLoading: loadingWallet } = useWallet();
  const { data: notifs } = useNotifications(1, 5);

  const isLoading = loadingUser || loadingProps || loadingTenants || loadingWallet;

  const totalProperties = properties?.length ?? 0;
  const activeListings = properties?.filter((p) => p.status === 'listed').length ?? 0;
  const pendingApplications = 0; // TODO: from applications endpoint when available

  const expiringTenants = (tenants ?? [])
    .filter((t) => t.daysRemaining <= 90)
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, 5);

  const recentActivity = (notifs?.data ?? []).slice(0, 5);

  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <View className="flex-1 bg-cream">
      <StatusBar barStyle="light-content" backgroundColor="#0E7C7B" />

      {isLoading ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <DashboardSkeleton />
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animated.View
            entering={FadeInDown.delay(50).duration(500)}
            style={{
              backgroundColor: '#0E7C7B',
              paddingTop: 60,
              paddingBottom: 28,
              paddingHorizontal: 24,
            }}>
            <View className="flex-row items-center justify-between">
              <View>
                <Text
                  style={{
                    fontFamily: 'Geist_400Regular',
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: 13,
                  }}>
                  Good morning 👋
                </Text>
                <Text
                  style={{
                    fontFamily: 'Geist_700Bold',
                    color: 'white',
                    fontSize: 22,
                    marginTop: 2,
                    letterSpacing: -0.3,
                  }}>
                  {firstName}
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Ionicons name="notifications-outline" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Stats Row */}
            <View style={{ marginTop: 20, flexDirection: 'row', gap: 10 }}>
              {[
                { label: 'Properties', value: totalProperties, icon: 'business-outline' as const },
                { label: 'Listings', value: activeListings, icon: 'home-outline' as const },
                {
                  label: 'Applications',
                  value: pendingApplications,
                  icon: 'document-text-outline' as const,
                },
              ].map((stat) => (
                <View
                  key={stat.label}
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(255,255,255,0.12)',
                    borderRadius: 14,
                    padding: 14,
                    alignItems: 'center',
                  }}>
                  <Text style={{ fontFamily: 'Geist_700Bold', color: 'white', fontSize: 24 }}>
                    {stat.value}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Geist_400Regular',
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: 11,
                      marginTop: 2,
                    }}>
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>

          <View className="gap-5 px-5 py-5">
            {/* Wallet */}
            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
              <View
                style={{
                  backgroundColor: '#1A2332',
                  borderRadius: 20,
                  padding: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text
                    style={{
                      fontFamily: 'Geist_400Regular',
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: 12,
                    }}>
                    Wallet Balance
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Geist_700Bold',
                      color: 'white',
                      fontSize: 26,
                      marginTop: 4,
                    }}>
                    {wallet ? formatNaira(wallet.balance) : '—'}
                  </Text>
                  {wallet && wallet.pendingBalance > 0 && (
                    <Text
                      style={{
                        fontFamily: 'Geist_400Regular',
                        color: '#F2A65A',
                        fontSize: 12,
                        marginTop: 4,
                      }}>
                      +{formatNaira(wallet.pendingBalance)} pending release
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 12,
                    backgroundColor: '#F2A65A',
                  }}>
                  <Text style={{ fontFamily: 'Geist_700Bold', color: 'white', fontSize: 13 }}>
                    Withdraw
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Expiring Tenancies */}
            {expiringTenants.length > 0 && (
              <Animated.View entering={FadeInDown.delay(160).duration(500)}>
                <View className="mb-3 flex-row items-center justify-between">
                  <Text style={{ fontFamily: 'Geist_700Bold', color: '#1A2332', fontSize: 16 }}>
                    Expiring Tenancies
                  </Text>
                  <TouchableOpacity>
                    <Text
                      style={{ fontFamily: 'Geist_600SemiBold', color: '#0E7C7B', fontSize: 13 }}>
                      See all
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="gap-3">
                  {expiringTenants.map((tenant) => {
                    return (
                      <View
                        key={tenant.tenancyId}
                        style={{
                          backgroundColor: 'white',
                          borderRadius: 16,
                          padding: 16,
                          borderWidth: 1,
                          borderColor: '#F0EBE4',
                        }}>
                        <View className="mb-3 flex-row items-start justify-between">
                          <View className="flex-1 pr-3">
                            <Text
                              style={{
                                fontFamily: 'Geist_600SemiBold',
                                color: '#1A2332',
                                fontSize: 14,
                              }}>
                              {tenant.tenant.name}
                            </Text>
                            <Text
                              style={{
                                fontFamily: 'Geist_400Regular',
                                color: '#9CA3AF',
                                fontSize: 12,
                                marginTop: 1,
                              }}>
                              {tenant.property.title}
                            </Text>
                          </View>
                          <View
                            style={{
                              paddingHorizontal: 8,
                              paddingVertical: 4,
                              borderRadius: 999,
                              backgroundColor:
                                tenant.daysRemaining <= 14
                                  ? '#FEE2E2'
                                  : tenant.daysRemaining <= 30
                                    ? '#FFE4D4'
                                    : '#F0FAF9',
                            }}>
                            <Text
                              style={{
                                fontFamily: 'Geist_600SemiBold',
                                fontSize: 12,
                                color:
                                  tenant.daysRemaining <= 14
                                    ? '#D54545'
                                    : tenant.daysRemaining <= 30
                                      ? '#E2683C'
                                      : '#0E7C7B',
                              }}>
                              {tenant.daysRemaining}d left
                            </Text>
                          </View>
                        </View>
                        <RentHealthBar
                          percentage={tenant.healthPercentage}
                          showLabel={false}
                          showPercentage={false}
                          height={8}
                          compact
                        />
                      </View>
                    );
                  })}
                </View>
              </Animated.View>
            )}

            {/* Recent Activity */}
            {recentActivity.length > 0 && (
              <Animated.View entering={FadeInDown.delay(220).duration(500)}>
                <Text
                  style={{
                    fontFamily: 'Geist_700Bold',
                    color: '#1A2332',
                    fontSize: 16,
                    marginBottom: 12,
                  }}>
                  Recent Activity
                </Text>
                <View
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: '#F0EBE4',
                    overflow: 'hidden',
                  }}>
                  {recentActivity.map((item, i) => {
                    const cfg = NOTIF_ICON[item.type] ?? {
                      icon: 'checkmark-circle-outline' as const,
                      color: '#0E7C7B',
                    };
                    return (
                      <View
                        key={item.id}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 12,
                          padding: 14,
                          borderTopWidth: i > 0 ? 1 : 0,
                          borderTopColor: '#F5F0EC',
                        }}>
                        <View
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 10,
                            backgroundColor: `${cfg.color}15`,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Ionicons name={cfg.icon} size={18} color={cfg.color} />
                        </View>
                        <View className="flex-1">
                          <Text
                            style={{
                              fontFamily: 'Geist_500Medium',
                              color: '#1A2332',
                              fontSize: 13,
                            }}>
                            {item.title}
                          </Text>
                          <Text
                            style={{
                              fontFamily: 'Geist_400Regular',
                              color: '#9CA3AF',
                              fontSize: 12,
                              marginTop: 1,
                            }}>
                            {item.message}
                          </Text>
                        </View>
                        <Text
                          style={{
                            fontFamily: 'Geist_400Regular',
                            color: '#C0BBC4',
                            fontSize: 11,
                          }}>
                          {timeAgo(item.createdAt)}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </Animated.View>
            )}

            {/* Empty state when no tenants and no activity */}
            {expiringTenants.length === 0 && recentActivity.length === 0 && (
              <Animated.View entering={FadeInDown.delay(160).duration(500)}>
                <View style={{ alignItems: 'center', paddingVertical: 40 }}>
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
                    <Ionicons name="business-outline" size={32} color="#0E7C7B" />
                  </View>
                  <Text
                    style={{
                      fontFamily: 'Geist_600SemiBold',
                      color: '#1A2332',
                      fontSize: 16,
                      textAlign: 'center',
                    }}>
                    All quiet
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
                    Add a property to get started
                  </Text>
                </View>
              </Animated.View>
            )}

            <View style={{ height: 20 }} />
          </View>
        </ScrollView>
      )}
    </View>
  );
}
