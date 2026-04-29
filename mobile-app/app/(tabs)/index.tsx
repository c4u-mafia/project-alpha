import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PropertyCard } from '../../components/property-card';

const { width } = Dimensions.get('window');

const MESSAGES = [
  { id: '1', name: 'Landlord Segun', text: '"The plumber is on his way..."', status: 'online' },
  { id: '2', name: 'Amina Bello (Owner)', text: '"Rental update for Oct..."', status: 'away' }
];

const SAVED_PROPS = [
  {
    id: '1',
    title: 'Penthouse in Lekki Phase 1',
    price: 'N3.5M',
    location: 'Lekki Phase 1, Lagos',
    beds: 3,
    baths: 3,
    sqft: '2,400 sqft',
    image: '',
  },
  {
    id: '2',
    title: 'Modern Flat, Victoria Island',
    price: 'N2.1M',
    location: 'Victoria Island, Lagos',
    beds: 2,
    baths: 2,
    sqft: '1,200 sqft',
    image: '',
  }
];

export default function DashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Top Header */}
        <View className="px-8 pt-8 pb-4 flex-row justify-between items-center">
          <TouchableOpacity className="p-2">
            <Text className="text-2xl">☰</Text>
          </TouchableOpacity>
          <Text className="text-[#006970] font-bold text-2xl italic">RentDirect</Text>
          <TouchableOpacity className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#006970] shadow-lg">
             <View className="flex-1 bg-neutral-200" />
          </TouchableOpacity>
        </View>

        {/* Current Lease Status Card */}
        <Animated.View 
          entering={FadeInDown.duration(800)}
          className="mx-8 bg-[#006970] rounded-[2.5rem] p-8 mt-6 overflow-hidden relative"
        >
          {/* Background circles for organic texture */}
          <View className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
          <View className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-white/5" />
          
          <Text className="text-white/60 font-bold text-[10px] uppercase tracking-[4px] mb-4">CURRENT LEASE STATUS</Text>
          <Text className="text-white text-5xl font-bold mb-2">34 days remaining</Text>
          <Text className="text-white/80 text-lg mb-8">Next payment due: Oct 15, 2023</Text>
          
          <View className="bg-white/10 p-6 rounded-[2rem] flex-row justify-between items-center backdrop-blur-xl border border-white/10">
             <View>
               <Text className="text-white/60 text-[10px] font-bold tracking-widest uppercase mb-1">MONTHLY RENT</Text>
               <Text className="text-white text-2xl font-bold">N450,000</Text>
             </View>
             <TouchableOpacity className="bg-white px-6 py-3.5 rounded-full shadow-lg shadow-black/10">
                <Text className="text-[#006970] font-bold tracking-widest uppercase text-xs">Pay Rent Securely</Text>
             </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Active Messages Horizontal Scroll */}
        <View className="mt-12">
          <View className="px-8 flex-row justify-between items-center mb-6">
            <Text className="text-3xl font-bold text-[#111827]">Active Messages</Text>
            <TouchableOpacity>
              <Text className="text-[#006970] font-bold text-[10px] tracking-widest uppercase">VIEW ALL</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 32, paddingRight: 32 }}>
            {MESSAGES.map((msg, index) => (
              <Animated.View 
                key={msg.id}
                entering={FadeInRight.delay(index * 200).duration(600)}
                className="bg-white p-6 rounded-[2.5rem] mr-4 flex-row items-center w-72 shadow-sm border border-neutral-100"
              >
                <View className="h-16 w-16 bg-neutral-200 rounded-2xl mr-4 overflow-hidden relative">
                   {/* Avatar mask */}
                   <View className="flex-1 bg-neutral-200" />
                   {msg.status === 'online' && (
                     <View className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                   )}
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-[#111827] mb-1">{msg.name}</Text>
                  <Text className="text-neutral-500 text-xs italic truncate" numberOfLines={1}>{msg.text}</Text>
                </View>
                <View className="w-10 h-10 bg-[#F3F4F5] rounded-xl items-center justify-center">
                  <Text>💬</Text>
                </View>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* Saved Properties Local View */}
        <View className="px-8 mt-12">
          <View className="flex-row justify-between items-center mb-8">
            <Text className="text-3xl font-bold text-[#111827]">Saved Properties</Text>
            <View className="flex-row gap-4">
              <TouchableOpacity className="p-2">
                <Text className="text-2xl">⬛</Text>
              </TouchableOpacity>
              <TouchableOpacity className="p-2">
                <Text className="text-2xl text-[#006970]">❤️</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {SAVED_PROPS.map((item, index) => (
             <PropertyCard key={item.id} {...item} index={index} tag={`${item.price}/yr`} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
