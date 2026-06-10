import React, { useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import { Text } from './ui/text';

import { SplashLogo } from './splash-logo';

export const SplashScreen = ({ onNext }: { onNext: () => void }) => {
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.75);
  const taglineOpacity = useSharedValue(0);
  const taglineY = useSharedValue(16);
  const dotOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 700 });
    logoScale.value = withSpring(1, { damping: 14, stiffness: 100 });

    taglineOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
    taglineY.value = withDelay(500, withSpring(0, { damping: 18 }));

    dotOpacity.value = withDelay(1000, withTiming(1, { duration: 400 }));
    dotOpacity.value = withSequence(
      withDelay(1000, withTiming(1, { duration: 400 })),
      withDelay(600, withTiming(0, { duration: 300 }))
    );

    const timer = setTimeout(() => {
      runOnJS(onNext)();
    }, 2200);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineY.value }],
  }));

  return (
    <View className="flex-1 items-center justify-center bg-[#0E7C7B]">
      <StatusBar barStyle="light-content" backgroundColor="#0E7C7B" />

      <Animated.View style={logoStyle} className="items-center">
        {/* Homelyn house logo mark — matches design SVG exactly */}
        <View className="mb-5 items-center justify-center">
          <SplashLogo />
        </View>
        <Text
          className="text-4xl tracking-tight text-white"
          style={{ fontFamily: 'Geist_700Bold', letterSpacing: -1 }}>
          homelyn
        </Text>
      </Animated.View>

      <Animated.View style={taglineStyle} className="mt-4 items-center">
        <Text
          className="text-base tracking-wide text-white/60"
          style={{ fontFamily: 'Geist_400Regular' }}>
          Rent direct. Live easy.
        </Text>
      </Animated.View>
    </View>
  );
};
