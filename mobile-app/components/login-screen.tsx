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
import { Text } from './ui/text';
import { Input, InputField, InputSlot } from './ui/input';
import { Button, ButtonText, ButtonSpinner } from './ui/button';
import { Ionicons } from '@expo/vector-icons';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setErrorMsg('Please enter your email address');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: 'sign-in',
      });
      if (error) {
        setErrorMsg(error.message || 'Failed to send code');
      } else {
        router.push({ pathname: '/verify-otp', params: { email, mode: 'sign-in' } });
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
          <Animated.View entering={FadeInDown.delay(100).duration(600)} className="mb-10">
            <Text
              className="mb-2 text-[28px] leading-[36px] text-charcoal"
              style={{ fontFamily: 'Geist_700Bold', letterSpacing: -0.5 }}>
              Welcome{'\n'}back.
            </Text>
            <Text
              className="text-[15px] text-charcoal/50"
              style={{ fontFamily: 'Geist_400Regular' }}>
              {"We'll send a code to your email to sign you in"}
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
                  onSubmitEditing={handleSendOtp}
                  className="text-charcoal"
                  placeholderTextColor="#C0BBC4"
                  style={{ fontFamily: 'Geist_400Regular' }}
                />
              </Input>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(350).duration(600)} className="mt-6">
            <Button
              size="lg"
              onPress={handleSendOtp}
              isDisabled={loading || !email.trim()}
              style={{
                height: 54,
                borderRadius: 14,
                backgroundColor: email.trim() ? '#0E7C7B' : '#D0CCC6',
              }}>
              {loading ? (
                <ButtonSpinner color="#ffffff" />
              ) : (
                <ButtonText
                  className="text-base text-white"
                  style={{ fontFamily: 'Geist_700Bold' }}>
                  Send Code
                </ButtonText>
              )}
            </Button>
          </Animated.View>

          {/* Divider */}
          <View className="my-6 flex-row items-center">
            <View className="h-[1px] flex-1 bg-[#E5E0D8]" />
            <Text
              className="mx-4 text-xs uppercase tracking-wider text-charcoal/30"
              style={{ fontFamily: 'Geist_500Medium' }}>
              Or
            </Text>
            <View className="h-[1px] flex-1 bg-[#E5E0D8]" />
          </View>

          {/* Social */}
          <View className="mb-6 flex-row gap-3">
            <Button
              size="lg"
              variant="outline"
              className="flex-1 rounded-xl border-[#E5E0D8] bg-white"
              style={{ height: 50 }}>
              <Text className="mr-1.5 text-sm">G</Text>
              <ButtonText
                className="text-sm text-charcoal"
                style={{ fontFamily: 'Geist_600SemiBold' }}>
                Google
              </ButtonText>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 rounded-xl border-[#E5E0D8] bg-white"
              style={{ height: 50 }}>
              <Text className="mr-1.5 text-sm"></Text>
              <ButtonText
                className="text-sm text-charcoal"
                style={{ fontFamily: 'Geist_600SemiBold' }}>
                Apple
              </ButtonText>
            </Button>
          </View>

          <View className="items-center">
            <TouchableOpacity onPress={() => router.push('/role-select')}>
              <Text className="text-sm text-charcoal/50" style={{ fontFamily: 'Geist_400Regular' }}>
                New to Homelyn?{' '}
                <Text className="text-[#0E7C7B]" style={{ fontFamily: 'Geist_600SemiBold' }}>
                  Create an account
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
