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
  id,
  title,
  price,
  location,
  beds,
  image,
  variant = 'large',
  tag,
  index = 0,
}: PropertyCardProps) => {
  const router = useRouter();

  if (variant === 'horizontal') {
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 100).duration(400)}
        className="mr-3 w-64 rounded-2xl border border-outline-200 bg-background-0 p-2 shadow-none">
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push({ pathname: '/property/[id]', params: { id } })}>
          <View className="relative h-36 overflow-hidden rounded-xl bg-primary-500/20">
            <View className="absolute left-2 top-2 rounded-lg bg-background-0/90 px-2 py-1">
              <GluestackText size="2xs" className="font-bold text-primary-500">
                {price}
              </GluestackText>
            </View>
            {tag && (
              <View className="absolute right-2 top-2 rounded-lg bg-primary-500 px-2 py-1">
                <GluestackText size="2xs" className="font-bold text-typography-0">
                  {tag}
                </GluestackText>
              </View>
            )}
          </View>
          <View className="p-2">
            <GluestackText size="sm" className="mb-0.5 font-bold text-typography-900">
              {title}
            </GluestackText>
            <GluestackText size="2xs" className="text-typography-400">
              {location}
            </GluestackText>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(400)}
      className="mb-3 rounded-2xl border border-outline-200 bg-background-0 p-2 shadow-none">
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => router.push({ pathname: '/property/[id]', params: { id } })}>
        <View className="relative h-48 overflow-hidden rounded-xl bg-primary-500/10">
          <View className="absolute bottom-3 left-3">
            <GluestackText size="lg" className="font-bold text-typography-900">
              {price}
            </GluestackText>
          </View>
          <TouchableOpacity className="absolute right-3 top-3">
            <GluestackText size="sm">♡</GluestackText>
          </TouchableOpacity>
        </View>

        <View className="p-2">
          <View className="flex-row items-center justify-between">
            <GluestackText size="sm" className="flex-1 font-bold text-typography-900">
              {title}
            </GluestackText>
            {tag && (
              <Badge action="muted" size="sm" variant="outline">
                <BadgeText>{tag}</BadgeText>
              </Badge>
            )}
          </View>
          <GluestackText size="2xs" className="mt-0.5 text-typography-400">
            {location}
          </GluestackText>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
