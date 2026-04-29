import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PropertyCard } from '../../components/property-card';
import { Heading } from '../../components/ui/heading';
import { Text } from '../../components/ui/text';

const SAVED_ITEMS = [
  { id: '1', title: 'Penthouse Lekki', price: 'N3.5M', location: 'Lekki Phase 1', beds: 3, image: '' },
  { id: '2', title: 'Modern Flat VI', price: 'N2.1M', location: 'Victoria Island', beds: 2, image: '' }
];

export default function SavedScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-8 pt-8 pb-4">
           <View className="flex-row justify-between items-center mb-6">
             <Heading size="2xl" className="text-typography-900">Saved</Heading>
             <View className="bg-primary-50 px-3 py-1.5 rounded-full border border-primary-100">
               <Text className="text-primary-600 font-bold text-[10px] tracking-widest uppercase">{SAVED_ITEMS.length} ITEMS</Text>
             </View>
           </View>
        </View>

        <View className="px-8">
          {SAVED_ITEMS.length === 0 ? (
            <View className="items-center justify-center mt-32">
               <View className="w-24 h-24 bg-primary-50 rounded-full items-center justify-center mb-6">
                 <Text size="4xl" className="text-primary-500">♡</Text>
               </View>
               <Heading size="xl" className="text-typography-900 mb-2">Nothing saved yet</Heading>
               <Text size="sm" className="text-typography-500 text-center px-8 leading-relaxed">
                 Tap the heart icon on any property to save it for later.
               </Text>
            </View>
          ) : (
            SAVED_ITEMS.map((item, index) => (
              <PropertyCard key={item.id} {...item} index={index} />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
