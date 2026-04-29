import React from 'react';
import { View, Text } from 'react-native';

export const Logo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const iconSize = size === 'lg' ? 80 : size === 'md' ? 60 : 40;
  const textSize = size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-3xl' : 'text-2xl';

  return (
    <View className="items-center justify-center">
      <View 
        className="bg-[#006970]/20 rounded-3xl items-center justify-center p-4 mb-4"
        style={{ width: iconSize, height: iconSize }}
      >
        <View className="w-full h-full border-2 border-white/80 rounded-lg flex-row gap-0.5 p-1 flex-wrap">
          <View className="w-[45%] h-[20%] bg-white m-0.5" />
          <View className="w-[45%] h-[20%] bg-white m-0.5" />
          <View className="w-[45%] h-[20%] bg-white m-0.5" />
          <View className="w-[45%] h-[20%] bg-white m-0.5" />
        </View>
      </View>
      <Text className={`${textSize} font-bold text-primary-500 tracking-tight`}>
        Homelyn
      </Text>
    </View>
  );
};
