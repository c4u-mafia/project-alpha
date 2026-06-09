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
    title: 'Account',
    items: [
      {
        icon: 'person-circle-outline' as const,
        label: 'Edit Profile',
        sub: 'Name, photo, contact info',
      },
      { icon: 'card-outline' as const, label: 'Wallet', sub: 'Balance & transactions' },
      { icon: 'heart-outline' as const, label: 'Saved Homes', sub: 'Your favourited listings' },
      {
        icon: 'shield-checkmark-outline' as const,
        label: 'KYC Verification',
        sub: 'NIN & identity status',
      },
    ],
  },
  {
    title: 'Rent & Tenancy',
    items: [
      { icon: 'home-outline' as const, label: 'My Tenancy', sub: 'Current rent details' },
      { icon: 'calendar-outline' as const, label: 'Viewings', sub: 'Scheduled property visits' },
      {
        icon: 'document-text-outline' as const,
        label: 'Applications',
        sub: 'Your rental applications',
      },
    ],
  },
  {
    title: 'More',
    items: [
      { icon: 'notifications-outline' as const, label: 'Notifications', sub: 'Manage alerts' },
      { icon: 'help-circle-outline' as const, label: 'Help & Support', sub: 'FAQs and contact' },
      { icon: 'shield-outline' as const, label: 'Privacy Policy' },
    ],
  },
];

export default function TenantMe() {
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
              backgroundColor: '#0E7C7B',
              paddingTop: 60,
              paddingBottom: 32,
              paddingHorizontal: 24,
            }}>
            <View className="flex-row items-center gap-4">
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: 'rgba(255,255,255,0.4)',
                }}>
                <Text style={{ fontFamily: 'Geist_700Bold', color: 'white', fontSize: 24 }}>C</Text>
              </View>
              <View className="flex-1">
                <Text style={{ fontFamily: 'Geist_700Bold', color: 'white', fontSize: 20 }}>
                  Chioma Okafor
                </Text>
                <Text
                  style={{
                    fontFamily: 'Geist_400Regular',
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: 13,
                    marginTop: 1,
                  }}>
                  chioma@gmail.com
                </Text>
                <View
                  style={{
                    marginTop: 6,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 999,
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    alignSelf: 'flex-start',
                  }}>
                  <Text style={{ fontFamily: 'Geist_600SemiBold', color: 'white', fontSize: 11 }}>
                    TENANT
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Ionicons name="pencil-outline" size={16} color="white" />
              </TouchableOpacity>
            </View>

            {/* Wallet Balance Preview */}
            <View
              style={{
                marginTop: 20,
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderRadius: 16,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View>
                <Text
                  style={{
                    fontFamily: 'Geist_400Regular',
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: 12,
                  }}>
                  Wallet Balance
                </Text>
                <Text
                  style={{
                    fontFamily: 'Geist_700Bold',
                    color: 'white',
                    fontSize: 22,
                    marginTop: 2,
                  }}>
                  ₦24,500
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 10,
                  backgroundColor: '#F2A65A',
                }}>
                <Text style={{ fontFamily: 'Geist_700Bold', color: 'white', fontSize: 13 }}>
                  Top Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Menu Sections */}
        <View className="gap-6 px-5 py-5">
          {MENU_SECTIONS.map((section, sIdx) => (
            <Animated.View
              key={section.title}
              entering={FadeInDown.delay(100 + sIdx * 60).duration(400)}>
              <Text
                className="mb-2 text-xs uppercase tracking-widest text-charcoal/40"
                style={{ fontFamily: 'Geist_600SemiBold' }}>
                {section.title}
              </Text>
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: '#F0EBE4',
                  overflow: 'hidden',
                }}>
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
                    }}>
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        backgroundColor: '#F5F5F0',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Ionicons name={item.icon} size={18} color="#6B7280" />
                    </View>
                    <View className="flex-1">
                      <Text
                        style={{ fontFamily: 'Geist_500Medium', color: '#1A2332', fontSize: 14 }}>
                        {item.label}
                      </Text>
                      {item.sub && (
                        <Text
                          style={{
                            fontFamily: 'Geist_400Regular',
                            color: '#9CA3AF',
                            fontSize: 12,
                            marginTop: 0.5,
                          }}>
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
              }}>
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
