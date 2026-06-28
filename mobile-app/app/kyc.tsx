import React from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useCurrentUser,
  useOnboardingStatus,
  type LandlordRoleProfile,
} from '@/hooks/use-api';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const NIN_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  verified: { label: 'Verified', color: '#1E9E5C', bg: '#D1FAE5' },
  pending: { label: 'Pending review', color: '#E89B2C', bg: '#FEF3C7' },
  failed: { label: 'Failed', color: '#D54545', bg: '#FEE2E2' },
  not_submitted: { label: 'Not submitted', color: '#6B7280', bg: '#F5F5F0' },
};

const VERIF_BADGE: Record<
  LandlordRoleProfile['verificationStatus'],
  { label: string; color: string; bg: string }
> = {
  approved: { label: 'Approved', color: '#1E9E5C', bg: '#D1FAE5' },
  under_review: { label: 'Under review', color: '#E89B2C', bg: '#FEF3C7' },
  documents_submitted: { label: 'Submitted', color: '#E89B2C', bg: '#FEF3C7' },
  rejected: { label: 'Rejected', color: '#D54545', bg: '#FEE2E2' },
  unverified: { label: 'Unverified', color: '#6B7280', bg: '#F5F5F0' },
};

const STEP_LABEL: Record<string, string> = {
  profile: 'Profile details',
  nin: 'NIN submitted',
  ninVerified: 'NIN verified',
  employment: 'Employment & income',
  preferences: 'Move-in preferences',
  documents: 'Identity documents',
  bank: 'Bank account',
};

export default function Kyc() {
  const { data: user, isLoading: loadingUser } = useCurrentUser();
  const { data: status, isLoading: loadingStatus } = useOnboardingStatus();

  const isLandlord = user?.role === 'landlord';
  const ninStatus = user?.profile?.ninStatus ?? 'not_submitted';
  const ninBadge = NIN_BADGE[ninStatus] ?? NIN_BADGE.not_submitted;

  const landlordRP = isLandlord
    ? ((user?.roleProfile as LandlordRoleProfile | null) ?? null)
    : null;
  const verifStatus = landlordRP?.verificationStatus ?? 'unverified';
  const verifBadge = VERIF_BADGE[verifStatus];

  return (
    <View style={{ flex: 1, backgroundColor: '#FAF7F2' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />

      {/* Header */}
      <View
        style={{
          paddingTop: 56,
          paddingHorizontal: 20,
          paddingBottom: 14,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
        }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: '#F0EBE4',
          }}>
          <Ionicons name="arrow-back" size={20} color="#1A2332" />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: 'Geist_700Bold',
            color: '#1A2332',
            fontSize: 22,
            letterSpacing: -0.3,
          }}>
          KYC & Verification
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 18 }}
        showsVerticalScrollIndicator={false}>
        {/* Summary card */}
        <Animated.View entering={FadeInDown.delay(50).duration(400)}>
          <View
            style={{
              backgroundColor: '#1A2332',
              borderRadius: 20,
              padding: 22,
            }}>
            {loadingUser ? (
              <Skeleton
                style={{
                  height: 28,
                  width: 200,
                  borderRadius: 6,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                }}
              />
            ) : (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 8,
                  }}>
                  <Ionicons
                    name={status?.completed ? 'shield-checkmark' : 'shield-outline'}
                    size={22}
                    color={status?.completed ? '#1E9E5C' : '#F2A65A'}
                  />
                  <Text
                    style={{
                      fontFamily: 'Geist_700Bold',
                      color: 'white',
                      fontSize: 20,
                      letterSpacing: -0.3,
                    }}>
                    {status?.completed ? 'Fully verified' : 'Verification in progress'}
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: 'Geist_400Regular',
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: 13,
                    lineHeight: 18,
                  }}>
                  {status?.completed
                    ? 'Your account meets all verification requirements.'
                    : 'Complete the remaining steps below to unlock all features.'}
                </Text>
              </>
            )}
          </View>
        </Animated.View>

        {/* NIN */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <SectionLabel>NIN</SectionLabel>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#F0EBE4',
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}>
            <IconBox icon="card-outline" />
            <View style={{ flex: 1 }}>
              <Text
                style={{ fontFamily: 'Geist_600SemiBold', color: '#1A2332', fontSize: 14 }}>
                National ID Number
              </Text>
              <Text
                style={{
                  fontFamily: 'Geist_400Regular',
                  color: '#9CA3AF',
                  fontSize: 12,
                  marginTop: 2,
                }}>
                Required for both tenants and landlords
              </Text>
            </View>
            <Badge color={ninBadge.color} bg={ninBadge.bg} label={ninBadge.label} />
          </View>
        </Animated.View>

        {/* Landlord verification */}
        {isLandlord && (
          <Animated.View entering={FadeInDown.delay(150).duration(400)}>
            <SectionLabel>Landlord verification</SectionLabel>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                borderWidth: 1,
                borderColor: '#F0EBE4',
                gap: 0,
              }}>
              <Row
                icon="business-outline"
                title="Documents review"
                subtitle="CAC, proof of ownership"
                badge={
                  <Badge color={verifBadge.color} bg={verifBadge.bg} label={verifBadge.label} />
                }
              />
              <Row
                icon="card-outline"
                title="Bank account"
                subtitle={
                  landlordRP?.bankName && landlordRP?.bankAccountNumber
                    ? `${landlordRP.bankName} •••• ${landlordRP.bankAccountNumber.slice(-4)}`
                    : 'For rent payouts'
                }
                badge={
                  <Badge
                    color={landlordRP?.bankAccountNumber ? '#1E9E5C' : '#6B7280'}
                    bg={landlordRP?.bankAccountNumber ? '#D1FAE5' : '#F5F5F0'}
                    label={landlordRP?.bankAccountNumber ? 'Added' : 'Not added'}
                  />
                }
                isLast
              />
            </View>
          </Animated.View>
        )}

        {/* Onboarding checklist */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <SectionLabel>Onboarding checklist</SectionLabel>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#F0EBE4',
              padding: 16,
              gap: 12,
            }}>
            {loadingStatus && (
              <>
                <Skeleton style={{ height: 24, borderRadius: 6 }} />
                <Skeleton style={{ height: 24, borderRadius: 6 }} />
                <Skeleton style={{ height: 24, borderRadius: 6 }} />
              </>
            )}
            {!loadingStatus && status &&
              Object.entries(status.steps).map(([key, done]) => (
                <View
                  key={key}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}>
                  <Ionicons
                    name={done ? 'checkmark-circle' : 'ellipse-outline'}
                    size={18}
                    color={done ? '#1E9E5C' : '#C0BBC4'}
                  />
                  <Text
                    style={{
                      fontFamily: done ? 'Geist_500Medium' : 'Geist_400Regular',
                      color: done ? '#1A2332' : '#6B7280',
                      fontSize: 14,
                      flex: 1,
                    }}>
                    {STEP_LABEL[key] ?? key}
                  </Text>
                </View>
              ))}
          </View>
        </Animated.View>

        <Text
          style={{
            fontFamily: 'Geist_400Regular',
            color: '#9CA3AF',
            fontSize: 11,
            textAlign: 'center',
            marginTop: 4,
            paddingHorizontal: 30,
            lineHeight: 16,
          }}>
          Verification is handled by our team. You will be notified when your status changes.
        </Text>
      </ScrollView>
    </View>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        fontFamily: 'Geist_600SemiBold',
        color: '#9CA3AF',
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
      }}>
      {children}
    </Text>
  );
}

function IconBox({ icon }: { icon: IconName }) {
  return (
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F0FAF9',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Ionicons name={icon} size={20} color="#0E7C7B" />
    </View>
  );
}

function Badge({ color, bg, label }: { color: string; bg: string; label: string }) {
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
        backgroundColor: bg,
      }}>
      <Text style={{ fontFamily: 'Geist_600SemiBold', color, fontSize: 11 }}>{label}</Text>
    </View>
  );
}

function Row({
  icon,
  title,
  subtitle,
  badge,
  isLast,
}: {
  icon: IconName;
  title: string;
  subtitle: string;
  badge: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: '#F5F0EC',
      }}>
      <IconBox icon={icon} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: 'Geist_600SemiBold', color: '#1A2332', fontSize: 14 }}>
          {title}
        </Text>
        <Text
          style={{
            fontFamily: 'Geist_400Regular',
            color: '#9CA3AF',
            fontSize: 12,
            marginTop: 2,
          }}>
          {subtitle}
        </Text>
      </View>
      {badge}
    </View>
  );
}
