import React from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import { RentHealthBar } from '@/components/rent-health-bar';

const MOCK_SUMMARY = {
  totalProperties: 4,
  activeListings: 2,
  pendingApplications: 3,
  walletBalance: 2850000,
  monthlyIncome: 700000,
};

const EXPIRING_TENANTS = [
  { id: 't1', name: 'Chioma Okafor', property: '3 Bed Flat, Lekki', daysLeft: 37, healthPct: 38 },
  { id: 't2', name: 'Emeka Dike', property: '2 Bed Apt, Ikeja', daysLeft: 12, healthPct: 8 },
  { id: 't3', name: 'Aisha Bello', property: 'Studio, Yaba', daysLeft: 68, healthPct: 61 },
];

const RECENT_ACTIVITY = [
  { id: 'a1', icon: 'document-text-outline' as const, label: 'New application', sub: '3 Bed Flat, Lekki', time: '2h ago', color: '#0E7C7B' },
  { id: 'a2', icon: 'card-outline' as const, label: 'Rent payment received', sub: '₦150,000 from Emeka', time: '1d ago', color: '#1E9E5C' },
  { id: 'a3', icon: 'calendar-outline' as const, label: 'Viewing booked', sub: '2 Bed Apt, Ikeja', time: '2d ago', color: '#F2A65A' },
];

const formatNaira = (n: number) => `₦${n.toLocaleString('en-NG')}`;

export default function LandlordDashboard() {
  return (
    <View className="flex-1 bg-cream">
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(50).duration(500)}
          style={{
            backgroundColor: '#0E7C7B',
            paddingTop: 60,
            paddingBottom: 28,
            paddingHorizontal: 24,
          }}
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text style={{ fontFamily: 'Geist_400Regular', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                Good morning 👋
              </Text>
              <Text
                style={{ fontFamily: 'Geist_700Bold', color: 'white', fontSize: 22, marginTop: 2, letterSpacing: -0.3 }}
              >
                Mr. Adeyemi
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
              }}
            >
              <Ionicons name="notifications-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Stats Row */}
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              gap: 10,
            }}
          >
            {[
              { label: 'Properties', value: MOCK_SUMMARY.totalProperties, icon: 'business-outline' as const },
              { label: 'Listings', value: MOCK_SUMMARY.activeListings, icon: 'home-outline' as const },
              { label: 'Applications', value: MOCK_SUMMARY.pendingApplications, icon: 'document-text-outline' as const },
            ].map((stat) => (
              <View
                key={stat.label}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  borderRadius: 14,
                  padding: 14,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontFamily: 'Geist_700Bold', color: 'white', fontSize: 24 }}>
                  {stat.value}
                </Text>
                <Text style={{ fontFamily: 'Geist_400Regular', color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2 }}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <View className="px-5 py-5 gap-5">
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
              }}
            >
              <View>
                <Text style={{ fontFamily: 'Geist_400Regular', color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                  Wallet Balance
                </Text>
                <Text style={{ fontFamily: 'Geist_700Bold', color: 'white', fontSize: 26, marginTop: 4 }}>
                  {formatNaira(MOCK_SUMMARY.walletBalance)}
                </Text>
                <Text style={{ fontFamily: 'Geist_400Regular', color: '#1E9E5C', fontSize: 12, marginTop: 4 }}>
                  +{formatNaira(MOCK_SUMMARY.monthlyIncome)} this month
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 12,
                  backgroundColor: '#F2A65A',
                }}
              >
                <Text style={{ fontFamily: 'Geist_700Bold', color: 'white', fontSize: 13 }}>
                  Withdraw
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Expiring Tenancies */}
          <Animated.View entering={FadeInDown.delay(160).duration(500)}>
            <View className="flex-row items-center justify-between mb-3">
              <Text style={{ fontFamily: 'Geist_700Bold', color: '#1A2332', fontSize: 16 }}>
                Expiring Tenancies
              </Text>
              <TouchableOpacity>
                <Text style={{ fontFamily: 'Geist_600SemiBold', color: '#0E7C7B', fontSize: 13 }}>
                  See all
                </Text>
              </TouchableOpacity>
            </View>

            <View className="gap-3">
              {EXPIRING_TENANTS.map((tenant) => (
                <View
                  key={tenant.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: '#F0EBE4',
                  }}
                >
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1 pr-3">
                      <Text style={{ fontFamily: 'Geist_600SemiBold', color: '#1A2332', fontSize: 14 }}>
                        {tenant.name}
                      </Text>
                      <Text style={{ fontFamily: 'Geist_400Regular', color: '#9CA3AF', fontSize: 12, marginTop: 1 }}>
                        {tenant.property}
                      </Text>
                    </View>
                    <View
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 999,
                        backgroundColor: tenant.daysLeft <= 14 ? '#FEE2E2' : tenant.daysLeft <= 30 ? '#FFE4D4' : '#F0FAF9',
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: 'Geist_600SemiBold',
                          fontSize: 12,
                          color: tenant.daysLeft <= 14 ? '#D54545' : tenant.daysLeft <= 30 ? '#E2683C' : '#0E7C7B',
                        }}
                      >
                        {tenant.daysLeft}d left
                      </Text>
                    </View>
                  </View>
                  <RentHealthBar
                    percentage={tenant.healthPct}
                    showLabel={false}
                    showPercentage={false}
                    height={8}
                    compact
                  />
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Recent Activity */}
          <Animated.View entering={FadeInDown.delay(220).duration(500)}>
            <Text style={{ fontFamily: 'Geist_700Bold', color: '#1A2332', fontSize: 16, marginBottom: 12 }}>
              Recent Activity
            </Text>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                borderWidth: 1,
                borderColor: '#F0EBE4',
                overflow: 'hidden',
              }}
            >
              {RECENT_ACTIVITY.map((item, i) => (
                <View
                  key={item.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    padding: 14,
                    borderTopWidth: i > 0 ? 1 : 0,
                    borderTopColor: '#F5F0EC',
                  }}
                >
                  <View
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      backgroundColor: `${item.color}15`,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name={item.icon} size={18} color={item.color} />
                  </View>
                  <View className="flex-1">
                    <Text style={{ fontFamily: 'Geist_500Medium', color: '#1A2332', fontSize: 13 }}>
                      {item.label}
                    </Text>
                    <Text style={{ fontFamily: 'Geist_400Regular', color: '#9CA3AF', fontSize: 12, marginTop: 1 }}>
                      {item.sub}
                    </Text>
                  </View>
                  <Text style={{ fontFamily: 'Geist_400Regular', color: '#C0BBC4', fontSize: 11 }}>
                    {item.time}
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>

          <View style={{ height: 20 }} />
        </View>
      </ScrollView>
    </View>
  );
}
