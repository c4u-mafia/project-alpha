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
      const res = await fetch('http://localhost:3000/onboarding/landlord/nin', {
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
    } catch {}
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
      canProceed={canProceed}>
      <View className="mt-4 gap-4">
        <View className="flex-row gap-3 rounded-2xl bg-mint p-4">
          <Ionicons name="shield-checkmark-outline" size={20} color="#0E7C7B" />
          <Text
            className="flex-1 text-[13px] leading-5 text-[#0E7C7B]"
            style={{ fontFamily: 'Geist_400Regular' }}>
            Identity verification helps tenants trust you and unlocks listing creation.
          </Text>
        </View>

        {error ? (
          <View className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <Text className="text-sm text-red-600" style={{ fontFamily: 'Geist_500Medium' }}>
              {error}
            </Text>
          </View>
        ) : null}

        <View>
          <Text
            className="mb-2 text-xs font-bold uppercase tracking-wider text-charcoal/60"
            style={{ fontFamily: 'Geist_600SemiBold' }}>
            National Identification Number (NIN)
          </Text>
          <Input
            variant="rounded"
            size="lg"
            className="h-13 rounded-xl border border-[#E5E0D8] bg-white">
            <InputSlot className="pl-4">
              <Ionicons name="card-outline" size={18} color="#9CA3AF" />
            </InputSlot>
            <InputField
              placeholder="12345678901"
              value={nin}
              onChangeText={(v) => setNin(v.replace(/[^0-9]/g, '').slice(0, 11))}
              keyboardType="number-pad"
              maxLength={11}
              className="tracking-widest text-charcoal"
              placeholderTextColor="#C0BBC4"
              style={{ fontFamily: 'Geist_400Regular' }}
            />
            <InputSlot className="pr-4">
              <Text className="text-xs text-charcoal/30" style={{ fontFamily: 'Geist_500Medium' }}>
                {nin.length}/11
              </Text>
            </InputSlot>
          </Input>
        </View>
      </View>
    </OnboardingStepLayout>
  );
}
