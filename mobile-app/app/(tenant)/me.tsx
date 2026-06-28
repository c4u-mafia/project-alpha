import React from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { authClient } from '@/lib/auth-client';
import { useGlobalStore } from '@/store/global-store';
import { Text } from '@/components/ui/text';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentUser, useWallet } from '@/hooks/use-api';

type IconName = React.ComponentProps<typeof Ionicons>['name'];
type MenuItem = { icon: IconName; label: string; sub?: string; href?: string };
type MenuSection = { title: string; items: MenuItem[] };

const MENU_SECTIONS: MenuSection[] = [
  {
    title: 'Account',
    items: [
      {
        icon: 'person-circle-outline',
        label: 'Edit Profile',
        sub: 'Phone, DOB, city',
        href: '/profile/edit',
      },
      {
        icon: 'card-outline',
        label: 'Wallet',
        sub: 'Balance & transactions',
        href: '/wallet',
      },
      {
        icon: 'heart-outline',
        label: 'Saved Homes',
        sub: 'Your favourited listings',
        href: '/saved-homes',
      },
      {
        icon: 'shield-checkmark-outline',
        label: 'KYC Verification',
        sub: 'NIN & identity status',
        href: '/kyc',
      },
    ],
  },
  {
    title: 'Rent & Tenancy',
    items: [
      { icon: 'home-outline', label: 'My Tenancy', sub: 'Current rent details', href: '/(tenant)/rent' },
      { icon: 'calendar-outline', label: 'Viewings', sub: 'Scheduled property visits', href: '/viewings' },
      {
        icon: 'document-text-outline',
        label: 'Applications',
        sub: 'Your rental applications',
        href: '/applications',
      },
    ],
  },
  {
    title: 'More',
    items: [
      { icon: 'notifications-outline', label: 'Notifications', sub: 'Manage alerts', href: '/notifications' },
      { icon: 'help-circle-outline', label: 'Help & Support', sub: 'FAQs and contact' },
      { icon: 'shield-outline', label: 'Privacy Policy' },
    ],
  },
];

const formatNaira = (kobo: number) => `₦${(kobo / 100).toLocaleString('en-NG')}`;

const KYC_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  verified: { label: '✓ VERIFIED', bg: '#D4EDE6', color: '#0E7C7B' },
  pending: { label: 'PENDING', bg: '#FEF3C7', color: '#E89B2C' },
  failed: { label: 'FAILED', bg: '#FEE2E2', color: '#D54545' },
  not_submitted: { label: 'UNVERIFIED', bg: 'rgba(255,255,255,0.15)', color: 'white' },
};

export default function TenantMe() {
  const { setRole } = useGlobalStore();
  const { data: user, isLoading: loadingUser } = useCurrentUser();
  const { data: wallet, isLoading: loadingWallet } = useWallet();

  const handleSignOut = async () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await authClient.signOut();
          setRole('tenant');
          router.replace('/onboarding');
        },
      },
    ]);
  };

  const initial = user?.name?.[0]?.toUpperCase() ?? '?';
  const ninStatus = user?.profile?.ninStatus ?? 'not_submitted';
  const kycBadge = KYC_BADGE[ninStatus] ?? KYC_BADGE.not_submitted;

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
                <Text style={{ fontFamily: 'Geist_700Bold', color: 'white', fontSize: 24 }}>
                  {initial}
                </Text>
              </View>
              <View className="flex-1">
                {loadingUser ? (
                  <>
                    <Skeleton
                      style={{
                        height: 20,
                        width: 140,
                        borderRadius: 6,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                      }}
                    />
                    <Skeleton
                      style={{
                        height: 12,
                        width: 180,
                        borderRadius: 6,
                        marginTop: 6,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Text
                      style={{ fontFamily: 'Geist_700Bold', color: 'white', fontSize: 20 }}
                      numberOfLines={1}>
                      {user?.name ?? '—'}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Geist_400Regular',
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: 13,
                        marginTop: 1,
                      }}
                      numberOfLines={1}>
                      {user?.email ?? ''}
                    </Text>
                  </>
                )}
                <View className="mt-2 flex-row gap-2">
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 999,
                      backgroundColor: 'rgba(255,255,255,0.15)',
                    }}>
                    <Text
                      style={{ fontFamily: 'Geist_600SemiBold', color: 'white', fontSize: 11 }}>
                      TENANT
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 999,
                      backgroundColor: kycBadge.bg,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Geist_600SemiBold',
                        color: kycBadge.color,
                        fontSize: 11,
                      }}>
                      {kycBadge.label}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => router.push('/profile/edit' as never)}
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
            <TouchableOpacity
              onPress={() => router.push('/wallet' as never)}
              activeOpacity={0.85}
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
                {loadingWallet ? (
                  <Skeleton
                    style={{
                      height: 22,
                      width: 120,
                      borderRadius: 6,
                      marginTop: 6,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                    }}
                  />
                ) : (
                  <Text
                    style={{
                      fontFamily: 'Geist_700Bold',
                      color: 'white',
                      fontSize: 22,
                      marginTop: 2,
                    }}>
                    {wallet ? formatNaira(wallet.balance) : '₦0'}
                  </Text>
                )}
              </View>
              <View
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 10,
                  backgroundColor: '#F2A65A',
                }}>
                <Text style={{ fontFamily: 'Geist_700Bold', color: 'white', fontSize: 13 }}>
                  Top Up
                </Text>
              </View>
            </TouchableOpacity>
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
                    onPress={() => item.href && router.push(item.href as never)}
                    disabled={!item.href}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      borderTopWidth: i > 0 ? 1 : 0,
                      borderTopColor: '#F5F0EC',
                      opacity: item.href ? 1 : 0.6,
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
                    {item.href && <Ionicons name="chevron-forward" size={16} color="#D0CCC6" />}
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
