import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, FadeInDown, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const AMENITIES = [
  { id: '1', title: 'Fiber Optic Wi-Fi', icon: '📶' },
  { id: '2', title: '24/7 Security', icon: '🛡️' },
  { id: '3', title: '3 Car Parking', icon: '🚗' },
  { id: '4', title: 'Back-up Power', icon: '⚡' }
];

export default function PropertyDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
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
        showsVerticalScrollIndicator={false}
      >
        {/* Gallery Hero */}
        <View className="h-2/3 relative">
          <View className="flex-1 bg-[#004D53]/10" />
          <View className="absolute top-24 left-8 right-8 flex-row justify-between z-10">
            <TouchableOpacity onPress={() => router.back()} className="w-14 h-14 bg-white rounded-full items-center justify-center shadow-lg">
              <Text className="text-xl font-bold">←</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-14 h-14 bg-white rounded-full items-center justify-center shadow-lg">
              <Text className="text-xl">📤</Text>
            </TouchableOpacity>
          </View>
          <View className="absolute bottom-8 right-8 bg-black/40 px-4 py-2 rounded-2xl">
             <Text className="text-white font-bold text-xs">1/12</Text>
          </View>
        </View>

        {/* Content Section */}
        <View className="p-8 pb-32">
          <View className="mb-8">
            <Text className="text-4xl font-bold text-[#006970] mb-2 leading-tight">N4,500,000 <Text className="text-[#A3A3A3] text-lg font-medium">/ year</Text></Text>
            <Text className="text-4xl font-bold text-[#111827] mb-4">The Azure Penthouse: Waterfront Living</Text>
            <View className="flex-row items-center">
              <Text className="text-[#006970] text-lg mr-2">📍</Text>
              <Text className="text-neutral-500 text-lg font-medium">Banana Island, Ikoyi, Lagos</Text>
            </View>
          </View>

          {/* Guarantee Banner */}
          <View className="bg-[#D1E9FF] p-6 rounded-[2rem] flex-row items-center mb-10 overflow-hidden">
             <View className="w-12 h-12 bg-[#006970] items-center justify-center rounded-2xl mr-4">
                <Text className="text-xl">✔️</Text>
             </View>
             <View className="flex-1">
               <Text className="font-bold text-lg text-[#004D53]">No Hidden Fees Guarantee</Text>
               <Text className="text-[#006970]/80">All costs are upfront and verified by Homelyn.</Text>
             </View>
          </View>

          {/* Landlord Profile Card */}
          <View className="bg-white p-8 rounded-[2.5rem] mb-12 shadow-sm border border-neutral-100 items-center">
             <View className="w-24 h-24 rounded-full bg-neutral-200 mb-4 items-center justify-center overflow-hidden">
                <View className="flex-1 bg-[#006970]/10 w-full" />
                <View className="absolute bottom-0 right-0 bg-teal-500 w-8 h-8 rounded-full border-4 border-white items-center justify-center">
                  <Text className="text-[10px]">✔️</Text>
                </View>
             </View>
             <Text className="text-neutral-400 font-bold text-[10px] uppercase tracking-widest mb-1">LANDLORD</Text>
             <Text className="text-2xl font-bold text-[#111827] mb-2">Emeka Anyanwu</Text>
             <Text className="text-neutral-500 font-medium mb-6">Verified Property Owner • 4.9 ★</Text>
             <TouchableOpacity className="bg-[#F3F4F5] w-full py-5 rounded-[1.5rem] items-center flex-row justify-center">
                <Text className="text-xl mr-2">💬</Text>
                <Text className="font-bold text-[#00535b] tracking-widest uppercase text-xs">Contact Landlord</Text>
             </TouchableOpacity>
          </View>

          {/* The Experience */}
          <View className="mb-12">
            <Text className="text-3xl font-bold text-[#111827] mb-6">The Experience</Text>
            <Text className="text-neutral-500 text-lg leading-relaxed font-normal">
              Experience unparalleled luxury in this architecturally designed penthouse. Featuring panoramic views of the Lagos Lagoon, this 3-bedroom residence combines contemporary aesthetics with the warmth of Nigerian textures. Fully smart-home integrated and serviced with 24/7 power.
            </Text>
          </View>

          {/* Amenities Grid */}
          <View className="mb-12">
            <Text className="text-3xl font-bold text-[#111827] mb-6">Amenities</Text>
            <View className="flex-row flex-wrap gap-4">
               {AMENITIES.map((item) => (
                 <View key={item.id} className="w-[47%] bg-white p-5 rounded-[1.5rem] flex-row items-center border border-neutral-50 shadow-sm">
                   <Text className="text-2xl mr-3">{item.icon}</Text>
                   <Text className="text-neutral-500 font-bold text-xs flex-1">{item.title}</Text>
                 </View>
               ))}
            </View>
          </View>

          {/* Location Map Snippet */}
          <View className="mb-10">
            <View className="flex-row justify-between items-end mb-6">
              <Text className="text-3xl font-bold text-[#111827]">Location</Text>
              <TouchableOpacity>
                <Text className="text-[#006970] font-bold text-[10px] tracking-widest uppercase">GET DIRECTIONS</Text>
              </TouchableOpacity>
            </View>
            <View className="h-64 bg-[#F3F4F5] rounded-[2.5rem] overflow-hidden items-center justify-center p-8">
               <View className="w-16 h-16 bg-[#006970]/10 rounded-full" />
            </View>
          </View>
        </View>
      </Animated.ScrollView>

      {/* Floating Header Overlay (Scroll Response) */}
      <Animated.View 
        style={headerStyle} 
        className="absolute top-0 w-full bg-white/95 px-8 pt-16 pb-6 flex-row justify-between items-center z-20 border-b border-neutral-100"
      >
        <TouchableOpacity onPress={() => router.back()}>
           <Text className="text-xl">←</Text>
        </TouchableOpacity>
        <Text className="text-[#006970] font-bold text-xl italic">Homelyn</Text>
        <TouchableOpacity>
           <Text className="text-xl">📤</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Bottom Action Bar */}
      <View className="absolute bottom-0 w-full bg-white pt-6 pb-12 px-8 flex-row gap-4 border-t border-neutral-50 shadow-2xl">
         <TouchableOpacity 
           activeOpacity={0.8}
           className="w-20 bg-[#F3F4F5] h-16 rounded-[1.5rem] items-center justify-center"
         >
           <Text className="text-3xl">💬</Text>
         </TouchableOpacity>
         <TouchableOpacity 
           activeOpacity={0.9}
           className="flex-1 bg-[#00535b] h-16 rounded-[1.5rem] items-center justify-center shadow-lg shadow-[#00535b]/30"
         >
           <Text className="text-white font-bold tracking-widest uppercase text-xs">Request Viewing</Text>
         </TouchableOpacity>
      </View>
    </View>
  );
}
