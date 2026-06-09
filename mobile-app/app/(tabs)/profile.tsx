import React from 'react';
import { View, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authClient } from '../../lib/auth-client';
import { router } from 'expo-router';
import { Heading } from '../../components/ui/heading';
import { Text } from '../../components/ui/text';
import { Button, ButtonText } from '../../components/ui/button';
import { Avatar, AvatarFallbackText } from '../../components/ui/avatar';

const MY_PROPERTIES = [
  {
    id: '1',
    title: 'Skyline Penthouse',
    location: 'Banana Island',
    price: 'N12M',
    tag: 'OCCUPIED',
  },
  { id: '2', title: 'Urban Studio', location: 'Lekki Phase 1', price: 'N3.5M', tag: 'VACANT' },
  { id: '3', title: 'Eco-Smart Duplex', location: 'Gwarinpa', price: 'N7.2M', tag: 'OCCUPIED' },
];

export default function LandlordDashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-8 pb-4 pt-8">
          <View>
            <Heading size="2xl" className="text-typography-900">
              Welcome, Chidi
            </Heading>
          </View>
          <Avatar size="md" className="border-2 border-background-0 bg-primary-500 shadow-sm">
            <AvatarFallbackText className="text-typography-0">C</AvatarFallbackText>
          </Avatar>
        </View>

        {/* Revenue - Premium */}
        <Animated.View
          entering={FadeInDown.duration(600)}
          className="mx-8 mt-4 rounded-[32px] bg-primary-500 p-6 shadow-lg shadow-primary-500/30">
          <Text size="xs" className="mb-2 font-bold uppercase tracking-widest text-typography-0/70">
            Revenue
          </Text>
          <Heading size="3xl" className="mb-6 leading-tight text-typography-0">
            N5.8M
          </Heading>
          <View className="flex-row gap-8 rounded-2xl border border-primary-400/30 bg-primary-600/50 px-5 py-4">
            <View>
              <Text
                size="xs"
                className="mb-1 font-bold uppercase tracking-wider text-typography-0/70">
                Listings
              </Text>
              <Text size="xl" className="font-bold text-typography-0">
                14
              </Text>
            </View>
            <View className="h-full w-[1px] bg-primary-400/30" />
            <View>
              <Text
                size="xs"
                className="mb-1 font-bold uppercase tracking-wider text-typography-0/70">
                Inquiries
              </Text>
              <Text size="xl" className="font-bold text-typography-0">
                38
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Properties List */}
        <View className="mx-8 mt-10">
          <View className="mb-6 flex-row items-center justify-between">
            <Heading size="xl" className="text-typography-900">
              My Properties
            </Heading>
            <View className="rounded-full border border-primary-100 bg-primary-50 px-3 py-1.5">
              <Text className="text-[10px] font-bold uppercase tracking-widest text-primary-600">
                {MY_PROPERTIES.length} LISTED
              </Text>
            </View>
          </View>

          {MY_PROPERTIES.map((prop, index) => (
            <Animated.View
              key={prop.id}
              entering={FadeInDown.delay(index * 100).duration(400)}
              className="mb-4 flex-row items-center rounded-3xl border border-outline-100 bg-background-50 p-4 shadow-sm">
              <View className="mr-4 h-16 w-16 items-center justify-center rounded-2xl bg-primary-100">
                <Text size="2xs" className="font-bold uppercase text-primary-600">
                  {prop.tag === 'VACANT' ? 'OPEN' : 'RENT'}
                </Text>
              </View>
              <View className="flex-1">
                <Text size="sm" className="mb-1 font-bold text-typography-900">
                  {prop.title}
                </Text>
                <Text size="xs" className="text-typography-500">
                  {prop.location}
                </Text>
              </View>
              <Text size="sm" className="font-bold text-primary-500">
                {prop.price}
              </Text>
            </Animated.View>
          ))}
        </View>

        {/* Sign Out - Upgraded */}
        <View className="mx-8 mb-6 mt-10">
          <Button
            size="lg"
            variant="outline"
            action="negative"
            className="rounded-2xl border-error-200 bg-error-50"
            onPress={async () => {
              await authClient.signOut();
              router.replace('/login');
            }}>
            <ButtonText className="text-sm font-bold tracking-wide text-error-600">
              Sign Out
            </ButtonText>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
