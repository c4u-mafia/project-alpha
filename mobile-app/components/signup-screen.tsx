import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  FadeInDown
} from 'react-native-reanimated';
import { authClient } from '../lib/auth-client';
import { router } from 'expo-router';
import { useGlobalStore } from '../store/global-store';

const { width } = Dimensions.get('window');

export const SignupScreen = () => {
  const { role, setRole } = useGlobalStore();
  const [name, setName] = useState('');
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
    toggleTranslateX.value = withSpring(role === 'tenant' ? 0 : (width - 64) / 2 - 4);
  }, [role]);

  const toggleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: toggleTranslateX.value }]
  }));

  const handleSignup = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        email,
        password,
        name,
        role, // Send role for our backend auth hook
      } as any); // Cast as any because role is an additionalField
      
      if (error) {
        setErrorMsg(error.message || 'Signup failed');
      } else {
        router.replace('/(tabs)');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/(tabs)"
    });
    if (error) {
        setErrorMsg(error.message || 'Google Signup failed');
    } else {
        router.replace('/(tabs)'); 
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 px-8 pt-20 pb-12">
          {/* Logo Header */}
          <Animated.View entering={FadeInDown.delay(100).duration(800)} className="items-center mb-8">
            <Text className="text-[#006970] font-bold text-3xl mb-2 italic">Homelyn</Text>
            <Text className="text-4xl font-bold text-[#111827] mb-2">Create Account</Text>
            <Text className="text-neutral-500 text-lg leading-relaxed text-center px-4">
              Join the new standard of living.
            </Text>
          </Animated.View>

          {/* Role Toggle */}
          <Animated.View entering={FadeInDown.delay(200).duration(800)} className="bg-[#F3F4F6] rounded-3xl p-1 mb-8 flex-row relative h-16 items-center">
            <Animated.View 
              style={[toggleStyle]} 
              className="absolute left-1 h-[85%] w-[48.5%] bg-white rounded-2xl shadow-sm" 
            />
            <TouchableOpacity 
              onPress={() => handleToggle('tenant')}
              className="flex-1 items-center justify-center"
            >
              <Text className={`font-bold ${role === 'tenant' ? 'text-[#006970]' : 'text-neutral-400'}`}>Tenant</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleToggle('landlord')}
              className="flex-1 items-center justify-center"
            >
              <Text className={`font-bold ${role === 'landlord' ? 'text-[#006970]' : 'text-neutral-400'}`}>Landlord</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Form Fields */}
          <Animated.View entering={FadeInDown.delay(300).duration(800)} className="gap-5">
            {errorMsg ? <Text className="text-red-500 text-center font-bold">{errorMsg}</Text> : null}
            
            <View>
              <Text className="text-neutral-400 font-bold text-xs uppercase mb-2 ml-2 tracking-widest">Full Name</Text>
              <View className="bg-[#F3F4F6] p-4 rounded-3xl flex-row items-center">
                 <Text className="text-neutral-400 mr-4">👤</Text>
                 <TextInput 
                   placeholder="John Doe" 
                   value={name}
                   onChangeText={setName}
                   className="flex-1 text-lg font-medium"
                   placeholderTextColor="#A3A3A3"
                 />
              </View>
            </View>

            <View>
              <Text className="text-neutral-400 font-bold text-xs uppercase mb-2 ml-2 tracking-widest">Email Address</Text>
              <View className="bg-[#F3F4F6] p-4 rounded-3xl flex-row items-center">
                 <Text className="text-neutral-400 mr-4">✉</Text>
                 <TextInput 
                   placeholder="name@company.com" 
                   value={email}
                   onChangeText={setEmail}
                   autoCapitalize="none"
                   keyboardType="email-address"
                   className="flex-1 text-lg font-medium"
                   placeholderTextColor="#A3A3A3"
                 />
              </View>
            </View>

            <View>
              <Text className="text-neutral-400 font-bold text-xs uppercase mb-2 ml-2 tracking-widest">Password</Text>
              <View className="bg-[#F3F4F6] p-4 rounded-3xl flex-row items-center">
                 <Text className="text-neutral-400 mr-4">🔒</Text>
                 <TextInput 
                   placeholder="••••••••" 
                   value={password}
                   onChangeText={setPassword}
                   secureTextEntry={!showPassword}
                   className="flex-1 text-lg font-medium"
                   placeholderTextColor="#A3A3A3"
                 />
                 <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Text className="text-neutral-400">👁</Text>
                 </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

          {/* Signup Button */}
          <Animated.View entering={FadeInDown.delay(400).duration(800)} className="mt-8">
            <TouchableOpacity 
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.8}
              className="bg-[#006970] py-5 rounded-3xl items-center shadow-lg shadow-[#006970]/30"
            >
              {loading ? <ActivityIndicator color="#ffffff" /> : <Text className="text-white font-bold text-xl">Sign up</Text>}
            </TouchableOpacity>
          </Animated.View>

          {/* Divider */}
          <View className="my-8 flex-row items-center justify-center">
            <View className="h-[1px] bg-neutral-200 flex-1 mx-4" />
            <Text className="text-neutral-400 font-bold text-[10px] tracking-widest uppercase">Or continue with</Text>
            <View className="h-[1px] bg-neutral-200 flex-1 mx-4" />
          </View>

          {/* Social Buttons */}
          <View className="flex-row gap-4 mb-8">
            <TouchableOpacity onPress={handleGoogleSignup} className="flex-1 flex-row items-center justify-center border border-neutral-100 py-4 rounded-3xl">
              <Text className="mr-2">G</Text>
              <Text className="font-bold">Google</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 flex-row items-center justify-center border border-neutral-100 py-4 rounded-3xl">
              <Text className="mr-2"></Text>
              <Text className="font-bold">Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="items-center flex-row justify-center mb-8">
            <Text className="text-neutral-500 font-medium">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-[#006970] font-bold">Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
