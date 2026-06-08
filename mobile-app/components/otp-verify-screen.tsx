import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router';
import { authClient } from '@/lib/auth-client';
import { useGlobalStore } from '@/store/global-store';
import { Text } from './ui/text';
import { Button, ButtonText, ButtonSpinner } from './ui/button';
import { Ionicons } from '@expo/vector-icons';

const OTP_LENGTH = 6;

export const OTPVerifyScreen = () => {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { role, setRole } = useGlobalStore();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(59);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  const handleChange = (val: string, index: number) => {
    const digit = val.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (newOtp.every((d) => d !== '') && digit) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (code?: string) => {
    const finalCode = code ?? otp.join('');
    if (finalCode.length < OTP_LENGTH) return;
    setErrorMsg('');
    setLoading(true);
    try {
      const { error } = await authClient.emailOtp.verifyEmail({
        email: email!,
        otp: finalCode,
      });
      if (error) {
        setErrorMsg('Invalid or expired code. Try again.');
        setOtp(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      } else {
        const session = await authClient.getSession();
        const userRole = (session?.data?.user as any)?.role ?? role;
        setRole(userRole);
        router.replace(
          userRole === 'landlord'
            ? '/onboarding/landlord/profile'
            : '/onboarding/tenant/basic-info'
        );
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setResendTimer(59);
    await authClient.emailOtp.sendVerificationOtp({
      email: email!,
      type: 'email-verification',
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-cream"
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
      <View className="flex-1 px-6 pt-14 pb-10">
        <TouchableOpacity onPress={() => router.back()} className="mb-8 self-start">
          <Ionicons name="arrow-back" size={24} color="#1A2332" />
        </TouchableOpacity>

        <Animated.View entering={FadeInDown.delay(100).duration(600)} className="mb-10">
          <View className="w-14 h-14 bg-mint rounded-2xl items-center justify-center mb-5">
            <Ionicons name="mail-unread-outline" size={26} color="#0E7C7B" />
          </View>
          <Text
            className="text-charcoal text-[28px] leading-[36px] mb-2"
            style={{ fontFamily: 'Geist_700Bold', letterSpacing: -0.5 }}
          >
            Check your{'\n'}email
          </Text>
          <Text
            className="text-charcoal/50 text-[15px] leading-6"
            style={{ fontFamily: 'Geist_400Regular' }}
          >
            We sent a 6-digit code to{'\n'}
            <Text
              className="text-charcoal"
              style={{ fontFamily: 'Geist_600SemiBold' }}
            >
              {email}
            </Text>
          </Text>
        </Animated.View>

        {/* OTP Input */}
        <Animated.View entering={FadeInDown.delay(250).duration(600)}>
          {errorMsg ? (
            <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
              <Text className="text-red-600 text-sm" style={{ fontFamily: 'Geist_500Medium' }}>
                {errorMsg}
              </Text>
            </View>
          ) : null}

          <View className="flex-row gap-3 justify-between mb-8">
            {Array.from({ length: OTP_LENGTH }).map((_, i) => (
              <TextInput
                key={i}
                ref={(ref) => { inputRefs.current[i] = ref; }}
                value={otp[i]}
                onChangeText={(val) => handleChange(val, i)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                style={{
                  flex: 1,
                  height: 58,
                  borderRadius: 14,
                  borderWidth: 2,
                  borderColor: otp[i] ? '#0E7C7B' : '#E5E0D8',
                  backgroundColor: otp[i] ? '#F0FAF9' : 'white',
                  textAlign: 'center',
                  fontSize: 22,
                  fontFamily: 'Geist_700Bold',
                  color: '#1A2332',
                }}
              />
            ))}
          </View>

          <Button
            size="lg"
            onPress={() => handleVerify()}
            isDisabled={loading || otp.some((d) => !d)}
            style={{
              height: 54,
              borderRadius: 14,
              backgroundColor: otp.every((d) => d) ? '#0E7C7B' : '#D0CCC6',
            }}
          >
            {loading ? (
              <ButtonSpinner color="#ffffff" />
            ) : (
              <ButtonText
                className="text-white text-base"
                style={{ fontFamily: 'Geist_700Bold' }}
              >
                Verify Email
              </ButtonText>
            )}
          </Button>
        </Animated.View>

        <Animated.View
          entering={FadeIn.delay(500).duration(600)}
          className="mt-8 items-center"
        >
          <Text
            className="text-charcoal/40 text-sm mb-1"
            style={{ fontFamily: 'Geist_400Regular' }}
          >
            Didn't get the code?
          </Text>
          <TouchableOpacity onPress={handleResend} disabled={resendTimer > 0}>
            <Text
              className={`text-sm ${resendTimer > 0 ? 'text-charcoal/30' : 'text-[#0E7C7B]'}`}
              style={{ fontFamily: 'Geist_600SemiBold' }}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};
