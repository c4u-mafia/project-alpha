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
import { Text } from './ui/text';

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
      withDelay(600, withTiming(0, { duration: 300, })),
    );

    const timer = setTimeout(() => {
      runOnJS(onNext)();
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineY.value }],
  }));

  return (
    <View className="flex-1 bg-[#0E7C7B] items-center justify-center">
      <StatusBar barStyle="light-content" backgroundColor="#0E7C7B" />

      <Animated.View style={logoStyle} className="items-center">
        <View className="w-20 h-20 bg-white/15 rounded-3xl items-center justify-center mb-5">
          <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center">
            <Text className="text-[#0E7C7B] text-2xl font-bold" style={{ fontFamily: 'Geist_700Bold' }}>H</Text>
          </View>
        </View>
        <Text
          className="text-white text-4xl tracking-tight"
          style={{ fontFamily: 'Geist_700Bold', letterSpacing: -1 }}
        >
          homelyn
        </Text>
      </Animated.View>

      <Animated.View style={taglineStyle} className="mt-4 items-center">
        <Text className="text-white/60 text-base tracking-wide" style={{ fontFamily: 'Geist_400Regular' }}>
          Rent direct. Live easy.
        </Text>
      </Animated.View>
    </View>
  );
};
