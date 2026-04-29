import React, { memo, useState } from 'react';
import { View, Dimensions, SafeAreaView } from 'react-native';
import Animated, { FadeInRight, FadeInDown, FadeOutLeft } from 'react-native-reanimated';
import { Text } from './ui/text';
import { Heading } from './ui/heading';
import { Button, ButtonText } from './ui/button';

const { width } = Dimensions.get('window');

const STEPS = [
  {
    id: 1,
    title: 'No Agents,\nNo Hassle.',
    description: "We've cut out the middleman. Chat directly with landlords and close deals in minutes, not days.",
    tagline: 'DIRECT TO LANDLORD',
  },
  {
    id: 2,
    title: 'Verified\nListings Only.',
    description: 'What you see is what you get. Every home is physically inspected for 100% authenticity.',
    tagline: 'VERIFIED',
  },
];

export const Onboarding = memo(({ onFinish }: { onFinish: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onFinish();
    }
  };

  const step = STEPS[currentStep];

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-1 px-8 pt-12 pb-8">
        
        {/* Header */}
        <View className="flex-row items-center justify-between mb-12">
          <Heading size="md" className="text-primary-500 italic font-bold">Homelyn</Heading>
          <Text className="text-typography-400 font-bold text-[10px] uppercase tracking-widest">
            Step {currentStep + 1} of 2
          </Text>
        </View>

        {/* Content */}
        <View className="flex-1 justify-center pb-20">
          <Animated.View 
            key={currentStep}
            entering={FadeInRight.duration(400).springify()}
            exiting={FadeOutLeft.duration(300)}
            className="items-start"
          >
            <View className="bg-primary-50 px-3 py-1.5 rounded-full mb-6 border border-primary-100">
              <Text className="text-primary-600 font-bold text-[9px] tracking-widest uppercase">
                {step.tagline}
              </Text>
            </View>
            
            <Heading size="3xl" className="text-typography-900 leading-[40px] mb-4">
              {step.title}
            </Heading>
            
            <Text className="text-typography-500 text-sm leading-relaxed pr-8">
              {step.description}
            </Text>
          </Animated.View>
        </View>

        {/* Footer Actions */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} className="gap-4">
          <View className="flex-row justify-center gap-2 mb-6">
            {STEPS.map((_, index) => (
              <View 
                key={index} 
                className={`h-1.5 rounded-full ${index === currentStep ? 'w-8 bg-primary-500' : 'w-2 bg-outline-200'}`}
              />
            ))}
          </View>

          <Button 
            size="lg" 
            onPress={handleNext}
            className="bg-primary-500 rounded-2xl shadow-sm w-full"
          >
            <ButtonText className="text-typography-0 font-bold text-base">
              {currentStep === STEPS.length - 1 ? "Continue" : "Next"}
            </ButtonText>
          </Button>
          
          <Button size="lg" variant="link" onPress={onFinish} className="w-full">
            <ButtonText className="text-typography-400 font-medium text-sm">Skip</ButtonText>
          </Button>
        </Animated.View>
        
      </View>
    </SafeAreaView>
  );
});
