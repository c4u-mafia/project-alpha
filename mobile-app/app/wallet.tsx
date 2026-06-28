import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useWallet,
  useCurrentUser,
  useTypedPaymentHistory,
  type WalletTransaction,
  type PaymentHistoryItem,
} from '@/hooks/use-api';

const formatNaira = (kobo: number) => `₦${(kobo / 100).toLocaleString('en-NG')}`;

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const PAYMENT_TYPE_LABEL: Record<string, string> = {
  rent_payment: 'Rent payment',
  wallet_funding: 'Wallet top-up',
  withdrawal: 'Withdrawal',
  sponsorship_contribution: 'Sponsorship',
  verification_fee: 'Verification fee',
  listing_boost: 'Listing boost',
  refund: 'Refund',
};

const STATUS_COLOR: Record<string, { color: string; bg: string; label: string }> = {
  pending: { color: '#E89B2C', bg: '#FEF3C7', label: 'Pending' },
  processing: { color: '#E89B2C', bg: '#FEF3C7', label: 'Processing' },
  completed: { color: '#1E9E5C', bg: '#D1FAE5', label: 'Completed' },
  failed: { color: '#D54545', bg: '#FEE2E2', label: 'Failed' },
  refunded: { color: '#6B7280', bg: '#F5F5F0', label: 'Refunded' },
};

export default function Wallet() {
  const [tab, setTab] = useState<'overview' | 'history'>('overview');
  const { data: user } = useCurrentUser();
  const { data: wallet, isLoading: walletLoading, isError: walletError, refetch } = useWallet();
  const { data: history, isLoading: historyLoading } = useTypedPaymentHistory(1, 30);

  const isLandlord = user?.role === 'landlord';
  const cta = isLandlord ? 'Withdraw' : 'Top Up';
  const ctaIcon: IconName = isLandlord ? 'arrow-up-circle-outline' : 'add-circle-outline';

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
          Wallet
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}>
        {/* Balance card */}
        <Animated.View entering={FadeInDown.delay(50).duration(400)} style={{ paddingHorizontal: 20 }}>
          <View
            style={{
              backgroundColor: '#0E7C7B',
              borderRadius: 20,
              padding: 22,
            }}>
            <Text
              style={{
                fontFamily: 'Geist_400Regular',
                color: 'rgba(255,255,255,0.65)',
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}>
              Available balance
            </Text>
            {walletLoading ? (
              <Skeleton
                style={{
                  height: 32,
                  width: 180,
                  borderRadius: 6,
                  marginTop: 8,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                }}
              />
            ) : walletError ? (
              <View style={{ marginTop: 8 }}>
                <Text style={{ fontFamily: 'Geist_700Bold', color: 'white', fontSize: 22 }}>
                  ₦—
                </Text>
                <TouchableOpacity onPress={() => refetch()}>
                  <Text
                    style={{ fontFamily: 'Geist_600SemiBold', color: 'white', fontSize: 12, marginTop: 4 }}>
                    Retry
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text
                style={{
                  fontFamily: 'Geist_700Bold',
                  color: 'white',
                  fontSize: 32,
                  marginTop: 4,
                  letterSpacing: -0.5,
                }}>
                {formatNaira(wallet?.balance ?? 0)}
              </Text>
            )}

            {!walletLoading && (wallet?.pendingBalance ?? 0) > 0 && (
              <View
                style={{
                  marginTop: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}>
                <Ionicons name="time-outline" size={14} color="#F2A65A" />
                <Text style={{ fontFamily: 'Geist_500Medium', color: '#F2A65A', fontSize: 12 }}>
                  {formatNaira(wallet?.pendingBalance ?? 0)} pending release
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={{
                marginTop: 18,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                height: 46,
                borderRadius: 12,
                backgroundColor: '#F2A65A',
              }}>
              <Ionicons name={ctaIcon} size={18} color="white" />
              <Text style={{ fontFamily: 'Geist_700Bold', color: 'white', fontSize: 14 }}>
                {cta}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Tab Selector */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={{ paddingHorizontal: 20, marginTop: 18 }}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 4,
              borderWidth: 1,
              borderColor: '#F0EBE4',
            }}>
            {(['overview', 'history'] as const).map((t) => {
              const active = tab === t;
              const label = t === 'overview' ? 'Recent activity' : 'All payments';
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => setTab(t)}
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
                    }}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {tab === 'overview' && (
          <View style={{ paddingHorizontal: 20, marginTop: 16, gap: 10 }}>
            {walletLoading && (
              <>
                <Skeleton style={{ height: 64, borderRadius: 12 }} />
                <Skeleton style={{ height: 64, borderRadius: 12 }} />
                <Skeleton style={{ height: 64, borderRadius: 12 }} />
              </>
            )}
            {!walletLoading && (wallet?.recentTransactions ?? []).length === 0 && (
              <EmptyState
                icon="wallet-outline"
                title="No transactions yet"
                subtitle="Top up or receive funds to see activity here."
              />
            )}
            {!walletLoading &&
              (wallet?.recentTransactions ?? []).map((tx, i) => (
                <TransactionRow key={tx.id} tx={tx} index={i} />
              ))}
          </View>
        )}

        {tab === 'history' && (
          <View style={{ paddingHorizontal: 20, marginTop: 16, gap: 10 }}>
            {historyLoading && (
              <>
                <Skeleton style={{ height: 72, borderRadius: 12 }} />
                <Skeleton style={{ height: 72, borderRadius: 12 }} />
                <Skeleton style={{ height: 72, borderRadius: 12 }} />
              </>
            )}
            {!historyLoading && (history?.data ?? []).length === 0 && (
              <EmptyState
                icon="receipt-outline"
                title="No payments yet"
                subtitle="Your payment history will appear here."
              />
            )}
            {!historyLoading &&
              (history?.data ?? []).map((p, i) => <PaymentRow key={p.id} item={p} index={i} />)}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function TransactionRow({ tx, index }: { tx: WalletTransaction; index: number }) {
  const isCredit = tx.type === 'credit';
  return (
    <Animated.View entering={FadeInDown.delay(index * 40).duration(300)}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          padding: 14,
          borderRadius: 12,
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: '#F0EBE4',
        }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: isCredit ? '#D1FAE5' : '#FEE2E2',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons
            name={isCredit ? 'arrow-down' : 'arrow-up'}
            size={18}
            color={isCredit ? '#1E9E5C' : '#D54545'}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{ fontFamily: 'Geist_600SemiBold', color: '#1A2332', fontSize: 14 }}
            numberOfLines={1}>
            {tx.description}
          </Text>
          <Text
            style={{
              fontFamily: 'Geist_400Regular',
              color: '#9CA3AF',
              fontSize: 12,
              marginTop: 2,
            }}>
            {formatDateTime(tx.createdAt)}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: 'Geist_700Bold',
            color: isCredit ? '#1E9E5C' : '#1A2332',
            fontSize: 14,
          }}>
          {isCredit ? '+' : '-'}
          {formatNaira(tx.amount)}
        </Text>
      </View>
    </Animated.View>
  );
}

function PaymentRow({ item, index }: { item: PaymentHistoryItem; index: number }) {
  const status = STATUS_COLOR[item.status] ?? STATUS_COLOR.pending;
  return (
    <Animated.View entering={FadeInDown.delay(index * 40).duration(300)}>
      <View
        style={{
          padding: 14,
          borderRadius: 12,
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: '#F0EBE4',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{ fontFamily: 'Geist_600SemiBold', color: '#1A2332', fontSize: 14 }}>
            {PAYMENT_TYPE_LABEL[item.type] ?? item.type}
          </Text>
          <Text
            style={{ fontFamily: 'Geist_700Bold', color: '#1A2332', fontSize: 15 }}>
            {formatNaira(item.amount)}
          </Text>
        </View>
        <View
          style={{
            marginTop: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{ fontFamily: 'Geist_400Regular', color: '#9CA3AF', fontSize: 12 }}>
            {formatDateTime(item.createdAt)}
          </Text>
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 999,
              backgroundColor: status.bg,
            }}>
            <Text
              style={{ fontFamily: 'Geist_600SemiBold', color: status.color, fontSize: 11 }}>
              {status.label}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

function EmptyState({
  icon,
  title,
  subtitle,
}: {
  icon: IconName;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 50 }}>
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 18,
          backgroundColor: '#F0FAF9',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 14,
        }}>
        <Ionicons name={icon} size={28} color="#0E7C7B" />
      </View>
      <Text style={{ fontFamily: 'Geist_700Bold', color: '#1A2332', fontSize: 16 }}>{title}</Text>
      <Text
        style={{
          fontFamily: 'Geist_400Regular',
          color: '#9CA3AF',
          fontSize: 13,
          marginTop: 6,
          textAlign: 'center',
          paddingHorizontal: 40,
          lineHeight: 18,
        }}>
        {subtitle}
      </Text>
    </View>
  );
}
