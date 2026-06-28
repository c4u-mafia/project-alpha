import React, { useState, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useCurrentUser,
  useMyViewings,
  useLandlordViewingRequests,
  useCancelViewing,
  type ViewingRequestRecord,
} from '@/hooks/use-api';

type Filter = 'upcoming' | 'past';

const STATUS: Record<
  ViewingRequestRecord['status'],
  { label: string; color: string; bg: string }
> = {
  pending: { label: 'Pending', color: '#E89B2C', bg: '#FEF3C7' },
  confirmed: { label: 'Confirmed', color: '#1E9E5C', bg: '#D1FAE5' },
  completed: { label: 'Completed', color: '#0E7C7B', bg: '#F0FAF9' },
  cancelled: { label: 'Cancelled', color: '#D54545', bg: '#FEE2E2' },
  no_show: { label: 'No-show', color: '#6B7280', bg: '#F5F5F0' },
};

function formatScheduled(iso: string | null) {
  if (!iso) return 'Time not set';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-NG', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Viewings() {
  const [filter, setFilter] = useState<Filter>('upcoming');

  const { data: user } = useCurrentUser();
  const isLandlord = user?.role === 'landlord';

  const tenantQuery = useMyViewings();
  const landlordQuery = useLandlordViewingRequests();
  const query = isLandlord ? landlordQuery : tenantQuery;
  const cancel = useCancelViewing();

  const items = query.data ?? [];

  const { upcoming, past } = useMemo(() => {
    const now = Date.now();
    const up: ViewingRequestRecord[] = [];
    const pa: ViewingRequestRecord[] = [];
    for (const v of items) {
      const time = v.scheduledFor ? new Date(v.scheduledFor).getTime() : NaN;
      const isFinal =
        v.status === 'cancelled' || v.status === 'completed' || v.status === 'no_show';
      if (isFinal || (Number.isFinite(time) && time < now)) pa.push(v);
      else up.push(v);
    }
    return { upcoming: up, past: pa };
  }, [items]);

  const visible = filter === 'upcoming' ? upcoming : past;

  const onCancel = (id: string) => {
    Alert.alert('Cancel viewing', 'Are you sure you want to cancel this viewing?', [
      { text: 'Keep it', style: 'cancel' },
      {
        text: 'Cancel viewing',
        style: 'destructive',
        onPress: () =>
          cancel.mutate(id, {
            onError: (e: Error) => Alert.alert('Could not cancel', e.message),
          }),
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FAF7F2' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />

      {/* Header */}
      <View
        style={{
          paddingTop: 56,
          paddingHorizontal: 20,
          paddingBottom: 12,
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
          {isLandlord ? 'Viewing Requests' : 'My Viewings'}
        </Text>
      </View>

      {/* Tabs */}
      <View
        style={{
          paddingHorizontal: 20,
          marginBottom: 14,
          flexDirection: 'row',
          backgroundColor: 'white',
          marginHorizontal: 20,
          borderRadius: 12,
          padding: 4,
          borderWidth: 1,
          borderColor: '#F0EBE4',
        }}>
        {(['upcoming', 'past'] as const).map((f) => {
          const active = filter === f;
          const count = f === 'upcoming' ? upcoming.length : past.length;
          return (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
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
                  textTransform: 'capitalize',
                }}>
                {f} {!query.isLoading ? `(${count})` : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 12 }}
        showsVerticalScrollIndicator={false}>
        {query.isLoading && (
          <>
            <Skeleton style={{ height: 130, borderRadius: 16 }} />
            <Skeleton style={{ height: 130, borderRadius: 16 }} />
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
              {"Couldn't load viewings"}
            </Text>
            <TouchableOpacity onPress={() => query.refetch()} style={{ marginTop: 12 }}>
              <Text
                style={{ fontFamily: 'Geist_600SemiBold', color: '#0E7C7B', fontSize: 14 }}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {!query.isLoading && !query.isError && visible.length === 0 && (
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
              <Ionicons name="calendar-outline" size={36} color="#0E7C7B" />
            </View>
            <Text
              style={{
                fontFamily: 'Geist_700Bold',
                color: '#1A2332',
                fontSize: 18,
                textAlign: 'center',
              }}>
              {filter === 'upcoming' ? 'No upcoming viewings' : 'No past viewings'}
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
              {filter === 'upcoming'
                ? isLandlord
                  ? 'When a tenant requests a viewing on one of your properties, it will appear here.'
                  : 'Book a viewing from a listing to see it here.'
                : 'Past viewings will show up here once completed.'}
            </Text>
          </View>
        )}

        {!query.isLoading &&
          !query.isError &&
          visible.map((v, i) => (
            <Animated.View key={v.id} entering={FadeInDown.delay(i * 50).duration(350)}>
              <ViewingCard viewing={v} isLandlord={isLandlord} onCancel={onCancel} />
            </Animated.View>
          ))}
      </ScrollView>
    </View>
  );
}

function ViewingCard({
  viewing,
  isLandlord,
  onCancel,
}: {
  viewing: ViewingRequestRecord;
  isLandlord: boolean;
  onCancel: (id: string) => void;
}) {
  const status = STATUS[viewing.status] ?? STATUS.pending;
  const title = viewing.property?.title ?? 'Property';
  const area = viewing.property?.area
    ? `${viewing.property.area}, ${viewing.property.city ?? ''}`
    : '—';

  const canCancel = viewing.status === 'pending' || viewing.status === 'confirmed';

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
          padding: 12,
          borderRadius: 10,
          backgroundColor: '#FAF7F2',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}>
        <Ionicons name="time-outline" size={16} color="#0E7C7B" />
        <Text style={{ fontFamily: 'Geist_600SemiBold', color: '#1A2332', fontSize: 13 }}>
          {formatScheduled(viewing.scheduledFor)}
        </Text>
      </View>

      {viewing.addressRevealed && !isLandlord && (
        <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="checkmark-circle" size={14} color="#1E9E5C" />
          <Text style={{ fontFamily: 'Geist_500Medium', color: '#1E9E5C', fontSize: 12 }}>
            Full address revealed
          </Text>
        </View>
      )}

      {canCancel && (
        <TouchableOpacity
          onPress={() => onCancel(viewing.id)}
          style={{
            marginTop: 14,
            height: 40,
            borderRadius: 10,
            borderWidth: 1.5,
            borderColor: '#FCA5A5',
            backgroundColor: '#FEF2F2',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ fontFamily: 'Geist_600SemiBold', color: '#D54545', fontSize: 13 }}>
            Cancel viewing
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
