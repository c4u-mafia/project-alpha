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
      <View className="px-6 pb-4 pt-14">
        <View className="mb-5 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center">
            <Ionicons name="arrow-back" size={22} color="#1A2332" />
          </TouchableOpacity>
          {onSkip && (
            <TouchableOpacity onPress={onSkip}>
              <Text className="text-sm text-charcoal/40" style={{ fontFamily: 'Geist_500Medium' }}>
                Skip for now
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Progress bar */}
        <View className="mb-6 flex-row gap-1.5">
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
            className="mb-1 text-xs uppercase tracking-widest text-charcoal/40"
            style={{ fontFamily: 'Geist_600SemiBold' }}>
            Step {step} of {total}
          </Text>
          <Text
            className="text-[24px] leading-[32px] text-charcoal"
            style={{ fontFamily: 'Geist_700Bold', letterSpacing: -0.3 }}>
            {title}
          </Text>
          {subtitle && (
            <Text
              className="mt-1.5 text-[14px] leading-5 text-charcoal/50"
              style={{ fontFamily: 'Geist_400Regular' }}>
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
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>{children}</Animated.View>
      </ScrollView>

      {/* Fixed bottom CTA */}
      <View className="border-t border-[#F0EBE4] px-6 pb-8 pt-4">
        <Button
          size="lg"
          onPress={onNext}
          isDisabled={loading || !canProceed}
          style={{
            height: 54,
            borderRadius: 14,
            backgroundColor: canProceed ? '#0E7C7B' : '#D0CCC6',
          }}>
          {loading ? (
            <ButtonSpinner color="#ffffff" />
          ) : (
            <ButtonText className="text-base text-white" style={{ fontFamily: 'Geist_700Bold' }}>
              {nextLabel}
            </ButtonText>
          )}
        </Button>
      </View>
    </View>
  );
};
