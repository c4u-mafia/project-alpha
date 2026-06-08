import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import { RentHealthBar } from '@/components/rent-health-bar';
import { Button, ButtonText } from '@/components/ui/button';

const MOCK_TENANCY = {
  id: 'tncy-001',
  propertyTitle: '3 Bedroom Flat, Admiralty Way',
  area: 'Lekki Phase 1',
  city: 'Lagos',
  landlordName: 'Mr. Chukwuka Adeyemi',
  startDate: '2024-01-15',
  endDate: '2025-01-14',
  annualRentKobo: 280000000,
  healthPercentage: 38,
  daysRemaining: 37,
};

const MOCK_PAYMENTS = [
  { id: 'p1', amount: 280000000, date: '2024-01-15', status: 'completed', label: 'Annual Rent 2024' },
  { id: 'p2', amount: 5000000, date: '2024-01-15', status: 'completed', label: 'Caution Fee' },
  { id: 'p3', amount: 280000000, date: '2023-01-10', status: 'completed', label: 'Annual Rent 2023' },
];

const MOCK_GOALS = [
  { id: 'g1', target: 280000000, current: 85000000, deadline: '2024-12-31', message: 'Help me renew my rent in January!' },
];

const formatNaira = (kobo: number) => {
  const naira = kobo / 100;
  return `₦${naira.toLocaleString('en-NG')}`;
};

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

export default function TenantRent() {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'sponsor'>('overview');
  const tenancy = MOCK_TENANCY;
  const color = getHealthColor(tenancy.healthPercentage);

  return (
    <View className="flex-1 bg-cream">
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />

      {/* Header */}
      <Animated.View entering={FadeInDown.delay(50).duration(500)} className="px-5 pt-14 pb-4">
        <Text
          className="text-charcoal text-[22px]"
          style={{ fontFamily: 'Geist_700Bold', letterSpacing: -0.3 }}
        >
          My Rent
        </Text>
        <Text className="text-charcoal/40 text-sm mt-0.5" style={{ fontFamily: 'Geist_400Regular' }}>
          Track your tenancy and payments
        </Text>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Rent Health Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} className="mx-5 mb-5">
          <View
            style={{
              backgroundColor: '#1A2332',
              borderRadius: 20,
              padding: 22,
            }}
          >
            {/* Property */}
            <View className="flex-row items-start justify-between mb-4">
              <View className="flex-1 pr-3">
                <Text
                  className="text-white text-base leading-5"
                  style={{ fontFamily: 'Geist_600SemiBold' }}
                  numberOfLines={2}
                >
                  {tenancy.propertyTitle}
                </Text>
                <View className="flex-row items-center gap-1 mt-1">
                  <Ionicons name="location-outline" size={12} color="rgba(255,255,255,0.4)" />
                  <Text
                    className="text-white/40 text-xs"
                    style={{ fontFamily: 'Geist_400Regular' }}
                  >
                    {tenancy.area}, {tenancy.city}
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
                }}
              >
                <Text
                  style={{ fontFamily: 'Geist_600SemiBold', color, fontSize: 12 }}
                >
                  {getHealthLabel(tenancy.healthPercentage)}
                </Text>
              </View>
            </View>

            {/* Health Bar */}
            <RentHealthBar
              percentage={tenancy.healthPercentage}
              showLabel={false}
              showPercentage={false}
              height={12}
            />

            {/* Stats row */}
            <View className="flex-row mt-4 gap-4">
              <View className="flex-1">
                <Text className="text-white/40 text-xs mb-0.5" style={{ fontFamily: 'Geist_400Regular' }}>
                  Days remaining
                </Text>
                <Text
                  style={{ fontFamily: 'Geist_700Bold', color, fontSize: 22 }}
                >
                  {tenancy.daysRemaining}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-white/40 text-xs mb-0.5" style={{ fontFamily: 'Geist_400Regular' }}>
                  Annual rent
                </Text>
                <Text
                  className="text-white text-xl"
                  style={{ fontFamily: 'Geist_700Bold' }}
                >
                  {formatNaira(tenancy.annualRentKobo)}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-white/40 text-xs mb-0.5" style={{ fontFamily: 'Geist_400Regular' }}>
                  Health
                </Text>
                <Text
                  style={{ fontFamily: 'Geist_700Bold', color, fontSize: 22 }}
                >
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
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: `${color}20`,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="time-outline" size={22} color={color} />
              </View>
              <View className="flex-1">
                <Text style={{ fontFamily: 'Geist_600SemiBold', color: '#1A2332', fontSize: 14 }}>
                  Rent expires in {tenancy.daysRemaining} days
                </Text>
                <Text style={{ fontFamily: 'Geist_400Regular', color: '#6B7280', fontSize: 12, marginTop: 1 }}>
                  Renew now to avoid disruption
                </Text>
              </View>
              <Button
                size="sm"
                style={{ borderRadius: 10, backgroundColor: color, paddingHorizontal: 14 }}
              >
                <ButtonText className="text-white text-xs" style={{ fontFamily: 'Geist_700Bold' }}>
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
            }}
          >
            {(['overview', 'history', 'sponsor'] as const).map((tab) => {
              const active = activeTab === tab;
              const label = tab === 'overview' ? 'Overview' : tab === 'history' ? 'History' : 'Sponsor';
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
                  }}
                >
                  <Text
                    style={{
                      fontFamily: active ? 'Geist_600SemiBold' : 'Geist_400Regular',
                      fontSize: 13,
                      color: active ? 'white' : '#9CA3AF',
                    }}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* Tab Content */}
        <View className="mx-5 pb-8">
          {activeTab === 'overview' && (
            <Animated.View entering={FadeInDown.duration(400)}>
              {/* Tenancy Details */}
              <View className="bg-white rounded-2xl p-5 mb-4 border border-[#F0EBE4]">
                <Text className="text-charcoal text-base mb-4" style={{ fontFamily: 'Geist_700Bold' }}>
                  Tenancy Details
                </Text>
                {[
                  { label: 'Landlord', value: tenancy.landlordName },
                  { label: 'Start Date', value: tenancy.startDate },
                  { label: 'End Date', value: tenancy.endDate },
                  { label: 'Property Type', value: 'Apartment' },
                ].map((item) => (
                  <View key={item.label} className="flex-row justify-between items-center py-3 border-b border-[#F0EBE4] last:border-0">
                    <Text className="text-charcoal/40 text-sm" style={{ fontFamily: 'Geist_400Regular' }}>
                      {item.label}
                    </Text>
                    <Text className="text-charcoal text-sm" style={{ fontFamily: 'Geist_600SemiBold' }}>
                      {item.value}
                    </Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}

          {activeTab === 'history' && (
            <Animated.View entering={FadeInDown.duration(400)} className="gap-3">
              {MOCK_PAYMENTS.map((payment) => (
                <View
                  key={payment.id}
                  className="bg-white rounded-2xl p-4 border border-[#F0EBE4] flex-row items-center gap-3"
                >
                  <View className="w-10 h-10 bg-[#D4EDE6] rounded-xl items-center justify-center">
                    <Ionicons name="checkmark-circle" size={20} color="#0E7C7B" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-charcoal text-sm" style={{ fontFamily: 'Geist_600SemiBold' }}>
                      {payment.label}
                    </Text>
                    <Text className="text-charcoal/40 text-xs mt-0.5" style={{ fontFamily: 'Geist_400Regular' }}>
                      {payment.date}
                    </Text>
                  </View>
                  <Text className="text-[#0E7C7B] text-sm" style={{ fontFamily: 'Geist_700Bold' }}>
                    {formatNaira(payment.amount)}
                  </Text>
                </View>
              ))}
            </Animated.View>
          )}

          {activeTab === 'sponsor' && (
            <Animated.View entering={FadeInDown.duration(400)} className="gap-4">
              <View className="bg-white rounded-2xl p-5 border border-[#F0EBE4]">
                <Text className="text-charcoal text-base mb-1" style={{ fontFamily: 'Geist_700Bold' }}>
                  Rent Sponsorship Goals
                </Text>
                <Text className="text-charcoal/40 text-sm mb-5" style={{ fontFamily: 'Geist_400Regular' }}>
                  Create a goal and share with family or friends who can contribute to your rent.
                </Text>

                {MOCK_GOALS.map((goal) => {
                  const pct = Math.round((goal.current / goal.target) * 100);
                  return (
                    <View key={goal.id} className="mb-4">
                      <View className="flex-row justify-between mb-2">
                        <Text className="text-charcoal text-sm" style={{ fontFamily: 'Geist_600SemiBold' }}>
                          Next Rent Goal
                        </Text>
                        <Text className="text-[#0E7C7B] text-sm" style={{ fontFamily: 'Geist_700Bold' }}>
                          {pct}% funded
                        </Text>
                      </View>
                      <RentHealthBar percentage={pct} showLabel={false} height={8} />
                      <View className="flex-row justify-between mt-2">
                        <Text className="text-charcoal/40 text-xs" style={{ fontFamily: 'Geist_400Regular' }}>
                          {formatNaira(goal.current)} raised
                        </Text>
                        <Text className="text-charcoal/40 text-xs" style={{ fontFamily: 'Geist_400Regular' }}>
                          Goal: {formatNaira(goal.target)}
                        </Text>
                      </View>
                      <Text className="text-charcoal/50 text-xs mt-2 italic" style={{ fontFamily: 'Geist_400Regular' }}>
                        "{goal.message}"
                      </Text>
                    </View>
                  );
                })}

                <Button
                  size="lg"
                  style={{ height: 48, borderRadius: 12, backgroundColor: '#0E7C7B' }}
                >
                  <ButtonText className="text-white text-sm" style={{ fontFamily: 'Geist_700Bold' }}>
                    + Create New Goal
                  </ButtonText>
                </Button>
              </View>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
