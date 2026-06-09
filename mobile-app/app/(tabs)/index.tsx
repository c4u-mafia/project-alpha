import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PropertyCard } from '../../components/property-card';
import { Heading } from '../../components/ui/heading';
import { Text } from '../../components/ui/text';
import { Avatar, AvatarFallbackText } from '../../components/ui/avatar';
import { Button, ButtonText } from '../../components/ui/button';

const MESSAGES = [
  { id: '1', name: 'Segun', text: 'Plumber is on his way...', status: 'online' },
  { id: '2', name: 'Amina', text: 'Rental update for Oct...', status: 'away' },
];

const SAVED_PROPS = [
  {
    id: '1',
    title: 'Penthouse Lekki Phase 1',
    price: 'N3.5M',
    location: 'Lekki Phase 1, Lagos',
    beds: 3,
    baths: 3,
    image: '',
  },
  {
    id: '2',
    title: 'Modern Flat VI',
    price: 'N2.1M',
    location: 'Victoria Island, Lagos',
    beds: 2,
    baths: 2,
    image: '',
  },
];

export default function DashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-8 pb-4 pt-8">
          <View>
            <Heading size="2xl" className="font-bold italic text-primary-500">
              Homelyn
            </Heading>
          </View>
          <Avatar size="md" className="border-2 border-background-0 bg-primary-500 shadow-sm">
            <AvatarFallbackText className="text-typography-0">JD</AvatarFallbackText>
          </Avatar>
        </View>

        {/* Lease Card - Premium */}
        <Animated.View
          entering={FadeInDown.duration(600)}
          className="mx-8 mt-4 overflow-hidden rounded-[32px] bg-primary-500 p-6 shadow-lg shadow-primary-500/30">
          <Text size="xs" className="mb-2 font-bold uppercase tracking-widest text-typography-0/70">
            Lease Status
          </Text>
          <Heading size="3xl" className="mb-1 leading-tight text-typography-0">
            34 days left
          </Heading>
          <Text size="sm" className="mb-6 font-medium text-typography-0/80">
            Due: Oct 15
          </Text>

          <View className="flex-row items-center justify-between rounded-2xl border border-primary-400/30 bg-primary-600/50 px-5 py-4">
            <View>
              <Text
                size="xs"
                className="mb-1 font-bold uppercase tracking-wider text-typography-0/70">
                Rent
              </Text>
              <Heading size="xl" className="text-typography-0">
                N450K
              </Heading>
            </View>
            <Button size="sm" className="rounded-xl bg-typography-0 px-6">
              <ButtonText className="font-bold uppercase tracking-wide text-primary-500">
                Pay
              </ButtonText>
            </Button>
          </View>
        </Animated.View>

        {/* Messages */}
        <View className="mt-10 px-8">
          <View className="mb-6 flex-row items-end justify-between">
            <Heading size="xl" className="text-typography-900">
              Messages
            </Heading>
            <TouchableOpacity>
              <Text size="sm" className="font-bold text-primary-500">
                See all
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 32 }}
            className="gap-4">
            {MESSAGES.map((msg, index) => (
              <Animated.View
                key={msg.id}
                entering={FadeInRight.delay(index * 100).duration(400)}
                className="mr-4 w-72 flex-row items-center rounded-3xl border border-outline-100 bg-background-50 p-4 shadow-sm">
                <Avatar size="md" className="mr-4 bg-primary-100">
                  <AvatarFallbackText className="font-bold text-primary-700">
                    {msg.name[0]}
                  </AvatarFallbackText>
                </Avatar>
                <View className="flex-1">
                  <Text size="sm" className="mb-1 font-bold text-typography-900">
                    {msg.name}
                  </Text>
                  <Text size="xs" className="truncate italic text-typography-500">
                    {msg.text}
                  </Text>
                </View>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* Saved Properties */}
        <View className="mt-10 px-8">
          <View className="mb-6 flex-row items-end justify-between">
            <Heading size="xl" className="text-typography-900">
              Saved
            </Heading>
            <View className="rounded-full border border-primary-100 bg-primary-50 px-3 py-1.5">
              <Text className="text-[10px] font-bold uppercase tracking-widest text-primary-600">
                {SAVED_PROPS.length} ITEMS
              </Text>
            </View>
          </View>

          {SAVED_PROPS.map((item, index) => (
            <PropertyCard key={item.id} {...item} index={index} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
