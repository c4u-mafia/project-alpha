import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Text } from './ui/text';

interface Props {
  percentage: number;
  showLabel?: boolean;
  showPercentage?: boolean;
  height?: number;
  compact?: boolean;
}

function getHealthColor(pct: number) {
  if (pct > 50) return '#1E9E5C';
  if (pct > 25) return '#E89B2C';
  if (pct > 10) return '#E2683C';
  return '#D54545';
}

function getHealthLabel(pct: number) {
  if (pct > 50) return 'Healthy';
  if (pct > 25) return 'Notice Soon';
  if (pct > 10) return 'Due Soon';
  return 'Critical';
}

function getHealthBg(pct: number) {
  if (pct > 50) return '#D1FAE5';
  if (pct > 25) return '#FEF3C7';
  if (pct > 10) return '#FFE4D4';
  return '#FEE2E2';
}

export const RentHealthBar = ({
  percentage,
  showLabel = true,
  showPercentage = true,
  height = 10,
  compact = false,
}: Props) => {
  const clampedPct = Math.max(0, Math.min(100, percentage));
  const width = useSharedValue(0);
  const color = getHealthColor(clampedPct);
  const label = getHealthLabel(clampedPct);
  const bg = getHealthBg(clampedPct);

  useEffect(() => {
    width.value = withTiming(clampedPct, {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
  }, [clampedPct]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
    backgroundColor: color,
  }));

  if (compact) {
    return (
      <View className="gap-1">
        <View
          style={{ height, borderRadius: 999, backgroundColor: '#F0EBE4', overflow: 'hidden' }}
        >
          <Animated.View style={[{ height, borderRadius: 999 }, barStyle]} />
        </View>
      </View>
    );
  }

  return (
    <View>
      {(showLabel || showPercentage) && (
        <View className="flex-row items-center justify-between mb-2">
          {showLabel && (
            <View className="flex-row items-center gap-2">
              <Text
                className="text-charcoal/60 text-xs uppercase tracking-wider"
                style={{ fontFamily: 'Geist_600SemiBold' }}
              >
                Rent Health
              </Text>
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 999,
                  backgroundColor: bg,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Geist_600SemiBold',
                    color,
                    fontSize: 11,
                  }}
                >
                  {label}
                </Text>
              </View>
            </View>
          )}
          {showPercentage && (
            <Text
              style={{
                fontFamily: 'Geist_700Bold',
                color,
                fontSize: 14,
              }}
            >
              {clampedPct}%
            </Text>
          )}
        </View>
      )}

      <View
        style={{
          height,
          borderRadius: 999,
          backgroundColor: '#F0EBE4',
          overflow: 'hidden',
        }}
      >
        <Animated.View style={[{ height, borderRadius: 999 }, barStyle]} />
      </View>
    </View>
  );
};
