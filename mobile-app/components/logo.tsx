import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import { Text } from './ui/text';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  /** If true, renders for dark/teal background (cream house). If false, renders for light background (teal house). */
  light?: boolean;
}

export const Logo = ({ size = 'md', light = false }: LogoProps) => {
  const iconSize = size === 'lg' ? 56 : size === 'md' ? 44 : 32;
  const viewBox = '-8 -2 96 88';
  const textSize = size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-3xl' : 'text-xl';

  // On dark/teal backgrounds: house is cream, chevron is teal
  // On light backgrounds: house is teal, chevron is cream
  const houseFill = light ? '#FAF7F2' : '#0E7C7B';
  const chevronStroke = light ? '#0E7C7B' : '#FAF7F2';
  const textColor = light ? 'text-white' : 'text-charcoal';

  return (
    <View className="items-center justify-center">
      <View className="mb-3 items-center justify-center">
        <Svg width={iconSize} height={iconSize * 0.91} viewBox={viewBox} fill="none">
          <Rect x={0} y={38} width={80} height={48} rx={4} fill={houseFill} />
          <Path d="M -8 42 L 40 -2 L 88 42 Z" fill={houseFill} />
          <Path
            d="M 26 22 L 40 8 L 54 22"
            fill="none"
            stroke={chevronStroke}
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx={40} cy={62} r={5} fill="#F2A65A" />
        </Svg>
      </View>
      <Text
        className={`${textSize} tracking-tight ${textColor}`}
        style={{ fontFamily: 'Geist_700Bold', letterSpacing: -0.8 }}>
        homelyn
      </Text>
    </View>
  );
};
