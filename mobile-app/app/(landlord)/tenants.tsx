import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import { RentHealthBar } from '@/components/rent-health-bar';

interface Tenant {
  id: string;
  name: string;
  email: string;
  property: string;
  area: string;
  startDate: string;
  endDate: string;
  annualRentKobo: number;
  healthPercentage: number;
  daysRemaining: number;
  paymentStatus: 'up_to_date' | 'overdue' | 'pending';
}

const MOCK_TENANTS: Tenant[] = [
  {
    id: 't1',
    name: 'Chioma Okafor',
    email: 'chioma@gmail.com',
    property: '3 Bed Flat, Admiralty Way',
    area: 'Lekki Phase 1',
    startDate: '2024-01-15',
    endDate: '2025-01-14',
    annualRentKobo: 280000000,
    healthPercentage: 38,
    daysRemaining: 37,
    paymentStatus: 'up_to_date',
  },
  {
    id: 't2',
    name: 'Emeka Dike',
    email: 'emeka.d@yahoo.com',
    property: 'Modern 2 Bed, Opebi',
    area: 'Ikeja',
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    annualRentKobo: 150000000,
    healthPercentage: 8,
    daysRemaining: 12,
    paymentStatus: 'overdue',
  },
  {
    id: 't3',
    name: 'Aisha Bello',
    email: 'aisha.b@gmail.com',
    property: 'Studio, Surulere',
    area: 'Surulere',
    startDate: '2023-12-01',
    endDate: '2024-11-30',
    annualRentKobo: 90000000,
    healthPercentage: 61,
    daysRemaining: 68,
    paymentStatus: 'up_to_date',
  },
];

const formatNaira = (kobo: number) => `₦${(kobo / 100).toLocaleString('en-NG')}`;

function getHealthColor(pct: number) {
  if (pct > 50) return '#1E9E5C';
  if (pct > 25) return '#E89B2C';
  if (pct > 10) return '#E2683C';
  return '#D54545';
}

export default function LandlordTenants() {
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  return (
    <View className="flex-1 bg-cream">
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />

      {/* Header */}
      <Animated.View entering={FadeInDown.delay(50).duration(500)} className="px-5 pb-5 pt-14">
        <Text
          style={{
            fontFamily: 'Geist_700Bold',
            color: '#1A2332',
            fontSize: 22,
            letterSpacing: -0.3,
          }}>
          My Tenants
        </Text>
        <Text
          style={{ fontFamily: 'Geist_400Regular', color: '#9CA3AF', fontSize: 13, marginTop: 1 }}>
          {MOCK_TENANTS.length} active tenancies
        </Text>
      </Animated.View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30, gap: 14 }}
        showsVerticalScrollIndicator={false}>
        {MOCK_TENANTS.map((tenant, i) => {
          const color = getHealthColor(tenant.healthPercentage);
          return (
            <Animated.View key={tenant.id} entering={FadeInDown.delay(i * 80).duration(400)}>
              <TouchableOpacity
                onPress={() => setSelectedTenant(tenant === selectedTenant ? null : tenant)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 18,
                  padding: 18,
                  borderWidth: 1,
                  borderColor: selectedTenant?.id === tenant.id ? '#0E7C7B' : '#F0EBE4',
                }}
                activeOpacity={0.85}>
                {/* Top row */}
                <View className="mb-4 flex-row items-start gap-3">
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      backgroundColor: '#F0FAF9',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={{ fontFamily: 'Geist_700Bold', color: '#0E7C7B', fontSize: 18 }}>
                      {tenant.name[0]}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between">
                      <Text
                        style={{ fontFamily: 'Geist_600SemiBold', color: '#1A2332', fontSize: 15 }}>
                        {tenant.name}
                      </Text>
                      {tenant.paymentStatus === 'overdue' && (
                        <View
                          style={{
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 999,
                            backgroundColor: '#FEE2E2',
                          }}>
                          <Text
                            style={{
                              fontFamily: 'Geist_600SemiBold',
                              color: '#D54545',
                              fontSize: 11,
                            }}>
                            Overdue
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text
                      style={{
                        fontFamily: 'Geist_400Regular',
                        color: '#9CA3AF',
                        fontSize: 12,
                        marginTop: 2,
                      }}>
                      {tenant.property}
                    </Text>
                  </View>
                </View>

                {/* Rent Health Bar */}
                <RentHealthBar percentage={tenant.healthPercentage} height={10} />

                {/* Stats */}
                <View className="mt-4 flex-row justify-between">
                  <View>
                    <Text
                      style={{ fontFamily: 'Geist_400Regular', color: '#9CA3AF', fontSize: 11 }}>
                      Days remaining
                    </Text>
                    <Text
                      style={{ fontFamily: 'Geist_700Bold', color, fontSize: 18, marginTop: 1 }}>
                      {tenant.daysRemaining}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{ fontFamily: 'Geist_400Regular', color: '#9CA3AF', fontSize: 11 }}>
                      Annual rent
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Geist_700Bold',
                        color: '#1A2332',
                        fontSize: 15,
                        marginTop: 1,
                      }}>
                      {formatNaira(tenant.annualRentKobo)}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{ fontFamily: 'Geist_400Regular', color: '#9CA3AF', fontSize: 11 }}>
                      Expires
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Geist_500Medium',
                        color: '#1A2332',
                        fontSize: 13,
                        marginTop: 1,
                      }}>
                      {tenant.endDate}
                    </Text>
                  </View>
                </View>

                {/* Expanded detail */}
                {selectedTenant?.id === tenant.id && (
                  <Animated.View
                    entering={FadeInDown.duration(300)}
                    style={{
                      marginTop: 16,
                      paddingTop: 16,
                      borderTopWidth: 1,
                      borderTopColor: '#F0EBE4',
                    }}>
                    <View className="flex-row gap-3">
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          height: 40,
                          borderRadius: 10,
                          backgroundColor: '#F0FAF9',
                          borderWidth: 1,
                          borderColor: '#D4EDE6',
                        }}>
                        <Ionicons name="mail-outline" size={16} color="#0E7C7B" />
                        <Text
                          style={{
                            fontFamily: 'Geist_600SemiBold',
                            color: '#0E7C7B',
                            fontSize: 13,
                          }}>
                          Message
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          height: 40,
                          borderRadius: 10,
                          backgroundColor: '#1A2332',
                        }}>
                        <Ionicons name="document-text-outline" size={16} color="white" />
                        <Text
                          style={{ fontFamily: 'Geist_600SemiBold', color: 'white', fontSize: 13 }}>
                          Lease
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}
