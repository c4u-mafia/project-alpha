import React, { useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  FadeInDown,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { useGlobalStore } from '@/store/global-store';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';

export default function OnboardingComplete() {
  const { role } = useGlobalStore();
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 80 });
    opacity.value = withDelay(100, withTiming(1, { duration: 500 }));
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const handleEnter = () => {
    router.replace(role === 'landlord' ? '/(landlord)' : '/(tenant)');
  };

  return (
    <View className="flex-1 bg-[#0E7C7B] items-center justify-center px-8">
      <StatusBar barStyle="light-content" backgroundColor="#0E7C7B" />

      <Animated.View style={iconStyle} className="items-center mb-8">
        <View className="w-24 h-24 bg-white/15 rounded-3xl items-center justify-center">
          <Text style={{ fontSize: 48 }}>🎉</Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300).duration(600)} className="items-center mb-10">
        <Text
          className="text-white text-[30px] text-center mb-3"
          style={{ fontFamily: 'Geist_700Bold', letterSpacing: -0.5 }}
        >
          You're all set!
        </Text>
        <Text
          className="text-white/60 text-base text-center leading-6"
          style={{ fontFamily: 'Geist_400Regular' }}
        >
          {role === 'landlord'
            ? "Your profile is under review. You'll be notified once verified and can start listing properties."
            : "Your account is ready. Start exploring thousands of verified homes today."}
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(500).duration(600)} className="w-full gap-3">
        <Button
          size="lg"
          onPress={handleEnter}
          className="bg-white rounded-2xl"
          style={{ height: 54 }}
        >
          <ButtonText
            className="text-[#0E7C7B] text-base"
            style={{ fontFamily: 'Geist_700Bold' }}
          >
            {role === 'landlord' ? 'Go to Dashboard' : 'Explore Homes'}
          </ButtonText>
        </Button>
      </Animated.View>
    </View>
  );
}
