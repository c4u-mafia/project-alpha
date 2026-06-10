import React, { useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { authClient } from '../lib/auth-client';
import { router } from 'expo-router';
import { useGlobalStore } from '../store/global-store';
import { Text } from './ui/text';
import { Input, InputField, InputSlot } from './ui/input';
import { Button, ButtonText, ButtonSpinner } from './ui/button';
import { Ionicons } from '@expo/vector-icons';

const randomPassword = () =>
  Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2).toUpperCase() + '!';

export const SignupScreen = () => {
  const { role } = useGlobalStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignup = async () => {
    setErrorMsg('');
    if (!name.trim() || !email.trim()) {
      setErrorMsg('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        email,
        password: randomPassword(),
        name,
        role,
      } as any);

      if (error) {
        setErrorMsg(error.message || 'Signup failed');
      } else {
        await authClient.emailOtp.sendVerificationOtp({
          email,
          type: 'email-verification',
        });
        router.push({ pathname: '/verify-otp', params: { email, mode: 'verify' } });
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-cream">
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 px-6 pb-8 pt-14">
          {/* Back */}
          <TouchableOpacity onPress={() => router.back()} className="mb-8 self-start">
            <Ionicons name="arrow-back" size={24} color="#1A2332" />
          </TouchableOpacity>

          {/* Header */}
          <Animated.View entering={FadeInDown.delay(100).duration(600)} className="mb-8">
            <Text
              className="mb-2 text-[28px] leading-[36px] text-charcoal"
              style={{ fontFamily: 'Geist_700Bold', letterSpacing: -0.5 }}>
              Create your{'\n'}account
            </Text>
            <Text
              className="text-[15px] text-charcoal/50"
              style={{ fontFamily: 'Geist_400Regular' }}>
              Joining as a{' '}
              <Text className="text-[#0E7C7B]" style={{ fontFamily: 'Geist_600SemiBold' }}>
                {role}
              </Text>
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View entering={FadeInDown.delay(200).duration(600)} className="gap-4">
            {errorMsg ? (
              <View className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <Text className="text-sm text-red-600" style={{ fontFamily: 'Geist_500Medium' }}>
                  {errorMsg}
                </Text>
              </View>
            ) : null}

            <View>
              <Text
                className="mb-2 text-xs font-bold uppercase tracking-wider text-charcoal/60"
                style={{ fontFamily: 'Geist_600SemiBold' }}>
                Full Name
              </Text>
              <Input
                variant="rounded"
                size="lg"
                className="h-13 rounded-xl border border-[#E5E0D8] bg-white">
                <InputSlot className="pl-4">
                  <Ionicons name="person-outline" size={18} color="#9CA3AF" />
                </InputSlot>
                <InputField
                  placeholder="Chioma Okafor"
                  value={name}
                  onChangeText={setName}
                  returnKeyType="next"
                  className="text-charcoal"
                  placeholderTextColor="#C0BBC4"
                  style={{ fontFamily: 'Geist_400Regular' }}
                />
              </Input>
            </View>

            <View>
              <Text
                className="mb-2 text-xs font-bold uppercase tracking-wider text-charcoal/60"
                style={{ fontFamily: 'Geist_600SemiBold' }}>
                Email Address
              </Text>
              <Input
                variant="rounded"
                size="lg"
                className="h-13 rounded-xl border border-[#E5E0D8] bg-white">
                <InputSlot className="pl-4">
                  <Ionicons name="mail-outline" size={18} color="#9CA3AF" />
                </InputSlot>
                <InputField
                  placeholder="chioma@gmail.com"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="done"
                  onSubmitEditing={handleSignup}
                  className="text-charcoal"
                  placeholderTextColor="#C0BBC4"
                  style={{ fontFamily: 'Geist_400Regular' }}
                />
              </Input>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(600)} className="mt-2 px-1">
            <Text className="text-xs text-charcoal/40" style={{ fontFamily: 'Geist_400Regular' }}>
              {"We'll email you a verification code. No password needed."}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(350).duration(600)} className="mt-6">
            <Button
              size="lg"
              onPress={handleSignup}
              isDisabled={loading}
              style={{ height: 54, borderRadius: 14, backgroundColor: '#0E7C7B' }}>
              {loading ? (
                <ButtonSpinner color="#ffffff" />
              ) : (
                <ButtonText
                  className="text-base text-white"
                  style={{ fontFamily: 'Geist_700Bold' }}>
                  Create Account
                </ButtonText>
              )}
            </Button>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(450).duration(600)}
            className="mt-6 items-center">
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text className="text-sm text-charcoal/50" style={{ fontFamily: 'Geist_400Regular' }}>
                Already have an account?{' '}
                <Text className="text-[#0E7C7B]" style={{ fontFamily: 'Geist_600SemiBold' }}>
                  Sign in
                </Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
