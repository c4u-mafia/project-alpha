import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import Animated, { FadeInDown, FadeInUp, withSpring, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PropertyCard } from '../../components/property-card';

const { width } = Dimensions.get('window');

const REVENUE_DATA = [
  { month: 'JAN', val: 40 },
  { month: 'FEB', val: 60 },
  { month: 'MAR', val: 50 },
  { month: 'APR', val: 80 },
  { month: 'MAY', val: 95 },
  { month: 'JUN', val: 100 }
];

const MY_PROPERTIES = [
  { id: '1', title: 'Skyline View Penthouse', location: 'Banana Island, Lagos', price: 'N12M/yr', tag: 'OCCUPIED' },
  { id: '2', title: 'Urban Studio Loft', location: 'Lekki Phase 1, Lagos', price: 'N3.5M/yr', tag: 'VACANT' },
  { id: '3', title: 'Eco-Smart Duplex', location: 'Gwarinpa, Abuja', price: 'N7.2M/yr', tag: 'OCCUPIED' }
];

export default function LandlordDashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
        {/* Top Header */}
        <View className="px-8 pt-8 pb-4 flex-row justify-between items-center">
          <TouchableOpacity className="p-2">
            <Text className="text-2xl">☰</Text>
          </TouchableOpacity>
          <Text className="text-[#006970] font-bold text-2xl italic">Property Hub</Text>
          <TouchableOpacity className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
             <View className="flex-1 bg-neutral-200" />
          </TouchableOpacity>
        </View>

        {/* Welcome Block */}
        <View className="px-8 mt-6">
          <Text className="text-neutral-400 font-bold text-[10px] uppercase tracking-[4px] mb-2 font-body">DASHBOARD</Text>
          <Text className="text-4xl font-bold text-[#111827] mb-8 font-heading">Welcome back, Chidi</Text>
        </View>

        {/* Revenue Card */}
        <Animated.View 
          entering={FadeInDown.duration(800)}
          className="mx-8 bg-[#006970] rounded-[2.5rem] p-10 shadow-xl shadow-[#006970]/30 overflow-hidden relative"
        >
          <View className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -m-20" />
          <Text className="text-white/60 font-medium text-lg mb-2">Monthly Revenue</Text>
          <Text className="text-white text-6xl font-bold mb-6 tracking-tight">N5.8M</Text>
          <View className="bg-white/10 self-start px-6 py-3 rounded-full flex-row items-center backdrop-blur-xl border border-white/10">
             <Text className="text-white mr-2">↗</Text>
             <Text className="text-white font-bold text-xs tracking-widest">+12.5% from last month</Text>
          </View>
        </Animated.View>

        {/* Stats Row */}
        <View className="mx-8 mt-10 flex-row gap-6">
           <Animated.View entering={FadeInDown.delay(200)} className="flex-1 bg-white p-8 rounded-[2.5rem] shadow-sm border border-neutral-100">
             <View className="w-12 h-12 bg-[#006970]/10 rounded-2xl items-center justify-center mb-6">
               <Text className="text-xl">🏢</Text>
             </View>
             <Text className="text-neutral-400 font-bold text-[10px] uppercase tracking-widest mb-2">ACTIVE LISTINGS</Text>
             <Text className="text-4xl font-bold text-[#111827]">14</Text>
           </Animated.View>
           <Animated.View entering={FadeInDown.delay(300)} className="flex-1 bg-white p-8 rounded-[2.5rem] shadow-sm border border-neutral-100">
             <View className="w-12 h-12 bg-[#006970]/10 rounded-2xl items-center justify-center mb-6">
               <Text className="text-xl">💬</Text>
             </View>
             <Text className="text-neutral-400 font-bold text-[10px] uppercase tracking-widest mb-2">TENANT INQUIRIES</Text>
             <Text className="text-4xl font-bold text-[#111827]">38</Text>
           </Animated.View>
        </View>

        {/* Revenue Trend Chart */}
        <View className="mx-8 mt-12 bg-[#F3F4F5] p-10 rounded-[2.5rem] shadow-sm overflow-hidden border border-neutral-100 relative">
          <View className="flex-row justify-between items-center mb-10">
             <Text className="text-2xl font-bold text-[#111827]">Revenue Trend</Text>
             <View className="bg-[#D1E9FF] px-4 py-2 rounded-full">
               <Text className="text-[#006970] font-bold text-[10px] tracking-widest uppercase">LAST 6 MONTHS</Text>
             </View>
          </View>
          
          <View className="flex-row items-end justify-between h-48 px-2">
             {REVENUE_DATA.map((item, index) => (
                <View key={item.month} className="items-center w-10">
                  <Animated.View 
                    entering={FadeInUp.delay(index * 100).duration(1000)}
                    style={{ height: `${item.val}%` }} 
                    className={`w-full rounded-2xl mb-4 ${index === 5 ? 'bg-[#00535b]' : 'bg-[#006970]/40'}`} 
                  />
                  <Text className="text-neutral-400 font-bold text-[10px] tracking-widest uppercase">{item.month}</Text>
                </View>
             ))}
          </View>
          {/* Tooltip mockup */}
          <View className="absolute top-28 right-12 bg-black/80 px-4 py-2 rounded-xl">
             <Text className="text-white font-bold text-[10px]">N5.8M</Text>
          </View>
        </View>

        {/* My Properties List */}
        <View className="mx-8 mt-12">
          <View className="flex-row justify-between items-center mb-8">
            <Text className="text-3xl font-bold text-[#111827]">My Properties</Text>
            <TouchableOpacity>
               <Text className="text-[#006970] font-bold">View All</Text>
            </TouchableOpacity>
          </View>
          
          {MY_PROPERTIES.map((prop, index) => (
             <Animated.View 
                key={prop.id}
                entering={FadeInDown.delay(index * 100).duration(800)}
                className="bg-white p-2 rounded-[2.5rem] mb-6 flex-row items-center border border-neutral-100 shadow-sm"
             >
                <View className="w-32 h-32 bg-neutral-200 rounded-[2rem] overflow-hidden m-2 relative">
                   <View className="flex-1 bg-[#006970]/30" />
                   <View className={`absolute top-2 left-2 px-3 py-1.5 rounded-full ${prop.tag === 'OCCUPIED' ? 'bg-[#006970]' : 'bg-[#D1E0E0]'}`}>
                      <Text className={`font-bold text-[10px] tracking-widest ${prop.tag === 'OCCUPIED' ? 'text-white' : 'text-[#006970]'}`}>{prop.tag}</Text>
                   </View>
                </View>
                <View className="flex-1 p-4">
                   <Text className="text-xl font-bold text-[#111827] mb-1">{prop.title}</Text>
                   <Text className="text-neutral-400 text-xs mb-2">📍 {prop.location}</Text>
                   <Text className="text-[#006970] font-bold text-lg">{prop.price}</Text>
                </View>
                <TouchableOpacity className="p-6">
                   <Text className="text-2xl text-neutral-300">❯</Text>
                </TouchableOpacity>
             </Animated.View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity 
        activeOpacity={0.9}
        className="absolute bottom-32 right-8 w-20 h-20 bg-[#00535b] rounded-[2rem] items-center justify-center shadow-xl shadow-[#00535b]/40"
      >
        <Text className="text-white text-4xl">+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
