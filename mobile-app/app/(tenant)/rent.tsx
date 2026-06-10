import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import { RentHealthBar } from '@/components/rent-health-bar';
import { Button, ButtonText } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentTenancy, useTenancyPayments, useSponsorshipGoals } from '@/hooks/use-api';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatNaira = (kobo: number) => `₦${(kobo / 100).toLocaleString('en-NG')}`;

function getHealthColor(pct: number) {
  if (pct > 50) return '#1E9E5C';
  if (pct > 25) return '#E89B2C';
  if (pct > 10) return '#E2683C';
  return '#D54545';
}

function getHealthLabel(pct: number) {
  if (pct > 50) return 'Healthy';
  if (pct > 25) return 'Notice Soon';
  if (pct > 10) return 'Due Soon';
  return 'Critical';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const RentSkeleton = () => (
  <View style={{ padding: 20, gap: 16 }}>
    <Skeleton style={{ height: 180, borderRadius: 20 }} />
    <Skeleton style={{ height: 80, borderRadius: 16 }} />
    <Skeleton style={{ height: 52, borderRadius: 12 }} />
    <View style={{ gap: 12 }}>
      <Skeleton style={{ height: 72, borderRadius: 16 }} />
      <Skeleton style={{ height: 72, borderRadius: 16 }} />
      <Skeleton style={{ height: 72, borderRadius: 16 }} />
    </View>
  </View>
);

// ─── No Tenancy State ─────────────────────────────────────────────────────────

const NoTenancy = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
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
      <Ionicons name="home-outline" size={36} color="#0E7C7B" />
    </View>
    <Text
      style={{ fontFamily: 'Geist_700Bold', color: '#1A2332', fontSize: 18, textAlign: 'center' }}>
      No active tenancy
    </Text>
    <Text
      style={{
        fontFamily: 'Geist_400Regular',
        color: '#9CA3AF',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
      }}>
      Once you sign a lease and pay your first rent, your tenancy details will appear here.
    </Text>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function TenantRent() {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'sponsor'>('overview');

  const {
    data: tenancy,
    isLoading: loadingTenancy,
    isError: errorTenancy,
    refetch: refetchTenancy,
  } = useCurrentTenancy();
  const { data: payments, isLoading: loadingPayments } = useTenancyPayments(tenancy?.id ?? '');
  const { data: goals, isLoading: loadingGoals } = useSponsorshipGoals();

  const color = tenancy ? getHealthColor(tenancy.healthPercentage) : '#9CA3AF';

  const propertyTitle = tenancy?.property?.title ?? 'Your property';
  const propertyArea = tenancy?.property?.area ?? '';
  const propertyCity = tenancy?.property?.city ?? '';
  const landlordName = tenancy?.landlord?.name ?? '—';

  return (
    <View className="flex-1 bg-cream">
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />

      {/* Header */}
      <Animated.View entering={FadeInDown.delay(50).duration(500)} className="px-5 pb-4 pt-14">
        <Text
          className="text-[22px] text-charcoal"
          style={{ fontFamily: 'Geist_700Bold', letterSpacing: -0.3 }}>
          My Rent
        </Text>
        <Text
          className="mt-0.5 text-sm text-charcoal/40"
          style={{ fontFamily: 'Geist_400Regular' }}>
          Track your tenancy and payments
        </Text>
      </Animated.View>

      {loadingTenancy && <RentSkeleton />}

      {errorTenancy && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <Text
            style={{
              fontFamily: 'Geist_600SemiBold',
              color: '#1A2332',
              fontSize: 16,
              textAlign: 'center',
            }}>
            {"Couldn't load tenancy"}
          </Text>
          <TouchableOpacity onPress={() => refetchTenancy()} style={{ marginTop: 12 }}>
            <Text style={{ fontFamily: 'Geist_600SemiBold', color: '#0E7C7B', fontSize: 14 }}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {!loadingTenancy && !errorTenancy && !tenancy && <NoTenancy />}

      {!loadingTenancy && !errorTenancy && tenancy && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Rent Health Card */}
          <Animated.View entering={FadeInDown.delay(100).duration(500)} className="mx-5 mb-5">
            <View style={{ backgroundColor: '#1A2332', borderRadius: 20, padding: 22 }}>
              <View className="mb-4 flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text
                    className="text-base leading-5 text-white"
                    style={{ fontFamily: 'Geist_600SemiBold' }}
                    numberOfLines={2}>
                    {propertyTitle}
                  </Text>
                  <View className="mt-1 flex-row items-center gap-1">
                    <Ionicons name="location-outline" size={12} color="rgba(255,255,255,0.4)" />
                    <Text
                      className="text-xs text-white/40"
                      style={{ fontFamily: 'Geist_400Regular' }}>
                      {propertyArea}
                      {propertyCity ? `, ${propertyCity}` : ''}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 999,
                    backgroundColor: `${color}25`,
                    borderWidth: 1,
                    borderColor: `${color}50`,
                  }}>
                  <Text style={{ fontFamily: 'Geist_600SemiBold', color, fontSize: 12 }}>
                    {getHealthLabel(tenancy.healthPercentage)}
                  </Text>
                </View>
              </View>

              <RentHealthBar
                percentage={tenancy.healthPercentage}
                showLabel={false}
                showPercentage={false}
                height={12}
              />

              <View className="mt-4 flex-row gap-4">
                <View className="flex-1">
                  <Text
                    className="mb-0.5 text-xs text-white/40"
                    style={{ fontFamily: 'Geist_400Regular' }}>
                    Days remaining
                  </Text>
                  <Text style={{ fontFamily: 'Geist_700Bold', color, fontSize: 22 }}>
                    {tenancy.daysRemaining}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text
                    className="mb-0.5 text-xs text-white/40"
                    style={{ fontFamily: 'Geist_400Regular' }}>
                    Annual rent
                  </Text>
                  <Text className="text-xl text-white" style={{ fontFamily: 'Geist_700Bold' }}>
                    {formatNaira(tenancy.annualRentKobo)}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text
                    className="mb-0.5 text-xs text-white/40"
                    style={{ fontFamily: 'Geist_400Regular' }}>
                    Health
                  </Text>
                  <Text style={{ fontFamily: 'Geist_700Bold', color, fontSize: 22 }}>
                    {tenancy.healthPercentage}%
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Renew CTA */}
          {tenancy.healthPercentage <= 50 && (
            <Animated.View entering={FadeInDown.delay(150).duration(500)} className="mx-5 mb-5">
              <View
                style={{
                  borderRadius: 16,
                  backgroundColor: `${color}12`,
                  borderWidth: 1,
                  borderColor: `${color}30`,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: `${color}20`,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Ionicons name="time-outline" size={22} color={color} />
                </View>
                <View className="flex-1">
                  <Text style={{ fontFamily: 'Geist_600SemiBold', color: '#1A2332', fontSize: 14 }}>
                    Rent expires in {tenancy.daysRemaining} days
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Geist_400Regular',
                      color: '#6B7280',
                      fontSize: 12,
                      marginTop: 1,
                    }}>
                    Renew now to avoid disruption
                  </Text>
                </View>
                <Button
                  size="sm"
                  style={{ borderRadius: 10, backgroundColor: color, paddingHorizontal: 14 }}>
                  <ButtonText
                    className="text-xs text-white"
                    style={{ fontFamily: 'Geist_700Bold' }}>
                    Renew
                  </ButtonText>
                </Button>
              </View>
            </Animated.View>
          )}

          {/* Tab Selector */}
          <Animated.View entering={FadeInDown.delay(200).duration(500)} className="mx-5 mb-4">
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 4,
                borderWidth: 1,
                borderColor: '#F0EBE4',
              }}>
              {(['overview', 'history', 'sponsor'] as const).map((tab) => {
                const active = activeTab === tab;
                const label =
                  tab === 'overview' ? 'Overview' : tab === 'history' ? 'History' : 'Sponsor';
                return (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    style={{
                      flex: 1,
                      paddingVertical: 9,
                      borderRadius: 9,
                      backgroundColor: active ? '#0E7C7B' : 'transparent',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: active ? 'Geist_600SemiBold' : 'Geist_400Regular',
                        fontSize: 13,
                        color: active ? 'white' : '#9CA3AF',
                      }}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>

          {/* Tab Content */}
          <View className="mx-5 pb-8">
            {/* Overview */}
            {activeTab === 'overview' && (
              <Animated.View entering={FadeInDown.duration(400)}>
                <View className="mb-4 rounded-2xl border border-[#F0EBE4] bg-white p-5">
                  <Text
                    className="mb-4 text-base text-charcoal"
                    style={{ fontFamily: 'Geist_700Bold' }}>
                    Tenancy Details
                  </Text>
                  {[
                    { label: 'Landlord', value: landlordName },
                    { label: 'Start Date', value: formatDate(tenancy.startDate) },
                    { label: 'End Date', value: formatDate(tenancy.endDate) },
                    { label: 'Status', value: tenancy.status.replace('_', ' ') },
                  ].map((item) => (
                    <View
                      key={item.label}
                      className="flex-row items-center justify-between border-b border-[#F0EBE4] py-3 last:border-0">
                      <Text
                        className="text-sm text-charcoal/40"
                        style={{ fontFamily: 'Geist_400Regular' }}>
                        {item.label}
                      </Text>
                      <Text
                        className="text-sm text-charcoal"
                        style={{ fontFamily: 'Geist_600SemiBold' }}>
                        {item.value}
                      </Text>
                    </View>
                  ))}
                </View>
              </Animated.View>
            )}

            {/* History */}
            {activeTab === 'history' && (
              <Animated.View entering={FadeInDown.duration(400)} className="gap-3">
                {loadingPayments && (
                  <>
                    <Skeleton style={{ height: 72, borderRadius: 16 }} />
                    <Skeleton style={{ height: 72, borderRadius: 16 }} />
                    <Skeleton style={{ height: 72, borderRadius: 16 }} />
                  </>
                )}
                {!loadingPayments && (payments ?? []).length === 0 && (
                  <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                    <Text
                      style={{ fontFamily: 'Geist_400Regular', color: '#9CA3AF', fontSize: 14 }}>
                      No payments yet
                    </Text>
                  </View>
                )}
                {(payments ?? []).map((payment) => (
                  <View
                    key={payment.id}
                    className="flex-row items-center gap-3 rounded-2xl border border-[#F0EBE4] bg-white p-4">
                    <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#D4EDE6]">
                      <Ionicons
                        name={payment.status === 'completed' ? 'checkmark-circle' : 'time-outline'}
                        size={20}
                        color={payment.status === 'completed' ? '#0E7C7B' : '#E89B2C'}
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-sm text-charcoal"
                        style={{ fontFamily: 'Geist_600SemiBold' }}>
                        {payment.description ?? payment.type}
                      </Text>
                      <Text
                        className="mt-0.5 text-xs text-charcoal/40"
                        style={{ fontFamily: 'Geist_400Regular' }}>
                        {formatDate(payment.createdAt)}
                      </Text>
                    </View>
                    <Text
                      className="text-sm text-[#0E7C7B]"
                      style={{ fontFamily: 'Geist_700Bold' }}>
                      {formatNaira(payment.amount)}
                    </Text>
                  </View>
                ))}
              </Animated.View>
            )}

            {/* Sponsor */}
            {activeTab === 'sponsor' && (
              <Animated.View entering={FadeInDown.duration(400)} className="gap-4">
                <View className="rounded-2xl border border-[#F0EBE4] bg-white p-5">
                  <Text
                    className="mb-1 text-base text-charcoal"
                    style={{ fontFamily: 'Geist_700Bold' }}>
                    Rent Sponsorship Goals
                  </Text>
                  <Text
                    className="mb-5 text-sm text-charcoal/40"
                    style={{ fontFamily: 'Geist_400Regular' }}>
                    Create a goal and share with family or friends who can contribute to your rent.
                  </Text>

                  {loadingGoals && (
                    <>
                      <Skeleton style={{ height: 80, borderRadius: 12, marginBottom: 12 }} />
                      <Skeleton style={{ height: 80, borderRadius: 12, marginBottom: 12 }} />
                    </>
                  )}

                  {!loadingGoals &&
                    (goals ?? []).map((goal) => {
                      const pct =
                        goal.targetAmount > 0
                          ? Math.round((goal.currentAmount / goal.targetAmount) * 100)
                          : 0;
                      return (
                        <View key={goal.id} className="mb-4">
                          <View className="mb-2 flex-row justify-between">
                            <Text
                              className="text-sm text-charcoal"
                              style={{ fontFamily: 'Geist_600SemiBold' }}>
                              Rent Goal
                            </Text>
                            <Text
                              className="text-sm text-[#0E7C7B]"
                              style={{ fontFamily: 'Geist_700Bold' }}>
                              {pct}% funded
                            </Text>
                          </View>
                          <RentHealthBar percentage={pct} showLabel={false} height={8} />
                          <View className="mt-2 flex-row justify-between">
                            <Text
                              className="text-xs text-charcoal/40"
                              style={{ fontFamily: 'Geist_400Regular' }}>
                              {formatNaira(goal.currentAmount)} raised
                            </Text>
                            <Text
                              className="text-xs text-charcoal/40"
                              style={{ fontFamily: 'Geist_400Regular' }}>
                              Goal: {formatNaira(goal.targetAmount)}
                            </Text>
                          </View>
                          {goal.message && (
                            <Text
                              className="mt-2 text-xs italic text-charcoal/50"
                              style={{ fontFamily: 'Geist_400Regular' }}>
                              {`"${goal.message}"`}
                            </Text>
                          )}
                        </View>
                      );
                    })}

                  <Button
                    size="lg"
                    style={{ height: 48, borderRadius: 12, backgroundColor: '#0E7C7B' }}>
                    <ButtonText
                      className="text-sm text-white"
                      style={{ fontFamily: 'Geist_700Bold' }}>
                      + Create New Goal
                    </ButtonText>
                  </Button>
                </View>
              </Animated.View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
