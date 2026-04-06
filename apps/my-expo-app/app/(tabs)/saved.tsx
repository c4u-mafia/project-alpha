import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PropertyCard } from '../../components/property-card';

const SAVED_ITEMS = [
  { id: '1', title: 'Penthouse in Lekki Phase 1', price: 'N3.5M', location: 'Lekki Phase 1, Lagos', beds: 3, baths: 3, sqft: '2,400 sqft', image: '', tag: 'SAVED' },
  { id: '2', title: 'Modern Flat, Victoria Island', price: 'N2.1M', location: 'Victoria Island, Lagos', beds: 2, baths: 2, sqft: '1,200 sqft', image: '', tag: 'SAVED' }
];

export default function SavedScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
        <View className="px-8 pt-8 pb-4">
           <Text className="text-neutral-400 font-bold text-[10px] uppercase tracking-[4px] mb-2 font-body">COLLECTION</Text>
           <Text className="text-4xl font-bold text-[#111827] mb-8 font-heading">Saved Properties</Text>
        </View>

        <View className="px-8 mt-12">
          {SAVED_ITEMS.length === 0 ? (
            <View className="items-center justify-center mt-20">
               <Text className="text-neutral-300 text-6xl mb-6">🖤</Text>
               <Text className="text-neutral-500 font-bold text-xl mb-2">No saved homes yet</Text>
               <Text className="text-neutral-400 text-center px-12">Start exploring properties and tap the heart icon to save your favorites.</Text>
            </View>
          ) : (
            SAVED_ITEMS.map((item, index) => (
              <PropertyCard key={item.id} {...item} index={index} />
            ))
          )}
        </View>
      </ScrollView>

      {/* Filter Floating Button */}
      <TouchableOpacity 
        activeOpacity={0.9}
        className="absolute bottom-32 self-center bg-[#00535b] px-10 py-5 rounded-full flex-row items-center shadow-xl shadow-[#00535b]/40"
      >
        <Text className="mr-2">🎛</Text>
        <Text className="text-white font-bold tracking-widest uppercase text-xs">Filter List</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
