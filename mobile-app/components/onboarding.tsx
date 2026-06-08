import React, { memo, useRef, useState } from 'react';
import { View, Dimensions, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Text } from './ui/text';
import { Button, ButtonText } from './ui/button';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    emoji: '🏠',
    badge: 'DIRECT TO LANDLORD',
    title: 'Find homes from\nreal landlords.',
    description:
      "No agents, no hidden fees. Connect directly with verified landlords and close a deal in days, not weeks.",
    bg: '#0E7C7B',
    accent: '#D4EDE6',
  },
  {
    id: '2',
    emoji: '💳',
    badge: 'SMART PAYMENTS',
    title: 'Pay rent the\nsmart way.',
    description:
      "Securely pay rent, track your payment history, and get reminders before your next due date — all in one place.",
    bg: '#1A2332',
    accent: '#F2A65A',
  },
  {
    id: '3',
    emoji: '🤝',
    badge: 'RENT SPONSORSHIP',
    title: 'Family can help.\nLet them.',
    description:
      "Create a rent goal and share a link. Friends and family can contribute directly — anonymously or openly.",
    bg: '#0E7C7B',
    accent: '#D4EDE6',
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

  const slide = SLIDES[activeIndex];

  return (
    <View className="flex-1" style={{ backgroundColor: slide.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={slide.bg} />

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
          <View style={{ width }} className="px-8 pt-20 pb-4">
            <Animated.View entering={FadeIn.duration(500)} className="flex-1 justify-center pb-16">
              {/* Illustration */}
              <View
                className="w-32 h-32 rounded-3xl items-center justify-center mb-10"
                style={{ backgroundColor: `${item.accent}20` }}
              >
                <Text style={{ fontSize: 56 }}>{item.emoji}</Text>
              </View>

              {/* Badge */}
              <View
                className="self-start px-3 py-1.5 rounded-full mb-5"
                style={{ backgroundColor: `${item.accent}25` }}
              >
                <Text
                  className="text-[10px] font-bold tracking-widest"
                  style={{ color: item.accent, fontFamily: 'Geist_700Bold' }}
                >
                  {item.badge}
                </Text>
              </View>

              {/* Title */}
              <Text
                className="text-white text-[34px] leading-[42px] mb-4"
                style={{ fontFamily: 'Geist_700Bold', letterSpacing: -0.5 }}
              >
                {item.title}
              </Text>

              {/* Description */}
              <Text
                className="text-white/60 text-[15px] leading-6 pr-6"
                style={{ fontFamily: 'Geist_400Regular' }}
              >
                {item.description}
              </Text>
            </Animated.View>
          </View>
        )}
      />

      {/* Footer */}
      <Animated.View entering={FadeInDown.delay(200).duration(600)} className="px-8 pb-12">
        {/* Dots */}
        <View className="flex-row justify-center gap-2 mb-8">
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === activeIndex ? 28 : 8,
                height: 8,
                borderRadius: 999,
                backgroundColor: i === activeIndex ? 'white' : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </View>

        {/* CTA */}
        <Button
          size="lg"
          onPress={handleNext}
          className="bg-white rounded-2xl mb-3"
          style={{ height: 54 }}
        >
          <ButtonText
            className="text-[#0E7C7B] text-base"
            style={{ fontFamily: 'Geist_700Bold' }}
          >
            {activeIndex === SLIDES.length - 1 ? 'Get Started' : 'Continue'}
          </ButtonText>
        </Button>

        <TouchableOpacity
          onPress={() => router.push('/login')}
          className="items-center py-3"
        >
          <Text
            className="text-white/60 text-sm"
            style={{ fontFamily: 'Geist_400Regular' }}
          >
            I already have an account
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
});
