import React from 'react';
import { View, Text } from 'react-native';

export const Logo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const iconSize = size === 'lg' ? 80 : size === 'md' ? 60 : 40;
  const textSize = size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-3xl' : 'text-2xl';

  return (
    <View className="items-center justify-center">
      <View
        className="mb-4 items-center justify-center rounded-3xl bg-[#006970]/20 p-4"
        style={{ width: iconSize, height: iconSize }}>
        <View className="h-full w-full flex-row flex-wrap gap-0.5 rounded-lg border-2 border-white/80 p-1">
          <View className="m-0.5 h-[20%] w-[45%] bg-white" />
          <View className="m-0.5 h-[20%] w-[45%] bg-white" />
          <View className="m-0.5 h-[20%] w-[45%] bg-white" />
          <View className="m-0.5 h-[20%] w-[45%] bg-white" />
        </View>
      </View>
      <Text className={`${textSize} font-bold tracking-tight text-primary-500`}>Homelyn</Text>
    </View>
  );
};
