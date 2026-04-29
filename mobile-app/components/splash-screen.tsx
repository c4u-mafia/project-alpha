import React, { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  withDelay
} from 'react-native-reanimated';
import { Logo } from './logo';
import { Text } from './ui/text';
import { Button, ButtonText, ButtonIcon } from './ui/button';

const { height } = Dimensions.get('window');

export const SplashScreen = ({ onNext }: { onNext: () => void }) => {
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(10);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(50);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withSpring(1);
    
    textOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    textTranslateY.value = withDelay(400, withSpring(0));
    
    buttonOpacity.value = withDelay(800, withTiming(1, { duration: 600 }));
    buttonTranslateY.value = withDelay(800, withSpring(0));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  return (
    <View className="flex-1 bg-[#004D53] items-center justify-center">
      <Animated.View style={logoStyle}>
        <Logo size="md" />
      </Animated.View>

      <Animated.View style={textStyle} className="mt-4 px-10">
        <Text className="text-white/70 text-center text-sm leading-relaxed">
          Curated spaces for the urban visionary.
        </Text>
      </Animated.View>

      <Animated.View 
        style={buttonStyle} 
        className="absolute bottom-12 w-full px-6"
      >
        <Button
          size="lg"
          variant="solid"
          action="primary"
          onPress={onNext}
          className="bg-white rounded-2xl flex-row justify-center py-3"
        >
          <ButtonText className="text-[#004D53] font-bold text-base mr-2">
            Enter the City
          </ButtonText>
          <Text className="text-[#004D53] text-base">→</Text>
        </Button>
        
        <View className="mt-5 flex-row justify-center gap-4">
          <Text className="text-white/40 text-[10px] tracking-widest uppercase">
            Victoria Island • Lekki • Ikoyi
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};
