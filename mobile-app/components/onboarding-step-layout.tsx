import React from 'react';
import { View, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './ui/text';
import { Button, ButtonText, ButtonSpinner } from './ui/button';

interface Props {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  onNext: () => void;
  onSkip?: () => void;
  loading?: boolean;
  nextLabel?: string;
  canProceed?: boolean;
  children: React.ReactNode;
}

export const OnboardingStepLayout = ({
  step,
  total,
  title,
  subtitle,
  onNext,
  onSkip,
  loading = false,
  nextLabel = 'Continue',
  canProceed = true,
  children,
}: Props) => {
  return (
    <View className="flex-1 bg-cream">
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />

      {/* Fixed header */}
      <View className="px-6 pt-14 pb-4">
        <View className="flex-row items-center justify-between mb-5">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
            <Ionicons name="arrow-back" size={22} color="#1A2332" />
          </TouchableOpacity>
          {onSkip && (
            <TouchableOpacity onPress={onSkip}>
              <Text
                className="text-charcoal/40 text-sm"
                style={{ fontFamily: 'Geist_500Medium' }}
              >
                Skip for now
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Progress bar */}
        <View className="flex-row gap-1.5 mb-6">
          {Array.from({ length: total }).map((_, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 999,
                backgroundColor: i < step ? '#0E7C7B' : '#E5E0D8',
              }}
            />
          ))}
        </View>

        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Text
            className="text-charcoal/40 text-xs uppercase tracking-widest mb-1"
            style={{ fontFamily: 'Geist_600SemiBold' }}
          >
            Step {step} of {total}
          </Text>
          <Text
            className="text-charcoal text-[24px] leading-[32px]"
            style={{ fontFamily: 'Geist_700Bold', letterSpacing: -0.3 }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              className="text-charcoal/50 text-[14px] mt-1.5 leading-5"
              style={{ fontFamily: 'Geist_400Regular' }}
            >
              {subtitle}
            </Text>
          )}
        </Animated.View>
      </View>

      {/* Scrollable content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          {children}
        </Animated.View>
      </ScrollView>

      {/* Fixed bottom CTA */}
      <View className="px-6 pb-8 pt-4 border-t border-[#F0EBE4]">
        <Button
          size="lg"
          onPress={onNext}
          isDisabled={loading || !canProceed}
          style={{
            height: 54,
            borderRadius: 14,
            backgroundColor: canProceed ? '#0E7C7B' : '#D0CCC6',
          }}
        >
          {loading ? (
            <ButtonSpinner color="#ffffff" />
          ) : (
            <ButtonText
              className="text-white text-base"
              style={{ fontFamily: 'Geist_700Bold' }}
            >
              {nextLabel}
            </ButtonText>
          )}
        </Button>
      </View>
    </View>
  );
};
