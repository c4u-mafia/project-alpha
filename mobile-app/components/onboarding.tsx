import React, { memo, useRef, useState } from 'react';
import { View, Dimensions, FlatList, TouchableOpacity, StatusBar, Image } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Text } from './ui/text';
import { Button, ButtonText } from './ui/button';
import { router } from 'expo-router';

import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect } from 'react-native-svg';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Real homes.\nReal landlords.',
    description: 'Every listing verified. No agents.',
    image: require('../assets/photos/exterior-1.jpg'),
  },
  {
    id: '2',
    title: 'Pay rent\nyour way.',
    description: 'Monthly, quarterly, or yearly.',
    image: require('../assets/photos/living-1.jpg'),
  },
  {
    id: '3',
    title: 'Family\ncan help.',
    description: 'Share a goal. They chip in.',
    image: require('../assets/photos/living-2.jpg'),
  },
];

export const Onboarding = memo(({ onFinish }: { onFinish: () => void }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(idx);
  };

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      onFinish();
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        renderItem={({ item }) => (
          <View style={{ width }} className="flex-1">
            {/* Photo area — fills top ~50% */}
            <View style={{ height: '52%' }} className="relative">
              <Image
                source={item.image}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
              {/* Perfect gradient overlay using react-native-svg */}
              <Svg
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
                width="100%"
                height="100%"
              >
                <Defs>
                  <SvgLinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor="#000000" stopOpacity={0.25} />
                    <Stop offset="45%" stopColor="#ffffff" stopOpacity={0} />
                    <Stop offset="65%" stopColor="#ffffff" stopOpacity={0} />
                    <Stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
                  </SvgLinearGradient>
                </Defs>
                <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
              </Svg>
            </View>

            {/* Text content — bottom half */}
            <View className="flex-1 px-7" style={{ paddingTop: 4 }}>
              <Text
                className="mb-2.5 text-[24px] leading-[30px] text-charcoal"
                style={{ fontFamily: 'Geist_700Bold', letterSpacing: -0.6 }}>
                {item.title}
              </Text>
              <Text
                className="text-[13.5px] leading-[22px]"
                style={{ fontFamily: 'Geist_400Regular', color: '#8A909C' }}>
                {item.description}
              </Text>
            </View>
          </View>
        )}
      />

      {/* Footer */}
      <Animated.View entering={FadeInDown.delay(200).duration(600)} className="px-7 pb-10">
        {/* Dots */}
        <View className="mb-5 flex-row gap-1.5">
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === activeIndex ? 22 : 5,
                height: 5,
                borderRadius: 3,
                backgroundColor: i === activeIndex ? '#0E7C7B' : 'rgba(26,35,50,0.1)',
              }}
            />
          ))}
        </View>

        {/* CTA — charcoal background matching design */}
        <Button
          size="lg"
          onPress={handleNext}
          className="mb-3 rounded-2xl"
          style={{ height: 50, backgroundColor: '#1A2332', borderRadius: 13 }}>
          <ButtonText className="text-sm text-white" style={{ fontFamily: 'Geist_600SemiBold' }}>
            {activeIndex === SLIDES.length - 1 ? 'Get started' : 'Continue'}
          </ButtonText>
        </Button>

        <TouchableOpacity onPress={() => router.push('/login')} className="items-center py-2">
          <Text
            className="text-[13px]"
            style={{ fontFamily: 'Geist_400Regular', color: '#8A909C' }}>
            I have an account
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
});
