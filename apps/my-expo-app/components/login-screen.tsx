import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  withDelay,
  FadeInDown
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [role, setRole] = useState<'tenant' | 'landlord'>('tenant');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const toggleTranslateX = useSharedValue(0);

  const handleToggle = (newRole: 'tenant' | 'landlord') => {
    setRole(newRole);
    toggleTranslateX.value = withSpring(newRole === 'tenant' ? 0 : (width - 64) / 2 - 4);
  };

  const toggleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: toggleTranslateX.value }]
  }));

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 px-8 pt-20 pb-12">
          {/* Logo Header */}
          <Animated.View entering={FadeInDown.delay(100).duration(800)} className="items-center mb-10">
            <Text className="text-[#006970] font-bold text-3xl mb-4 italic">RentDirect</Text>
            <Text className="text-4xl font-bold text-[#111827] mb-2">Welcome Back</Text>
            <Text className="text-neutral-500 text-lg leading-relaxed text-center px-4">
              Continue your journey in urban curation.
            </Text>
          </Animated.View>

          {/* Role Toggle */}
          <Animated.View entering={FadeInDown.delay(200).duration(800)} className="bg-[#F3F4F6] rounded-3xl p-1 mb-10 flex-row relative h-16 items-center">
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
          <Animated.View entering={FadeInDown.delay(300).duration(800)} className="gap-6">
            <View>
              <Text className="text-neutral-400 font-bold text-xs uppercase mb-3 ml-2 tracking-widest">Email Address</Text>
              <View className="bg-[#F3F4F6] p-5 rounded-3xl flex-row items-center">
                 <Text className="text-neutral-400 mr-4">✉</Text>
                 <TextInput 
                   placeholder="name@company.com" 
                   value={email}
                   onChangeText={setEmail}
                   className="flex-1 text-lg font-medium"
                   placeholderTextColor="#A3A3A3"
                 />
              </View>
            </View>

            <View>
              <View className="flex-row justify-between mb-3 ml-2">
                 <Text className="text-neutral-400 font-bold text-xs uppercase tracking-widest">Password</Text>
                 <TouchableOpacity>
                   <Text className="text-[#006970] font-bold text-xs tracking-widest">Forgot?</Text>
                 </TouchableOpacity>
              </View>
              <View className="bg-[#F3F4F6] p-5 rounded-3xl flex-row items-center">
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

          {/* Login Button */}
          <Animated.View entering={FadeInDown.delay(400).duration(800)} className="mt-10">
            <TouchableOpacity 
              onPress={onLogin}
              activeOpacity={0.8}
              className="bg-[#006970] py-5 rounded-3xl items-center shadow-lg shadow-[#006970]/30"
            >
              <Text className="text-white font-bold text-xl">Login</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Divider */}
          <View className="my-10 flex-row items-center justify-center">
            <View className="h-[1px] bg-neutral-200 flex-1 mx-4" />
            <Text className="text-neutral-400 font-bold text-[10px] tracking-widest uppercase">Or continue with</Text>
            <View className="h-[1px] bg-neutral-200 flex-1 mx-4" />
          </View>

          {/* Social Buttons */}
          <View className="flex-row gap-4 mb-10">
            <TouchableOpacity className="flex-1 flex-row items-center justify-center border border-neutral-100 py-4 rounded-3xl">
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
            <Text className="text-neutral-500 font-medium">Don't have an account? </Text>
            <TouchableOpacity>
              <Text className="text-[#006970] font-bold">Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
