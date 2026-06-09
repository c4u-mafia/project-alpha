import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PropertyCard } from '../../components/property-card';
import { Heading } from '../../components/ui/heading';
import { Text } from '../../components/ui/text';

const SAVED_ITEMS = [
  {
    id: '1',
    title: 'Penthouse Lekki',
    price: 'N3.5M',
    location: 'Lekki Phase 1',
    beds: 3,
    image: '',
  },
  {
    id: '2',
    title: 'Modern Flat VI',
    price: 'N2.1M',
    location: 'Victoria Island',
    beds: 2,
    image: '',
  },
];

export default function SavedScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-8 pb-4 pt-8">
          <View className="mb-6 flex-row items-center justify-between">
            <Heading size="2xl" className="text-typography-900">
              Saved
            </Heading>
            <View className="rounded-full border border-primary-100 bg-primary-50 px-3 py-1.5">
              <Text className="text-[10px] font-bold uppercase tracking-widest text-primary-600">
                {SAVED_ITEMS.length} ITEMS
              </Text>
            </View>
          </View>
        </View>

        <View className="px-8">
          {SAVED_ITEMS.length === 0 ? (
            <View className="mt-32 items-center justify-center">
              <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-primary-50">
                <Text size="4xl" className="text-primary-500">
                  ♡
                </Text>
              </View>
              <Heading size="xl" className="mb-2 text-typography-900">
                Nothing saved yet
              </Heading>
              <Text size="sm" className="px-8 text-center leading-relaxed text-typography-500">
                Tap the heart icon on any property to save it for later.
              </Text>
            </View>
          ) : (
            SAVED_ITEMS.map((item, index) => <PropertyCard key={item.id} {...item} index={index} />)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
