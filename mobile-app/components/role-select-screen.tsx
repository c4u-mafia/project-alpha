import React, { useState } from 'react';
import { View, TouchableOpacity, StatusBar } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { router } from 'expo-router';
import { useGlobalStore } from '@/store/global-store';
import { Text } from './ui/text';
import { Button, ButtonText } from './ui/button';

const ROLES = [
  {
    id: 'tenant' as const,
    emoji: '🔑',
    title: "I'm looking for a place",
    subtitle: 'Find verified homes, pay rent seamlessly, and track your tenancy health.',
    badge: 'TENANT',
  },
  {
    id: 'landlord' as const,
    emoji: '🏠',
    title: 'I have property to rent',
    subtitle: 'List your property, vet tenants, and manage all your rentals in one place.',
    badge: 'LANDLORD',
  },
];

export const RoleSelectScreen = () => {
  const { setRole } = useGlobalStore();
  const [selected, setSelected] = useState<'tenant' | 'landlord' | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    setRole(selected);
    router.push('/sign-up');
  };

  return (
    <View className="flex-1 bg-cream px-6 pt-16 pb-10">
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />

      <Animated.View entering={FadeInDown.delay(100).duration(600)} className="mb-10">
        <Text
          className="text-charcoal text-[13px] font-bold tracking-widest uppercase mb-3"
          style={{ fontFamily: 'Geist_700Bold' }}
        >
          HOMELYN
        </Text>
        <Text
          className="text-charcoal text-[30px] leading-[38px]"
          style={{ fontFamily: 'Geist_700Bold', letterSpacing: -0.5 }}
        >
          How will you{'\n'}use Homelyn?
        </Text>
        <Text
          className="text-charcoal/50 text-base mt-3"
          style={{ fontFamily: 'Geist_400Regular' }}
        >
          You can change this later in settings.
        </Text>
      </Animated.View>

      <View className="gap-4 flex-1">
        {ROLES.map((role, i) => {
          const isSelected = selected === role.id;
          return (
            <Animated.View key={role.id} entering={FadeInDown.delay(200 + i * 100).duration(600)}>
              <TouchableOpacity
                onPress={() => setSelected(role.id)}
                activeOpacity={0.85}
                style={{
                  borderWidth: 2,
                  borderColor: isSelected ? '#0E7C7B' : '#E5E0D8',
                  borderRadius: 20,
                  backgroundColor: isSelected ? '#F0FAF9' : 'white',
                  padding: 22,
                }}
              >
                <View className="flex-row items-start gap-4">
                  <View
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      backgroundColor: isSelected ? '#D4EDE6' : '#F5F5F0',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 26 }}>{role.emoji}</Text>
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text
                        className="text-charcoal text-[17px]"
                        style={{ fontFamily: 'Geist_600SemiBold' }}
                      >
                        {role.title}
                      </Text>
                    </View>
                    <Text
                      className="text-charcoal/50 text-[13px] leading-5"
                      style={{ fontFamily: 'Geist_400Regular' }}
                    >
                      {role.subtitle}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      borderWidth: 2,
                      borderColor: isSelected ? '#0E7C7B' : '#D0CCC6',
                      backgroundColor: isSelected ? '#0E7C7B' : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 2,
                    }}
                  >
                    {isSelected && (
                      <Text className="text-white text-xs font-bold">✓</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      <Animated.View entering={FadeInDown.delay(500).duration(600)} className="mt-6 gap-3">
        <Button
          size="lg"
          onPress={handleContinue}
          isDisabled={!selected}
          style={{
            height: 54,
            borderRadius: 14,
            backgroundColor: selected ? '#0E7C7B' : '#D0CCC6',
          }}
        >
          <ButtonText
            className="text-white text-base"
            style={{ fontFamily: 'Geist_700Bold' }}
          >
            Continue
          </ButtonText>
        </Button>

        <TouchableOpacity onPress={() => router.push('/login')} className="items-center py-2">
          <Text
            className="text-charcoal/50 text-sm"
            style={{ fontFamily: 'Geist_400Regular' }}
          >
            Already have an account?{' '}
            <Text
              className="text-[#0E7C7B]"
              style={{ fontFamily: 'Geist_600SemiBold' }}
            >
              Sign in
            </Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};
