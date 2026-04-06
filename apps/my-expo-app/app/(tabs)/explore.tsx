import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { PropertyCard } from '../../components/property-card';
import { SafeAreaView } from 'react-native-safe-area-context';

const TOP_PICKS = [
  {
    id: '1',
    title: 'High-Rise Studio',
    location: 'Yaba, Lagos',
    price: 'N1.2M/yr',
    tag: 'NO AGENT',
    image: '',
  },
  {
    id: '2',
    title: 'Lekki Gardens',
    location: 'Lekki, Lagos',
    price: 'N2.5M/yr',
    tag: 'FEATURED',
    image: '',
  }
];

const RECENT_LISTS = [
  {
    id: '3',
    title: 'Modern Studio Apartment',
    owner: 'Chinedu O. (Owner)',
    beds: 1,
    tag: 'NEW',
    price: '3,200,000',
    location: 'Lekki Phase 1, Lagos',
    image: '',
  },
  {
    id: '4',
    title: 'Luxury Penthouse Suite',
    owner: 'Amina Bello (Owner)',
    beds: 3,
    tag: 'VERIFIED',
    price: '5,500,000',
    location: 'Banana Island, Ikoyi',
    image: '',
  }
];

export default function ExploreScreen() {
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]">
      <ScrollView stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="px-8 pt-8 pb-4 flex-row justify-between items-end">
          <View>
            <Text className="text-[#006970] font-bold text-3xl italic">RentDirect</Text>
            <Text className="text-neutral-400 font-bold text-[10px] uppercase tracking-[4px] mt-2">CURATED</Text>
          </View>
          <View className="flex-row items-center gap-4">
             <TouchableOpacity className="p-2">
               <Text className="text-2xl">☰</Text>
             </TouchableOpacity>
             <View className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
                <View className="flex-1 bg-[#006970]/20" />
             </View>
          </View>
        </View>

        {/* Search Bar - Stickyish */}
        <View className="bg-[#F8F9FA] px-8 py-4">
          <View className="flex-row items-center bg-[#F3F4F5] rounded-[2rem] px-6 h-16">
            <Text className="text-neutral-400 mr-4">🔍</Text>
            <TextInput 
              placeholder="Search areas, landmarks..." 
              value={search}
              onChangeText={setSearch}
              className="flex-1 font-medium text-lg"
              placeholderTextColor="#A3A3A3"
            />
            <View className="w-[1px] h-6 bg-neutral-200 mx-4" />
            <TouchableOpacity>
               <Text className="text-2xl">🎛</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Top Picks Horizontal Scroll */}
        <View className="mt-6 mb-10">
          <View className="px-8 flex-row justify-between items-end mb-6">
            <Text className="text-3xl font-bold text-[#111827]">Top Picks in Lagos</Text>
            <TouchableOpacity>
              <Text className="text-[#006970] font-bold">See all</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ paddingLeft: 32, paddingRight: 32 }}
          >
            {TOP_PICKS.map((item, index) => (
              <PropertyCard key={item.id} {...item} variant="horizontal" index={index} />
            ))}
          </ScrollView>
        </View>

        {/* Recent Listings Vertical Scroll */}
        <View className="px-8 pb-32">
          <View className="flex-row items-center justify-between mb-8">
            <Text className="text-3xl font-bold text-[#111827]">Recent Listings</Text>
            <View className="bg-[#006970]/10 px-4 py-2 rounded-full">
              <Text className="text-[#006970] font-bold text-[10px] tracking-widest uppercase">VERIFIED</Text>
            </View>
          </View>

          {RECENT_LISTS.map((item, index) => (
             <PropertyCard key={item.id} {...item} index={index} />
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        activeOpacity={0.9}
        className="absolute bottom-32 self-center bg-[#00535b] px-8 py-4 rounded-full flex-row items-center shadow-xl shadow-[#00535b]/40"
      >
        <Text className="mr-2">🗺</Text>
        <Text className="text-white font-bold tracking-widest uppercase text-xs">Map View</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
