import React from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { authClient } from '@/lib/auth-client';
import { useGlobalStore } from '@/store/global-store';
import { Text } from '@/components/ui/text';

const MENU_SECTIONS = [
  {
    title: 'Business',
    items: [
      { icon: 'business-outline' as const, label: 'My Properties', sub: 'Manage listings' },
      { icon: 'people-outline' as const, label: 'My Tenants', sub: 'View all tenancies' },
      { icon: 'document-text-outline' as const, label: 'Applications', sub: 'Pending approvals' },
      { icon: 'calendar-outline' as const, label: 'Viewing Requests', sub: 'Scheduled visits' },
    ],
  },
  {
    title: 'Finance',
    items: [
      { icon: 'wallet-outline' as const, label: 'Wallet & Payouts', sub: 'Balance & withdrawal' },
      { icon: 'receipt-outline' as const, label: 'Payment History', sub: 'All transactions' },
      { icon: 'lock-closed-outline' as const, label: 'Escrow Holds', sub: 'Pending releases' },
    ],
  },
  {
    title: 'Account',
    items: [
      { icon: 'shield-checkmark-outline' as const, label: 'KYC Status', sub: 'Verification progress' },
      { icon: 'card-outline' as const, label: 'Bank Account', sub: 'Payout destination' },
      { icon: 'notifications-outline' as const, label: 'Notifications' },
      { icon: 'help-circle-outline' as const, label: 'Help & Support' },
    ],
  },
];

export default function LandlordMe() {
  const { setRole } = useGlobalStore();

  const handleSignOut = async () => {
    await authClient.signOut();
    setRole('tenant');
    router.replace('/onboarding');
  };

  return (
    <View className="flex-1 bg-cream">
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Animated.View entering={FadeInDown.delay(50).duration(500)}>
          <View
            style={{
              backgroundColor: '#1A2332',
              paddingTop: 60,
              paddingBottom: 32,
              paddingHorizontal: 24,
            }}
          >
            <View className="flex-row items-center gap-4">
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: 'rgba(255,255,255,0.2)',
                }}
              >
                <Text style={{ fontFamily: 'Geist_700Bold', color: 'white', fontSize: 24 }}>A</Text>
              </View>
              <View className="flex-1">
                <Text style={{ fontFamily: 'Geist_700Bold', color: 'white', fontSize: 20 }}>
                  Mr. Chukwuka Adeyemi
                </Text>
                <Text style={{ fontFamily: 'Geist_400Regular', color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 1 }}>
                  adeyemi@remax.ng
                </Text>
                <View className="flex-row gap-2 mt-6 mt-2">
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 999,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }}
                  >
                    <Text style={{ fontFamily: 'Geist_600SemiBold', color: 'white', fontSize: 11 }}>
                      LANDLORD
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 999,
                      backgroundColor: '#D4EDE6',
                    }}
                  >
                    <Text style={{ fontFamily: 'Geist_600SemiBold', color: '#0E7C7B', fontSize: 11 }}>
                      ✓ VERIFIED
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="pencil-outline" size={16} color="white" />
              </TouchableOpacity>
            </View>

            {/* KYC Status */}
            <View
              style={{
                marginTop: 20,
                backgroundColor: 'rgba(255,255,255,0.07)',
                borderRadius: 16,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <Ionicons name="shield-checkmark" size={24} color="#D4EDE6" />
              <View className="flex-1">
                <Text style={{ fontFamily: 'Geist_600SemiBold', color: 'white', fontSize: 14 }}>
                  Identity Verified
                </Text>
                <Text style={{ fontFamily: 'Geist_400Regular', color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 1 }}>
                  NIN verified · 3 docs approved
                </Text>
              </View>
              <Ionicons name="checkmark-circle" size={22} color="#1E9E5C" />
            </View>
          </View>
        </Animated.View>

        {/* Menu Sections */}
        <View className="px-5 py-5 gap-6">
          {MENU_SECTIONS.map((section, sIdx) => (
            <Animated.View key={section.title} entering={FadeInDown.delay(100 + sIdx * 60).duration(400)}>
              <Text
                className="text-charcoal/40 text-xs uppercase tracking-widest mb-2"
                style={{ fontFamily: 'Geist_600SemiBold' }}
              >
                {section.title}
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
                {section.items.map((item, i) => (
                  <TouchableOpacity
                    key={item.label}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      borderTopWidth: i > 0 ? 1 : 0,
                      borderTopColor: '#F5F0EC',
                    }}
                  >
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        backgroundColor: '#F5F5F0',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons name={item.icon} size={18} color="#6B7280" />
                    </View>
                    <View className="flex-1">
                      <Text style={{ fontFamily: 'Geist_500Medium', color: '#1A2332', fontSize: 14 }}>
                        {item.label}
                      </Text>
                      {item.sub && (
                        <Text style={{ fontFamily: 'Geist_400Regular', color: '#9CA3AF', fontSize: 12, marginTop: 0.5 }}>
                          {item.sub}
                        </Text>
                      )}
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#D0CCC6" />
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          ))}

          {/* Sign Out */}
          <Animated.View entering={FadeInDown.delay(400).duration(400)}>
            <TouchableOpacity
              onPress={handleSignOut}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: 16,
                borderRadius: 14,
                borderWidth: 1.5,
                borderColor: '#FCA5A5',
                backgroundColor: '#FEF2F2',
              }}
            >
              <Ionicons name="log-out-outline" size={18} color="#EF4444" />
              <Text style={{ fontFamily: 'Geist_600SemiBold', color: '#EF4444', fontSize: 14 }}>
                Sign Out
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={{ height: 20 }} />
        </View>
      </ScrollView>
    </View>
  );
}
