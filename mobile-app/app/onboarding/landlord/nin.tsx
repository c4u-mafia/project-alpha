import React, { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { OnboardingStepLayout } from '@/components/onboarding-step-layout';
import { Text } from '@/components/ui/text';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Ionicons } from '@expo/vector-icons';
import { authClient } from '@/lib/auth-client';

export default function LandlordNIN() {
  const [nin, setNin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canProceed = nin.length === 11;

  const handleNext = async () => {
    setLoading(true);
    setError('');
    try {
      const token = await authClient.getSession();
      const jwt = (token?.data as any)?.session?.token;
      const res = await fetch('http://localhost:3001/onboarding/landlord/nin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
        body: JSON.stringify({ nin }),
      });
      if (!res.ok) {
        const body = await res.json();
        setError(body.message || 'Failed to submit NIN');
        setLoading(false);
        return;
      }
    } catch (_) {}
    setLoading(false);
    router.push('/onboarding/landlord/documents');
  };

  return (
    <OnboardingStepLayout
      step={2}
      total={4}
      title="Verify your identity"
      subtitle="Required to publish listings on Homelyn."
      onNext={handleNext}
      loading={loading}
      canProceed={canProceed}
    >
      <View className="gap-4 mt-4">
        <View className="bg-mint rounded-2xl p-4 flex-row gap-3">
          <Ionicons name="shield-checkmark-outline" size={20} color="#0E7C7B" />
          <Text className="text-[#0E7C7B] text-[13px] flex-1 leading-5" style={{ fontFamily: 'Geist_400Regular' }}>
            Identity verification helps tenants trust you and unlocks listing creation.
          </Text>
        </View>

        {error ? (
          <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <Text className="text-red-600 text-sm" style={{ fontFamily: 'Geist_500Medium' }}>{error}</Text>
          </View>
        ) : null}

        <View>
          <Text className="text-charcoal/60 text-xs font-bold uppercase tracking-wider mb-2" style={{ fontFamily: 'Geist_600SemiBold' }}>
            National Identification Number (NIN)
          </Text>
          <Input variant="rounded" size="lg" className="bg-white border border-[#E5E0D8] rounded-xl h-13">
            <InputSlot className="pl-4">
              <Ionicons name="card-outline" size={18} color="#9CA3AF" />
            </InputSlot>
            <InputField
              placeholder="12345678901"
              value={nin}
              onChangeText={(v) => setNin(v.replace(/[^0-9]/g, '').slice(0, 11))}
              keyboardType="number-pad"
              maxLength={11}
              className="text-charcoal tracking-widest"
              placeholderTextColor="#C0BBC4"
              style={{ fontFamily: 'Geist_400Regular' }}
            />
            <InputSlot className="pr-4">
              <Text className="text-charcoal/30 text-xs" style={{ fontFamily: 'Geist_500Medium' }}>
                {nin.length}/11
              </Text>
            </InputSlot>
          </Input>
        </View>
      </View>
    </OnboardingStepLayout>
  );
}
