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
  { id: '2', name: 'Amina', text: 'Rental update for Oct...', status: 'away' }
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
  }
];

export default function DashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="px-8 pt-8 pb-4 flex-row justify-between items-center">
          <View>
            <Heading size="2xl" className="text-primary-500 italic font-bold">Homelyn</Heading>
          </View>
          <Avatar size="md" className="bg-primary-500 shadow-sm border-2 border-background-0">
            <AvatarFallbackText className="text-typography-0">JD</AvatarFallbackText>
          </Avatar>
        </View>

        {/* Lease Card - Premium */}
        <Animated.View 
          entering={FadeInDown.duration(600)}
          className="mx-8 bg-primary-500 rounded-[32px] p-6 mt-4 shadow-lg shadow-primary-500/30 overflow-hidden"
        >
          <Text size="xs" className="text-typography-0/70 font-bold uppercase tracking-widest mb-2">Lease Status</Text>
          <Heading size="3xl" className="text-typography-0 leading-tight mb-1">34 days left</Heading>
          <Text size="sm" className="text-typography-0/80 mb-6 font-medium">Due: Oct 15</Text>
          
          <View className="bg-primary-600/50 px-5 py-4 rounded-2xl flex-row justify-between items-center border border-primary-400/30">
             <View>
               <Text size="xs" className="text-typography-0/70 uppercase tracking-wider font-bold mb-1">Rent</Text>
               <Heading size="xl" className="text-typography-0">N450K</Heading>
             </View>
             <Button size="sm" className="bg-typography-0 rounded-xl px-6">
                <ButtonText className="text-primary-500 font-bold uppercase tracking-wide">Pay</ButtonText>
             </Button>
          </View>
        </Animated.View>

        {/* Messages */}
        <View className="mt-10 px-8">
          <View className="flex-row justify-between items-end mb-6">
            <Heading size="xl" className="text-typography-900">Messages</Heading>
            <TouchableOpacity>
              <Text size="sm" className="text-primary-500 font-bold">See all</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 32 }} className="gap-4">
            {MESSAGES.map((msg, index) => (
              <Animated.View 
                key={msg.id}
                entering={FadeInRight.delay(index * 100).duration(400)}
                className="bg-background-50 p-4 rounded-3xl mr-4 flex-row items-center w-72 border border-outline-100 shadow-sm"
              >
                <Avatar size="md" className="bg-primary-100 mr-4">
                  <AvatarFallbackText className="text-primary-700 font-bold">{msg.name[0]}</AvatarFallbackText>
                </Avatar>
                <View className="flex-1">
                  <Text size="sm" className="text-typography-900 font-bold mb-1">{msg.name}</Text>
                  <Text size="xs" className="text-typography-500 italic truncate">{msg.text}</Text>
                </View>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* Saved Properties */}
        <View className="mt-10 px-8">
          <View className="flex-row justify-between items-end mb-6">
            <Heading size="xl" className="text-typography-900">Saved</Heading>
            <View className="bg-primary-50 px-3 py-1.5 rounded-full border border-primary-100">
              <Text className="text-primary-600 font-bold text-[10px] tracking-widest uppercase">{SAVED_PROPS.length} ITEMS</Text>
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
