import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const AMENITIES = [
  { id: '1', title: 'Fiber Optic Wi-Fi', icon: '📶' },
  { id: '2', title: '24/7 Security', icon: '🛡️' },
  { id: '3', title: '3 Car Parking', icon: '🚗' },
  { id: '4', title: 'Back-up Power', icon: '⚡' },
];

export default function PropertyDetailsScreen() {
  const router = useRouter();
  useLocalSearchParams();
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [width - 100, width], [0, 1]);
    return { opacity };
  });

  return (
    <View className="flex-1 bg-[#F8F9FA]">
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}>
        {/* Gallery Hero */}
        <View className="relative h-2/3">
          <View className="flex-1 bg-[#004D53]/10" />
          <View className="absolute left-8 right-8 top-24 z-10 flex-row justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg">
              <Text className="text-xl font-bold">←</Text>
            </TouchableOpacity>
            <TouchableOpacity className="h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg">
              <Text className="text-xl">📤</Text>
            </TouchableOpacity>
          </View>
          <View className="absolute bottom-8 right-8 rounded-2xl bg-black/40 px-4 py-2">
            <Text className="text-xs font-bold text-white">1/12</Text>
          </View>
        </View>

        {/* Content Section */}
        <View className="p-8 pb-32">
          <View className="mb-8">
            <Text className="mb-2 text-4xl font-bold leading-tight text-[#006970]">
              N4,500,000 <Text className="text-lg font-medium text-[#A3A3A3]">/ year</Text>
            </Text>
            <Text className="mb-4 text-4xl font-bold text-[#111827]">
              The Azure Penthouse: Waterfront Living
            </Text>
            <View className="flex-row items-center">
              <Text className="mr-2 text-lg text-[#006970]">📍</Text>
              <Text className="text-lg font-medium text-neutral-500">
                Banana Island, Ikoyi, Lagos
              </Text>
            </View>
          </View>

          {/* Guarantee Banner */}
          <View className="mb-10 flex-row items-center overflow-hidden rounded-[2rem] bg-[#D1E9FF] p-6">
            <View className="mr-4 h-12 w-12 items-center justify-center rounded-2xl bg-[#006970]">
              <Text className="text-xl">✔️</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-[#004D53]">No Hidden Fees Guarantee</Text>
              <Text className="text-[#006970]/80">
                All costs are upfront and verified by Homelyn.
              </Text>
            </View>
          </View>

          {/* Landlord Profile Card */}
          <View className="mb-12 items-center rounded-[2.5rem] border border-neutral-100 bg-white p-8 shadow-sm">
            <View className="mb-4 h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-neutral-200">
              <View className="w-full flex-1 bg-[#006970]/10" />
              <View className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-teal-500">
                <Text className="text-[10px]">✔️</Text>
              </View>
            </View>
            <Text className="mb-1 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              LANDLORD
            </Text>
            <Text className="mb-2 text-2xl font-bold text-[#111827]">Emeka Anyanwu</Text>
            <Text className="mb-6 font-medium text-neutral-500">
              Verified Property Owner • 4.9 ★
            </Text>
            <TouchableOpacity className="w-full flex-row items-center justify-center rounded-[1.5rem] bg-[#F3F4F5] py-5">
              <Text className="mr-2 text-xl">💬</Text>
              <Text className="text-xs font-bold uppercase tracking-widest text-[#00535b]">
                Contact Landlord
              </Text>
            </TouchableOpacity>
          </View>

          {/* The Experience */}
          <View className="mb-12">
            <Text className="mb-6 text-3xl font-bold text-[#111827]">The Experience</Text>
            <Text className="text-lg font-normal leading-relaxed text-neutral-500">
              Experience unparalleled luxury in this architecturally designed penthouse. Featuring
              panoramic views of the Lagos Lagoon, this 3-bedroom residence combines contemporary
              aesthetics with the warmth of Nigerian textures. Fully smart-home integrated and
              serviced with 24/7 power.
            </Text>
          </View>

          {/* Amenities Grid */}
          <View className="mb-12">
            <Text className="mb-6 text-3xl font-bold text-[#111827]">Amenities</Text>
            <View className="flex-row flex-wrap gap-4">
              {AMENITIES.map((item) => (
                <View
                  key={item.id}
                  className="w-[47%] flex-row items-center rounded-[1.5rem] border border-neutral-50 bg-white p-5 shadow-sm">
                  <Text className="mr-3 text-2xl">{item.icon}</Text>
                  <Text className="flex-1 text-xs font-bold text-neutral-500">{item.title}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Location Map Snippet */}
          <View className="mb-10">
            <View className="mb-6 flex-row items-end justify-between">
              <Text className="text-3xl font-bold text-[#111827]">Location</Text>
              <TouchableOpacity>
                <Text className="text-[10px] font-bold uppercase tracking-widest text-[#006970]">
                  GET DIRECTIONS
                </Text>
              </TouchableOpacity>
            </View>
            <View className="h-64 items-center justify-center overflow-hidden rounded-[2.5rem] bg-[#F3F4F5] p-8">
              <View className="h-16 w-16 rounded-full bg-[#006970]/10" />
            </View>
          </View>
        </View>
      </Animated.ScrollView>

      {/* Floating Header Overlay (Scroll Response) */}
      <Animated.View
        style={headerStyle}
        className="absolute top-0 z-20 w-full flex-row items-center justify-between border-b border-neutral-100 bg-white/95 px-8 pb-6 pt-16">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-xl">←</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold italic text-[#006970]">Homelyn</Text>
        <TouchableOpacity>
          <Text className="text-xl">📤</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Bottom Action Bar */}
      <View className="absolute bottom-0 w-full flex-row gap-4 border-t border-neutral-50 bg-white px-8 pb-12 pt-6 shadow-2xl">
        <TouchableOpacity
          activeOpacity={0.8}
          className="h-16 w-20 items-center justify-center rounded-[1.5rem] bg-[#F3F4F5]">
          <Text className="text-3xl">💬</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          className="h-16 flex-1 items-center justify-center rounded-[1.5rem] bg-[#00535b] shadow-lg shadow-[#00535b]/30">
          <Text className="text-xs font-bold uppercase tracking-widest text-white">
            Request Viewing
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
