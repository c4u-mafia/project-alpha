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

export const LoginScreen = () => {
  const { setRole } = useGlobalStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      const { data, error } = await authClient.signIn.email({ email, password });
      if (error) {
        setErrorMsg(error.message || 'Login failed');
      } else {
        const userRole = (data?.user as any)?.role ?? 'tenant';
        setRole(userRole);
        router.replace(userRole === 'landlord' ? '/(landlord)' : '/(tenant)');
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
      className="flex-1 bg-cream"
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 px-6 pt-14 pb-8">
          {/* Back */}
          <TouchableOpacity onPress={() => router.back()} className="mb-8 self-start">
            <Ionicons name="arrow-back" size={24} color="#1A2332" />
          </TouchableOpacity>

          {/* Header */}
          <Animated.View entering={FadeInDown.delay(100).duration(600)} className="mb-10">
            <Text
              className="text-charcoal text-[28px] leading-[36px] mb-2"
              style={{ fontFamily: 'Geist_700Bold', letterSpacing: -0.5 }}
            >
              Welcome{'\n'}back.
            </Text>
            <Text
              className="text-charcoal/50 text-[15px]"
              style={{ fontFamily: 'Geist_400Regular' }}
            >
              Sign in to continue to Homelyn
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View entering={FadeInDown.delay(200).duration(600)} className="gap-4">
            {errorMsg ? (
              <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <Text className="text-red-600 text-sm" style={{ fontFamily: 'Geist_500Medium' }}>
                  {errorMsg}
                </Text>
              </View>
            ) : null}

            <View>
              <Text
                className="text-charcoal/60 text-xs font-bold uppercase tracking-wider mb-2"
                style={{ fontFamily: 'Geist_600SemiBold' }}
              >
                Email Address
              </Text>
              <Input
                variant="rounded"
                size="lg"
                className="bg-white border border-[#E5E0D8] rounded-xl h-13"
              >
                <InputSlot className="pl-4">
                  <Ionicons name="mail-outline" size={18} color="#9CA3AF" />
                </InputSlot>
                <InputField
                  placeholder="chioma@gmail.com"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="text-charcoal"
                  placeholderTextColor="#C0BBC4"
                  style={{ fontFamily: 'Geist_400Regular' }}
                />
              </Input>
            </View>

            <View>
              <View className="flex-row justify-between mb-2">
                <Text
                  className="text-charcoal/60 text-xs font-bold uppercase tracking-wider"
                  style={{ fontFamily: 'Geist_600SemiBold' }}
                >
                  Password
                </Text>
                <TouchableOpacity>
                  <Text
                    className="text-[#0E7C7B] text-xs"
                    style={{ fontFamily: 'Geist_600SemiBold' }}
                  >
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </View>
              <Input
                variant="rounded"
                size="lg"
                className="bg-white border border-[#E5E0D8] rounded-xl h-13"
              >
                <InputSlot className="pl-4">
                  <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" />
                </InputSlot>
                <InputField
                  placeholder="Your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  className="text-charcoal"
                  placeholderTextColor="#C0BBC4"
                  style={{ fontFamily: 'Geist_400Regular' }}
                />
                <InputSlot className="pr-4" onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color="#9CA3AF"
                  />
                </InputSlot>
              </Input>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(350).duration(600)} className="mt-6">
            <Button
              size="lg"
              onPress={handleLogin}
              isDisabled={loading}
              style={{ height: 54, borderRadius: 14, backgroundColor: '#0E7C7B' }}
            >
              {loading ? (
                <ButtonSpinner color="#ffffff" />
              ) : (
                <ButtonText
                  className="text-white text-base"
                  style={{ fontFamily: 'Geist_700Bold' }}
                >
                  Sign In
                </ButtonText>
              )}
            </Button>
          </Animated.View>

          {/* Divider */}
          <View className="my-6 flex-row items-center">
            <View className="h-[1px] bg-[#E5E0D8] flex-1" />
            <Text
              className="text-charcoal/30 text-xs mx-4 uppercase tracking-wider"
              style={{ fontFamily: 'Geist_500Medium' }}
            >
              Or
            </Text>
            <View className="h-[1px] bg-[#E5E0D8] flex-1" />
          </View>

          {/* Social */}
          <View className="flex-row gap-3 mb-6">
            <Button
              size="lg"
              variant="outline"
              className="flex-1 border-[#E5E0D8] rounded-xl bg-white"
              style={{ height: 50 }}
            >
              <Text className="text-sm mr-1.5">G</Text>
              <ButtonText
                className="text-charcoal text-sm"
                style={{ fontFamily: 'Geist_600SemiBold' }}
              >
                Google
              </ButtonText>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 border-[#E5E0D8] rounded-xl bg-white"
              style={{ height: 50 }}
            >
              <Text className="text-sm mr-1.5"></Text>
              <ButtonText
                className="text-charcoal text-sm"
                style={{ fontFamily: 'Geist_600SemiBold' }}
              >
                Apple
              </ButtonText>
            </Button>
          </View>

          <View className="items-center">
            <TouchableOpacity onPress={() => router.push('/role-select')}>
              <Text
                className="text-charcoal/50 text-sm"
                style={{ fontFamily: 'Geist_400Regular' }}
              >
                New to Homelyn?{' '}
                <Text
                  className="text-[#0E7C7B]"
                  style={{ fontFamily: 'Geist_600SemiBold' }}
                >
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
