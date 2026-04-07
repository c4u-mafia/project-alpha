import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  interpolate,
  useDerivedValue
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const STEPS = [
  {
    id: 1,
    title: 'No Agents,\nNo Hassle.',
    description: "We've cut out the middleman. Chat directly with landlords and close deals in minutes, not days.",
    tagline: 'DIRECT TO LANDLORD',
    color: '#006970',
    type: 'dark',
    subtext: 'YOUR URBAN SANCTUARY AWAITS'
  },
  {
    id: 2,
    title: 'Verified\nListings Only',
    description: 'What you see is what you get. Every home is physically inspected for 100% authenticity.',
    tagline: 'VERIFIED',
    color: '#004D53',
    type: 'light',
    subtext: 'QUALITY ASSURED'
  }
];

export const Onboarding = ({ onFinish }: { onFinish: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const stepProgress = useSharedValue(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      stepProgress.value = withSpring(currentStep + 1);
    } else {
      onFinish();
    }
  };

  const handleSkip = () => {
    onFinish();
  };

  const contentStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: -stepProgress.value * width }
      ]
    };
  });

  const indicatorStyle = (index: number) => useAnimatedStyle(() => {
    const isActive = Math.round(stepProgress.value) === index;
    return {
      width: withSpring(isActive ? 32 : 12),
      opacity: isActive ? 1 : 0.3,
      backgroundColor: STEPS[currentStep].type === 'dark' ? '#FFFFFF' : '#006970'
    };
  });

  const step = STEPS[currentStep];

  return (
    <View className={`flex-1 ${step.type === 'dark' ? 'bg-[#111827]' : 'bg-white'}`}>
      {/* Background Section (Simulating image with color/layout) */}
      <View className="h-1/2 w-full relative">
        {step.type === 'dark' ? (
          <View className="flex-1 bg-[#004D53] items-center justify-center">
             <View className="w-48 h-48 rounded-full bg-white/5 absolute -top-12 -right-12" />
             <View className="w-64 h-64 rounded-full bg-white/5 absolute -bottom-24 -left-12" />
             <View className="bg-white/10 px-4 py-2 rounded-full border border-white/20">
               <Text className="text-white font-bold tracking-widest text-xs">{step.tagline}</Text>
             </View>
          </View>
        ) : (
          <View className="flex-1 bg-[#F3F4F6] items-center justify-center p-8">
            <View className="bg-white p-4 rounded-3xl shadow-xl w-full">
               <View className="h-48 bg-[#006970] rounded-2xl mb-4 relative overflow-hidden">
                  <View className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full">
                    <Text className="text-[#006970] text-[10px] font-bold">VERIFIED</Text>
                  </View>
               </View>
               <View className="flex-row justify-between items-center">
                 <View>
                   <Text className="font-bold text-lg">Azure Bay Apartment</Text>
                   <Text className="text-neutral-400 text-sm">Victoria Island, Lagos</Text>
                 </View>
                 <Text className="text-[#006970] font-bold text-lg">N4.5M</Text>
               </View>
            </View>
          </View>
        )}
        
        {/* Header Overlay */}
        <View className="absolute top-12 left-0 right-0 px-8 flex-row justify-between items-center">
          <Text className={`font-bold text-xl ${step.type === 'dark' ? 'text-white' : 'text-[#006970]'}`}>RentDirect</Text>
          <TouchableOpacity onPress={handleSkip}>
            <View className={`px-4 py-1.5 rounded-full ${step.type === 'dark' ? 'bg-white/20' : 'bg-[#006970]/10'}`}>
              <Text className={`font-semibold ${step.type === 'dark' ? 'text-white' : 'text-[#006970]'}`}>Skip</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Section */}
      <View className="flex-1 px-8 pt-10">
        <View className="flex-row gap-2 mb-10">
           {STEPS.map((_, i) => (
             <Animated.View key={i} style={indicatorStyle(i)} className="h-2 rounded-full" />
           ))}
        </View>

        <Text className={`text-5xl font-bold mb-6 tracking-tight ${step.type === 'dark' ? 'text-white' : 'text-[#111827]'}`}>
          {step.title}
        </Text>

        <Text className={`text-lg leading-relaxed mb-12 ${step.type === 'dark' ? 'text-white/60' : 'text-neutral-500'}`}>
          {step.description}
        </Text>

        <View className="mt-auto mb-16 items-center">
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={handleNext}
            className={`w-full py-5 rounded-3xl flex-row items-center justify-center ${step.type === 'dark' ? 'bg-white' : 'bg-[#004D53]'}`}
          >
            <Text className={`font-bold text-xl mr-2 ${step.type === 'dark' ? 'text-[#004D53]' : 'text-white'}`}>
              Next
            </Text>
            <Text className={`text-xl ${step.type === 'dark' ? 'text-[#004D53]' : 'text-white'}`}>→</Text>
          </TouchableOpacity>
          
          <Text className="mt-6 text-neutral-400 tracking-[4px] text-[10px] font-bold uppercase">
             {step.subtext}
          </Text>
        </View>
      </View>
    </View>
  );
};
