import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Text as GluestackText } from './ui/text';
import { Badge, BadgeText } from './ui/badge';

interface PropertyCardProps {
  id: string;
  title: string;
  price: string;
  location: string;
  beds?: number;
  image?: string;
  variant?: 'horizontal' | 'large';
  tag?: string;
  index?: number;
}

export const PropertyCard = ({
  id, title, price, location, beds, image, variant = 'large', tag, index = 0
}: PropertyCardProps) => {
  const router = useRouter();

  if (variant === 'horizontal') {
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 100).duration(400)}
        className="w-64 mr-3 bg-background-0 rounded-2xl p-2 shadow-none border border-outline-200"
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push({ pathname: '/property/[id]', params: { id } })}
        >
          <View className="h-36 bg-primary-500/20 rounded-xl overflow-hidden relative">
             <View className="absolute top-2 left-2 bg-background-0/90 px-2 py-1 rounded-lg">
               <GluestackText size="2xs" className="text-primary-500 font-bold">{price}</GluestackText>
             </View>
             {tag && (
               <View className="absolute top-2 right-2 bg-primary-500 px-2 py-1 rounded-lg">
                   <GluestackText size="2xs" className="text-typography-0 font-bold">{tag}</GluestackText>
                 </View>
             )}
          </View>
          <View className="p-2">
             <GluestackText size="sm" className="text-typography-900 font-bold mb-0.5">{title}</GluestackText>
             <GluestackText size="2xs" className="text-typography-400">{location}</GluestackText>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View
       entering={FadeInDown.delay(index * 100).duration(400)}
       className="bg-background-0 rounded-2xl p-2 mb-3 shadow-none border border-outline-200"
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => router.push({ pathname: '/property/[id]', params: { id } })}
      >
        <View className="h-48 bg-primary-500/10 rounded-xl overflow-hidden relative">
          <View className="absolute bottom-3 left-3">
             <GluestackText size="lg" className="text-typography-900 font-bold">{price}</GluestackText>
          </View>
          <TouchableOpacity className="absolute top-3 right-3">
            <GluestackText size="sm">♡</GluestackText>
          </TouchableOpacity>
        </View>

        <View className="p-2">
           <View className="flex-row justify-between items-center">
             <GluestackText size="sm" className="text-typography-900 font-bold flex-1">{title}</GluestackText>
             {tag && (
               <Badge action="muted" size="sm" variant="outline">
                 <BadgeText>{tag}</BadgeText>
               </Badge>
             )}
           </View>
           <GluestackText size="2xs" className="text-typography-400 mt-0.5">{location}</GluestackText>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
