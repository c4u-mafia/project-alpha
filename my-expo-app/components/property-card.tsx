import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

interface PropertyCardProps {
  id: string;
  title: string;
  price: string;
  location: string;
  beds?: number;
  baths?: number;
  sqft?: string;
  image: string;
  variant?: 'horizontal' | 'large';
  tag?: string;
  owner?: string;
  index?: number;
}

export const PropertyCard = ({ 
  id, title, price, location, beds, baths, sqft, image, variant = 'large', tag, owner, index = 0 
}: PropertyCardProps) => {
  const router = useRouter();

  if (variant === 'horizontal') {
    return (
      <Animated.View 
        entering={FadeInDown.delay(index * 100).duration(600)}
        className="w-72 mr-4 bg-white rounded-3xl p-1.5 shadow-sm"
      >
        <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={() => router.push(`/property/${id}`)}
          className="relative"
        >
          <View className="h-44 bg-neutral-200 rounded-2xl overflow-hidden">
             {/* Image placeholder - normally use <Image src={image} /> */}
             <View className="flex-1 bg-[#004D53]/20" />
             <View className="absolute top-3 left-3 bg-white/90 px-3 py-1.5 rounded-full">
               <Text className="text-[#004D53] font-bold text-xs">{price}</Text>
             </View>
             {tag && (
               <View className="absolute top-3 right-3 bg-[#006970] px-3 py-1.5 rounded-full">
                 <Text className="text-white font-bold text-[10px] tracking-widest">{tag}</Text>
               </View>
             )}
          </View>
          <View className="p-4">
             <Text className="text-xl font-bold text-[#111827] mb-1">{title}</Text>
             <View className="flex-row items-center">
               <Text className="text-neutral-500 text-xs">📍 {location}</Text>
             </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View 
       entering={FadeInDown.delay(index * 100).duration(800)}
       className="bg-white rounded-[2.5rem] p-2 mb-6 shadow-sm overflow-hidden"
    >
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={() => router.push(`/property/${id}`)}
      >
        <View className="h-64 bg-neutral-200 rounded-[2rem] overflow-hidden relative">
          <View className="flex-1 bg-[#004D53]/10" />
          <View className="absolute bottom-6 left-6 bg-white/20 p-2 rounded-2xl">
             <Text className="text-white text-3xl font-bold">N{price}</Text>
             <Text className="text-white/60 text-xs font-semibold">/year</Text>
          </View>
          <TouchableOpacity className="absolute top-6 right-6 bg-white/90 p-3 rounded-full">
            <Text>❤️</Text>
          </TouchableOpacity>
        </View>

        <View className="p-6">
           <View className="flex-row justify-between items-center mb-4">
             <Text className="text-2xl font-bold text-[#111827] flex-1 mr-2">{title}</Text>
             {tag && (
               <View className="bg-[#006970]/10 px-3 py-1.5 rounded-full">
                 <Text className="text-[#006970] font-bold text-[10px] tracking-widest">{tag}</Text>
               </View>
             )}
           </View>

           <View className="flex-row items-center mb-4 border-t border-neutral-50 pt-4">
             {owner && (
               <View className="flex-row items-center mr-6">
                 <Text className="text-xl mr-2">👤</Text>
                 <Text className="text-neutral-500 font-medium text-sm">{owner}</Text>
               </View>
             )}
             {beds && (
               <View className="flex-row items-center">
                 <Text className="text-xl mr-2">🛏</Text>
                 <Text className="text-neutral-500 font-medium text-sm">{beds} Beds</Text>
               </View>
             )}
           </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
