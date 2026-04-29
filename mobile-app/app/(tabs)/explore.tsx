import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PropertyCard } from '../../components/property-card';
import { Heading } from '../../components/ui/heading';
import { Text } from '../../components/ui/text';
import { Input, InputField, InputSlot } from '../../components/ui/input';
import { Avatar, AvatarFallbackText } from '../../components/ui/avatar';

const TOP_PICKS = [
  {
    id: '1',
    title: 'High-Rise Studio',
    location: 'Yaba, Lagos',
    price: 'N1.2M',
    tag: 'NO AGENT',
    image: '',
  },
  {
    id: '2',
    title: 'Lekki Gardens',
    location: 'Lekki, Lagos',
    price: 'N2.5M',
    tag: 'FEATURED',
    image: '',
  }
];

const RECENT_LISTS = [
  {
    id: '3',
    title: 'Modern Studio',
    owner: 'Chinedu O.',
    beds: 1,
    tag: 'NEW',
    price: '3.2M',
    location: 'Lekki Phase 1',
    image: '',
  },
  {
    id: '4',
    title: 'Luxury Penthouse',
    owner: 'Amina B.',
    beds: 3,
    tag: 'VERIFIED',
    price: '5.5M',
    location: 'Banana Island',
    image: '',
  }
];


export default function ExploreScreen() {
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <ScrollView stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="px-8 pt-8 pb-4 flex-row justify-between items-end">
          <View>
            <Heading size="2xl" className="text-primary-500 italic font-bold">Homelyn</Heading>
            <Text className="text-typography-400 font-bold text-[10px] uppercase tracking-[4px] mt-1">CURATED</Text>
          </View>
          <View className="flex-row items-center gap-4">
             <TouchableOpacity className="p-2">
               <Text className="text-2xl">☰</Text>
             </TouchableOpacity>
             <Avatar size="md" className="bg-primary-500 shadow-sm border-2 border-background-0">
                <AvatarFallbackText className="text-typography-0">M</AvatarFallbackText>
             </Avatar>
          </View>
        </View>

        {/* Search Bar - Stickyish */}
        <View className="bg-background-0 px-8 py-4">
          <Input 
            variant="rounded" 
            size="xl" 
            className="bg-background-50 border-outline-100 h-16 px-4 shadow-sm"
          >
            <InputSlot className="pl-2">
              <Text className="text-typography-400 text-lg">🔍</Text>
            </InputSlot>
            <InputField 
              placeholder="Search areas, landmarks..." 
              value={search}
              onChangeText={setSearch}
              className="font-medium text-base text-typography-900"
              placeholderTextColor="#A3A3A3"
            />
            <View className="w-[1px] h-6 bg-outline-200 mx-3" />
            <InputSlot className="pr-2">
               <TouchableOpacity>
                 <Text className="text-2xl">🎛</Text>
               </TouchableOpacity>
            </InputSlot>
          </Input>
        </View>

        {/* Top Picks Horizontal Scroll */}
        <View className="mt-8 mb-10">
          <View className="px-8 flex-row justify-between items-end mb-6">
            <Heading size="xl" className="text-typography-900">Top Picks in Lagos</Heading>
            <TouchableOpacity>
              <Text className="text-primary-500 font-bold text-sm">See all</Text>
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
            <Heading size="xl" className="text-typography-900">Recent Listings</Heading>
            <View className="bg-primary-50 px-3 py-1.5 rounded-full border border-primary-100">
              <Text className="text-primary-600 font-bold text-[9px] tracking-widest uppercase">VERIFIED</Text>
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
        className="absolute bottom-8 self-center bg-primary-500 px-8 py-4 rounded-full flex-row items-center shadow-lg shadow-primary-500/40"
      >
        <Text className="mr-2 text-base">🗺</Text>
        <Text className="text-typography-0 font-bold tracking-widest uppercase text-xs">Map View</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
