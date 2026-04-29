import React, { useState, useEffect } from 'react';
import { View, Dimensions, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  FadeInDown
} from 'react-native-reanimated';
import { authClient } from '../lib/auth-client';
import { router } from 'expo-router';
import { useGlobalStore } from '../store/global-store';
import { Heading } from './ui/heading';
import { Text as GluestackText } from './ui/text';
import { Input, InputField, InputSlot } from './ui/input';
import { Button, ButtonText, ButtonSpinner } from './ui/button';

const { width } = Dimensions.get('window');

export const LoginScreen = () => {
  const { role, setRole } = useGlobalStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleTranslateX = useSharedValue(0);

  const handleToggle = (newRole: 'tenant' | 'landlord') => {
    setRole(newRole);
  };

  useEffect(() => {
    toggleTranslateX.value = withSpring(role === 'tenant' ? 0 : (width - 48) / 2 - 4);
  }, [role]);

  const toggleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: toggleTranslateX.value }]
  }));

  const handleLogin = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });
      if (error) {
        setErrorMsg(error.message || 'Login failed');
      } else {
        router.replace('/(tabs)');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/(tabs)"
    });
    if (error) {
        setErrorMsg(error.message || 'Google Login failed');
    } else {
        router.replace('/(tabs)'); 
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background-0"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 px-5 pt-12 pb-6">
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(100).duration(600)} className="items-center mb-6">
            <Heading size="sm" className="text-primary-500 font-bold mb-2 italic">Homelyn</Heading>
            <Heading size="md" className="text-typography-900 mb-1">Welcome</Heading>
            <GluestackText size="sm" className="text-typography-500 text-center px-4">
              Sign in to continue
            </GluestackText>
          </Animated.View>

          {/* Role Toggle - Compact */}
          <Animated.View entering={FadeInDown.delay(200).duration(600)} className="bg-background-100 rounded-xl p-1 mb-5 flex-row relative h-10 items-center">
            <Animated.View 
              style={[toggleStyle]} 
              className="absolute left-1 h-[85%] w-[48.5%] bg-background-0 rounded-lg shadow-sm" 
            />
            <TouchableOpacity 
              onPress={() => handleToggle('tenant')}
              className="flex-1 items-center justify-center"
            >
              <GluestackText size="sm" className={`font-bold ${role === 'tenant' ? 'text-primary-500' : 'text-typography-400'}`}>Tenant</GluestackText>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleToggle('landlord')}
              className="flex-1 items-center justify-center"
            >
              <GluestackText size="sm" className={`font-bold ${role === 'landlord' ? 'text-primary-500' : 'text-typography-400'}`}>Landlord</GluestackText>
            </TouchableOpacity>
          </Animated.View>

          {/* Form - Minimal */}
          <Animated.View entering={FadeInDown.delay(300).duration(600)} className="gap-3">
            {errorMsg ? <GluestackText size="sm" className="text-error-500 text-center font-bold">{errorMsg}</GluestackText> : null}
            
            <View>
              <GluestackText size="2xs" className="text-typography-400 font-bold uppercase tracking-wider mb-1 ml-1">Email</GluestackText>
              <Input variant="rounded" size="md" className="bg-background-100 border-0 h-11">
                 <InputSlot className="pl-3">
                   <GluestackText size="sm" className="text-typography-400">✉</GluestackText>
                 </InputSlot>
                 <InputField 
                   placeholder="name@company.com" 
                   value={email}
                   onChangeText={setEmail}
                   autoCapitalize="none"
                   keyboardType="email-address"
                   className="text-sm"
                   placeholderTextColor="#A3A3A3"
                 />
              </Input>
            </View>

            <View>
              <View className="flex-row justify-between mb-1 ml-1">
                 <GluestackText size="2xs" className="text-typography-400 font-bold uppercase tracking-wider">Password</GluestackText>
                 <TouchableOpacity>
                   <GluestackText size="2xs" className="text-primary-500 font-bold tracking-wide">Forgot?</GluestackText>
                 </TouchableOpacity>
              </View>
              <Input variant="rounded" size="md" className="bg-background-100 border-0 h-11">
                 <InputSlot className="pl-3">
                   <GluestackText size="sm" className="text-typography-400">🔒</GluestackText>
                 </InputSlot>
                 <InputField 
                   placeholder="••••••••" 
                   value={password}
                   onChangeText={setPassword}
                   secureTextEntry={!showPassword}
                   className="text-sm"
                   placeholderTextColor="#A3A3A3"
                 />
                 <InputSlot className="pr-3" onPress={() => setShowPassword(!showPassword)}>
                    <GluestackText size="sm" className="text-typography-400">👁</GluestackText>
                 </InputSlot>
              </Input>
            </View>
          </Animated.View>

          {/* Login Button */}
          <Animated.View entering={FadeInDown.delay(400).duration(600)} className="mt-6">
            <Button 
              size="lg"
              onPress={handleLogin}
              isDisabled={loading}
              className="bg-primary-500 rounded-xl"
            >
              {loading ? <ButtonSpinner color="#ffffff" /> : <ButtonText className="text-typography-0 font-bold text-sm">Sign In</ButtonText>}
            </Button>
          </Animated.View>

          {/* Divider */}
          <View className="my-6 flex-row items-center justify-center">
            <View className="h-[1px] bg-outline-200 flex-1 mx-4" />
            <GluestackText size="2xs" className="text-typography-400 font-bold uppercase tracking-wider">Or</GluestackText>
            <View className="h-[1px] bg-outline-200 flex-1 mx-4" />
          </View>

          {/* Social - Minimal */}
          <View className="flex-row gap-3 mb-6">
            <Button size="lg" variant="outline" onPress={handleGoogleLogin} className="flex-1 border-outline-200 rounded-xl">
              <GluestackText size="sm" className="mr-1">G</GluestackText>
              <ButtonText className="text-typography-700 font-bold text-sm">Google</ButtonText>
            </Button>
            <Button size="lg" variant="outline" className="flex-1 border-outline-200 rounded-xl">
              <GluestackText size="sm" className="mr-1"></GluestackText>
              <ButtonText className="text-typography-700 font-bold text-sm">Apple</ButtonText>
            </Button>
          </View>

          {/* Footer */}
          <View className="items-center flex-row justify-center">
            <GluestackText size="sm" className="text-typography-500">New here? </GluestackText>
            <TouchableOpacity onPress={() => router.push('/sign-up')}>
              <GluestackText size="sm" className="text-primary-500 font-bold">Sign up</GluestackText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
