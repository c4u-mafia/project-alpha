import React from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { authClient } from '@/lib/auth-client';
import { useGlobalStore } from '@/store/global-store';
import { Text } from '@/components/ui/text';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentUser, type LandlordRoleProfile } from '@/hooks/use-api';

type IconName = React.ComponentProps<typeof Ionicons>['name'];
type MenuItem = { icon: IconName; label: string; sub?: string; href?: string };
type MenuSection = { title: string; items: MenuItem[] };

const MENU_SECTIONS: MenuSection[] = [
  {
    title: 'Business',
    items: [
      {
        icon: 'business-outline',
        label: 'My Properties',
        sub: 'Manage listings',
        href: '/(landlord)/properties',
      },
      {
        icon: 'people-outline',
        label: 'My Tenants',
        sub: 'View all tenancies',
        href: '/(landlord)/tenants',
      },
      {
        icon: 'document-text-outline',
        label: 'Applications',
        sub: 'Pending approvals',
        href: '/applications',
      },
      {
        icon: 'calendar-outline',
        label: 'Viewing Requests',
        sub: 'Scheduled visits',
        href: '/viewings',
      },
    ],
  },
  {
    title: 'Finance',
    items: [
      { icon: 'wallet-outline', label: 'Wallet & Payouts', sub: 'Balance & withdrawal', href: '/wallet' },
      { icon: 'receipt-outline', label: 'Payment History', sub: 'All transactions', href: '/wallet' },
    ],
  },
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
        icon: 'shield-checkmark-outline',
        label: 'KYC Status',
        sub: 'Verification progress',
        href: '/kyc',
      },
      { icon: 'notifications-outline', label: 'Notifications', href: '/notifications' },
      { icon: 'help-circle-outline', label: 'Help & Support' },
    ],
  },
];

const VERIFICATION_BADGE: Record<
  LandlordRoleProfile['verificationStatus'],
  { label: string; bg: string; color: string }
> = {
  approved: { label: '✓ VERIFIED', bg: '#D4EDE6', color: '#0E7C7B' },
  under_review: { label: 'UNDER REVIEW', bg: '#FEF3C7', color: '#E89B2C' },
  documents_submitted: { label: 'SUBMITTED', bg: '#FEF3C7', color: '#E89B2C' },
  rejected: { label: 'REJECTED', bg: '#FEE2E2', color: '#D54545' },
  unverified: { label: 'UNVERIFIED', bg: 'rgba(255,255,255,0.1)', color: 'white' },
};

export default function LandlordMe() {
  const { setRole } = useGlobalStore();
  const { data: user, isLoading } = useCurrentUser();

  const landlordRP = (user?.role === 'landlord'
    ? (user?.roleProfile as LandlordRoleProfile | null)
    : null) ?? null;
  const verificationStatus = landlordRP?.verificationStatus ?? 'unverified';
  const badge = VERIFICATION_BADGE[verificationStatus];
  const isVerified = verificationStatus === 'approved';
  const ninStatus = user?.profile?.ninStatus ?? 'not_submitted';
  const hasBank = Boolean(landlordRP?.bankAccountNumber);

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
            }}>
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
                }}>
                <Text style={{ fontFamily: 'Geist_700Bold', color: 'white', fontSize: 24 }}>
                  {initial}
                </Text>
              </View>
              <View className="flex-1">
                {isLoading ? (
                  <>
                    <Skeleton
                      style={{
                        height: 20,
                        width: 160,
                        borderRadius: 6,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      }}
                    />
                    <Skeleton
                      style={{
                        height: 12,
                        width: 200,
                        borderRadius: 6,
                        marginTop: 6,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Text
                      style={{ fontFamily: 'Geist_700Bold', color: 'white', fontSize: 20 }}
                      numberOfLines={1}>
                      {landlordRP?.isCompany && landlordRP.companyName
                        ? landlordRP.companyName
                        : (user?.name ?? '—')}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Geist_400Regular',
                        color: 'rgba(255,255,255,0.5)',
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
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }}>
                    <Text
                      style={{ fontFamily: 'Geist_600SemiBold', color: 'white', fontSize: 11 }}>
                      LANDLORD
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 999,
                      backgroundColor: badge.bg,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Geist_600SemiBold',
                        color: badge.color,
                        fontSize: 11,
                      }}>
                      {badge.label}
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
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Ionicons name="pencil-outline" size={16} color="white" />
              </TouchableOpacity>
            </View>

            {/* KYC Status */}
            <TouchableOpacity
              onPress={() => router.push('/kyc' as never)}
              activeOpacity={0.85}
              style={{
                marginTop: 20,
                backgroundColor: 'rgba(255,255,255,0.07)',
                borderRadius: 16,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              }}>
              <Ionicons
                name={isVerified ? 'shield-checkmark' : 'shield-outline'}
                size={24}
                color={isVerified ? '#D4EDE6' : 'rgba(255,255,255,0.6)'}
              />
              <View className="flex-1">
                <Text style={{ fontFamily: 'Geist_600SemiBold', color: 'white', fontSize: 14 }}>
                  {isVerified ? 'Identity Verified' : 'Verification Incomplete'}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Geist_400Regular',
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: 12,
                    marginTop: 1,
                  }}>
                  NIN {ninStatus === 'verified' ? 'verified' : ninStatus.replace('_', ' ')}
                  {' · '}
                  Bank {hasBank ? 'on file' : 'not added'}
                </Text>
              </View>
              <Ionicons
                name={isVerified ? 'checkmark-circle' : 'chevron-forward'}
                size={isVerified ? 22 : 16}
                color={isVerified ? '#1E9E5C' : 'rgba(255,255,255,0.4)'}
              />
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
