import React from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useCurrentUser,
  useMyApplications,
  useLandlordApplications,
  type ApplicationRecord,
} from '@/hooks/use-api';

const formatNaira = (kobo: number) => `₦${(kobo / 100).toLocaleString('en-NG')}`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  submitted: { label: 'Submitted', color: '#0E7C7B', bg: '#F0FAF9' },
  under_review: { label: 'Under review', color: '#E89B2C', bg: '#FEF3C7' },
  approved: { label: 'Approved', color: '#1E9E5C', bg: '#D1FAE5' },
  declined: { label: 'Declined', color: '#D54545', bg: '#FEE2E2' },
  withdrawn: { label: 'Withdrawn', color: '#6B7280', bg: '#F5F5F0' },
};

export default function Applications() {
  const { data: user } = useCurrentUser();
  const isLandlord = user?.role === 'landlord';

  const tenantQuery = useMyApplications();
  const landlordQuery = useLandlordApplications();
  const query = isLandlord ? landlordQuery : tenantQuery;

  const items = query.data ?? [];

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
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: 'Geist_700Bold',
              color: '#1A2332',
              fontSize: 22,
              letterSpacing: -0.3,
            }}>
            {isLandlord ? 'Applications' : 'My Applications'}
          </Text>
          {!query.isLoading && (
            <Text
              style={{
                fontFamily: 'Geist_400Regular',
                color: '#9CA3AF',
                fontSize: 13,
                marginTop: 1,
              }}>
              {items.length} {items.length === 1 ? 'application' : 'applications'}
            </Text>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 12 }}
        showsVerticalScrollIndicator={false}>
        {query.isLoading && (
          <>
            <Skeleton style={{ height: 140, borderRadius: 16 }} />
            <Skeleton style={{ height: 140, borderRadius: 16 }} />
            <Skeleton style={{ height: 140, borderRadius: 16 }} />
          </>
        )}

        {query.isError && (
          <View style={{ alignItems: 'center', paddingVertical: 60 }}>
            <Ionicons name="cloud-offline-outline" size={40} color="#C0BBC4" />
            <Text
              style={{
                fontFamily: 'Geist_600SemiBold',
                color: '#1A2332',
                fontSize: 16,
                marginTop: 12,
              }}>
              {"Couldn't load applications"}
            </Text>
            <TouchableOpacity onPress={() => query.refetch()} style={{ marginTop: 12 }}>
              <Text
                style={{ fontFamily: 'Geist_600SemiBold', color: '#0E7C7B', fontSize: 14 }}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {!query.isLoading && !query.isError && items.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 60 }}>
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
              <Ionicons name="document-text-outline" size={36} color="#0E7C7B" />
            </View>
            <Text
              style={{
                fontFamily: 'Geist_700Bold',
                color: '#1A2332',
                fontSize: 18,
                textAlign: 'center',
              }}>
              {isLandlord ? 'No applications yet' : 'No applications submitted'}
            </Text>
            <Text
              style={{
                fontFamily: 'Geist_400Regular',
                color: '#9CA3AF',
                fontSize: 14,
                textAlign: 'center',
                marginTop: 8,
                paddingHorizontal: 40,
                lineHeight: 20,
              }}>
              {isLandlord
                ? 'Tenants who apply to your properties will appear here.'
                : 'After a viewing, apply for the property and your status will show up here.'}
            </Text>
          </View>
        )}

        {!query.isLoading &&
          !query.isError &&
          items.map((app, i) => (
            <Animated.View key={app.id} entering={FadeInDown.delay(i * 50).duration(350)}>
              <ApplicationCard app={app} isLandlord={isLandlord} />
            </Animated.View>
          ))}
      </ScrollView>
    </View>
  );
}

function ApplicationCard({
  app,
  isLandlord,
}: {
  app: ApplicationRecord;
  isLandlord: boolean;
}) {
  const status = STATUS[app.status] ?? STATUS.submitted;
  const title = app.property?.title ?? 'Property';
  const area = app.property?.area
    ? `${app.property.area}, ${app.property.city ?? ''}`
    : '—';

  return (
    <View
      style={{
        padding: 16,
        borderRadius: 16,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#F0EBE4',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 8,
        }}>
        <View style={{ flex: 1 }}>
          <Text
            style={{ fontFamily: 'Geist_700Bold', color: '#1A2332', fontSize: 15 }}
            numberOfLines={1}>
            {title}
          </Text>
          <View
            style={{
              marginTop: 4,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}>
            <Ionicons name="location-outline" size={12} color="#9CA3AF" />
            <Text style={{ fontFamily: 'Geist_400Regular', color: '#9CA3AF', fontSize: 12 }}>
              {area}
            </Text>
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 999,
            backgroundColor: status.bg,
          }}>
          <Text
            style={{ fontFamily: 'Geist_600SemiBold', color: status.color, fontSize: 12 }}>
            {status.label}
          </Text>
        </View>
      </View>

      <View
        style={{
          marginTop: 14,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Detail label="Move-in" value={formatDate(app.moveInDate ?? app.createdAt)} />
        {app.property?.annualRent != null && (
          <Detail label="Annual rent" value={formatNaira(app.property.annualRent)} />
        )}
        <Detail label="Applied" value={formatDate(app.createdAt)} />
      </View>

      {(app.landlordNote || app.personalMessage) && (
        <View
          style={{
            marginTop: 12,
            padding: 10,
            borderRadius: 10,
            backgroundColor: '#FAF7F2',
          }}>
          <Text
            style={{
              fontFamily: 'Geist_500Medium',
              color: '#9CA3AF',
              fontSize: 11,
              marginBottom: 2,
            }}>
            {app.landlordNote ? 'Landlord note' : 'Your message'}
          </Text>
          <Text
            style={{
              fontFamily: 'Geist_400Regular',
              color: '#6B7280',
              fontSize: 12,
              fontStyle: 'italic',
            }}>
            {app.landlordNote ?? app.personalMessage}
          </Text>
        </View>
      )}

      {isLandlord && app.status === 'submitted' && (
        <View style={{ marginTop: 14, flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              height: 40,
              borderRadius: 10,
              backgroundColor: '#0E7C7B',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{ fontFamily: 'Geist_600SemiBold', color: 'white', fontSize: 13 }}>
              Approve
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              height: 40,
              borderRadius: 10,
              backgroundColor: '#FEF2F2',
              borderWidth: 1,
              borderColor: '#FCA5A5',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{ fontFamily: 'Geist_600SemiBold', color: '#D54545', fontSize: 13 }}>
              Decline
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text
        style={{
          fontFamily: 'Geist_400Regular',
          color: '#9CA3AF',
          fontSize: 11,
          marginBottom: 1,
        }}>
        {label}
      </Text>
      <Text style={{ fontFamily: 'Geist_600SemiBold', color: '#1A2332', fontSize: 13 }}>
        {value}
      </Text>
    </View>
  );
}
