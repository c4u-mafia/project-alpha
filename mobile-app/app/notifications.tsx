import React from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  type NotificationItem,
} from '@/hooks/use-api';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const NOTIF_CONFIG: Record<string, { icon: IconName; color: string; bg: string }> = {
  application_submitted: { icon: 'document-text-outline', color: '#0E7C7B', bg: '#F0FAF9' },
  application_approved: { icon: 'checkmark-circle-outline', color: '#1E9E5C', bg: '#D1FAE5' },
  application_declined: { icon: 'close-circle-outline', color: '#D54545', bg: '#FEE2E2' },
  payment_received: { icon: 'card-outline', color: '#1E9E5C', bg: '#D1FAE5' },
  payment_initialized: { icon: 'card-outline', color: '#0E7C7B', bg: '#F0FAF9' },
  viewing_booked: { icon: 'calendar-outline', color: '#F2A65A', bg: '#FFE4D4' },
  viewing_confirmed: { icon: 'calendar-outline', color: '#F2A65A', bg: '#FFE4D4' },
  viewing_cancelled: { icon: 'calendar-outline', color: '#D54545', bg: '#FEE2E2' },
  tenancy_created: { icon: 'home-outline', color: '#0E7C7B', bg: '#F0FAF9' },
  lease_ready_to_sign: { icon: 'document-text-outline', color: '#F2A65A', bg: '#FFE4D4' },
  rent_due_soon: { icon: 'time-outline', color: '#E89B2C', bg: '#FEF3C7' },
  rent_overdue: { icon: 'alert-circle-outline', color: '#D54545', bg: '#FEE2E2' },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-NG', { day: '2-digit', month: 'short' });
}

export default function Notifications() {
  const { data, isLoading, isError, refetch } = useNotifications(1, 30);
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  const items = data?.data ?? [];
  const unreadCount = items.filter((n) => !n.readAt).length;

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
          gap: 12,
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
            Notifications
          </Text>
          {!isLoading && (
            <Text
              style={{
                fontFamily: 'Geist_400Regular',
                color: '#9CA3AF',
                fontSize: 13,
                marginTop: 1,
              }}>
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </Text>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={() => markAll.mutate()}
            disabled={markAll.isPending}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 10,
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: '#F0EBE4',
            }}>
            <Text style={{ fontFamily: 'Geist_600SemiBold', color: '#0E7C7B', fontSize: 12 }}>
              Mark all read
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 10 }}
        showsVerticalScrollIndicator={false}>
        {isLoading && (
          <>
            <Skeleton style={{ height: 72, borderRadius: 14 }} />
            <Skeleton style={{ height: 72, borderRadius: 14 }} />
            <Skeleton style={{ height: 72, borderRadius: 14 }} />
            <Skeleton style={{ height: 72, borderRadius: 14 }} />
          </>
        )}

        {isError && (
          <View style={{ alignItems: 'center', paddingVertical: 60 }}>
            <Ionicons name="cloud-offline-outline" size={40} color="#C0BBC4" />
            <Text
              style={{
                fontFamily: 'Geist_600SemiBold',
                color: '#1A2332',
                fontSize: 16,
                marginTop: 12,
              }}>
              {"Couldn't load notifications"}
            </Text>
            <TouchableOpacity onPress={() => refetch()} style={{ marginTop: 12 }}>
              <Text style={{ fontFamily: 'Geist_600SemiBold', color: '#0E7C7B', fontSize: 14 }}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {!isLoading && !isError && items.length === 0 && (
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
              <Ionicons name="notifications-outline" size={36} color="#0E7C7B" />
            </View>
            <Text
              style={{
                fontFamily: 'Geist_700Bold',
                color: '#1A2332',
                fontSize: 18,
                textAlign: 'center',
              }}>
              No notifications yet
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
              We&apos;ll let you know when something happens.
            </Text>
          </View>
        )}

        {!isLoading &&
          !isError &&
          items.map((notif, i) => (
            <NotifRow
              key={notif.id}
              notif={notif}
              index={i}
              onPress={() => !notif.readAt && markRead.mutate(notif.id)}
            />
          ))}
      </ScrollView>
    </View>
  );
}

function NotifRow({
  notif,
  index,
  onPress,
}: {
  notif: NotificationItem;
  index: number;
  onPress: () => void;
}) {
  const cfg = NOTIF_CONFIG[notif.type] ?? {
    icon: 'notifications-outline' as IconName,
    color: '#6B7280',
    bg: '#F5F5F0',
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 40).duration(350)}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 12,
          padding: 14,
          borderRadius: 14,
          backgroundColor: Boolean(notif.readAt) ? 'white' : '#F0FAF9',
          borderWidth: 1,
          borderColor: Boolean(notif.readAt) ? '#F0EBE4' : '#D4EDE6',
        }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: cfg.bg,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name={cfg.icon} size={20} color={cfg.color} />
        </View>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 8,
            }}>
            <Text
              style={{
                fontFamily: 'Geist_600SemiBold',
                color: '#1A2332',
                fontSize: 14,
                flex: 1,
              }}>
              {notif.title}
            </Text>
            <Text
              style={{
                fontFamily: 'Geist_400Regular',
                color: '#C0BBC4',
                fontSize: 11,
                marginTop: 1,
              }}>
              {timeAgo(notif.createdAt)}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: 'Geist_400Regular',
              color: '#6B7280',
              fontSize: 13,
              marginTop: 4,
              lineHeight: 18,
            }}>
            {notif.body}
          </Text>
        </View>
        {!notif.readAt && (
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: '#0E7C7B',
              marginTop: 6,
            }}
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}
