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
  { id: '1', title: 'Skyline Penthouse', location: 'Banana Island', price: 'N12M', tag: 'OCCUPIED' },
  { id: '2', title: 'Urban Studio', location: 'Lekki Phase 1', price: 'N3.5M', tag: 'VACANT' },
  { id: '3', title: 'Eco-Smart Duplex', location: 'Gwarinpa', price: 'N7.2M', tag: 'OCCUPIED' }
];

export default function LandlordDashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="px-8 pt-8 pb-4 flex-row justify-between items-center">
          <View>
            <Heading size="2xl" className="text-typography-900">Welcome, Chidi</Heading>
          </View>
          <Avatar size="md" className="bg-primary-500 shadow-sm border-2 border-background-0">
            <AvatarFallbackText className="text-typography-0">C</AvatarFallbackText>
          </Avatar>
        </View>

        {/* Revenue - Premium */}
        <Animated.View 
          entering={FadeInDown.duration(600)}
          className="mx-8 bg-primary-500 rounded-[32px] p-6 mt-4 shadow-lg shadow-primary-500/30"
        >
          <Text size="xs" className="text-typography-0/70 uppercase tracking-widest font-bold mb-2">Revenue</Text>
          <Heading size="3xl" className="text-typography-0 mb-6 leading-tight">N5.8M</Heading>
          <View className="flex-row gap-8 bg-primary-600/50 px-5 py-4 rounded-2xl border border-primary-400/30">
            <View>
              <Text size="xs" className="text-typography-0/70 uppercase tracking-wider font-bold mb-1">Listings</Text>
              <Text size="xl" className="text-typography-0 font-bold">14</Text>
            </View>
            <View className="w-[1px] h-full bg-primary-400/30" />
            <View>
              <Text size="xs" className="text-typography-0/70 uppercase tracking-wider font-bold mb-1">Inquiries</Text>
              <Text size="xl" className="text-typography-0 font-bold">38</Text>
            </View>
          </View>
        </Animated.View>

        {/* Properties List */}
        <View className="mx-8 mt-10">
          <View className="flex-row justify-between items-center mb-6">
            <Heading size="xl" className="text-typography-900">My Properties</Heading>
            <View className="bg-primary-50 px-3 py-1.5 rounded-full border border-primary-100">
              <Text className="text-primary-600 font-bold text-[10px] tracking-widest uppercase">{MY_PROPERTIES.length} LISTED</Text>
            </View>
          </View>
          
          {MY_PROPERTIES.map((prop, index) => (
             <Animated.View 
                key={prop.id}
                entering={FadeInDown.delay(index * 100).duration(400)}
                className="bg-background-50 p-4 rounded-3xl mb-4 flex-row items-center border border-outline-100 shadow-sm"
             >
                <View className="w-16 h-16 bg-primary-100 rounded-2xl items-center justify-center mr-4">
                   <Text size="2xs" className="text-primary-600 font-bold uppercase">{prop.tag === 'VACANT' ? 'OPEN' : 'RENT'}</Text>
                </View>
                <View className="flex-1">
                   <Text size="sm" className="text-typography-900 font-bold mb-1">{prop.title}</Text>
                   <Text size="xs" className="text-typography-500">{prop.location}</Text>
                </View>
                <Text size="sm" className="text-primary-500 font-bold">{prop.price}</Text>
             </Animated.View>
          ))}
        </View>

        {/* Sign Out - Upgraded */}
        <View className="mx-8 mt-10 mb-6">
           <Button 
             size="lg"
             variant="outline" 
             action="negative" 
             className="rounded-2xl border-error-200 bg-error-50"
             onPress={async () => {
               await authClient.signOut();
               router.replace('/login');
             }}
           >
             <ButtonText className="text-error-600 font-bold text-sm tracking-wide">Sign Out</ButtonText>
           </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
