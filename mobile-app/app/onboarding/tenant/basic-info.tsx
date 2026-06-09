import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { OnboardingStepLayout } from '@/components/onboarding-step-layout';
import { Text } from '@/components/ui/text';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Ionicons } from '@expo/vector-icons';
import { authClient } from '@/lib/auth-client';

const GENDERS = ['Male', 'Female', 'Prefer not to say'];

export default function TenantBasicInfo() {
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  const canProceed = phone.length >= 11 && dob.length === 10 && !!gender && city.length > 1;

  const handleNext = async () => {
    setLoading(true);
    try {
      const token = await authClient.getSession();
      const jwt = (token?.data as any)?.session?.token;
      await fetch('http://localhost:3001/me/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          phone: `+234${phone.replace(/^0/, '')}`,
          dateOfBirth: dob,
          gender: gender.toLowerCase().replace(/ /g, '_'),
          city,
        }),
      });
    } catch {}
    setLoading(false);
    router.push('/onboarding/tenant/nin');
  };

  const formatDob = (val: string) => {
    const clean = val.replace(/[^0-9]/g, '').slice(0, 8);
    let out = '';
    if (clean.length > 4) out = `${clean.slice(0, 4)}-${clean.slice(4)}`;
    if (clean.length > 6) out = `${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6)}`;
    if (clean.length <= 4) out = clean;
    setDob(out);
  };

  return (
    <OnboardingStepLayout
      step={1}
      total={4}
      title="Tell us about yourself"
      subtitle="This helps us personalise your experience."
      onNext={handleNext}
      onSkip={() => router.push('/onboarding/tenant/nin')}
      loading={loading}
      canProceed={canProceed}>
      <View className="mt-4 gap-4">
        {/* Phone */}
        <View>
          <Text
            className="mb-2 text-xs font-bold uppercase tracking-wider text-charcoal/60"
            style={{ fontFamily: 'Geist_600SemiBold' }}>
            Phone Number
          </Text>
          <Input
            variant="rounded"
            size="lg"
            className="h-13 rounded-xl border border-[#E5E0D8] bg-white">
            <InputSlot className="pl-4">
              <Text className="text-sm text-charcoal/50" style={{ fontFamily: 'Geist_500Medium' }}>
                +234
              </Text>
            </InputSlot>
            <InputField
              placeholder="0801 234 5678"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={11}
              className="text-charcoal"
              placeholderTextColor="#C0BBC4"
              style={{ fontFamily: 'Geist_400Regular' }}
            />
          </Input>
        </View>

        {/* DOB */}
        <View>
          <Text
            className="mb-2 text-xs font-bold uppercase tracking-wider text-charcoal/60"
            style={{ fontFamily: 'Geist_600SemiBold' }}>
            Date of Birth
          </Text>
          <Input
            variant="rounded"
            size="lg"
            className="h-13 rounded-xl border border-[#E5E0D8] bg-white">
            <InputSlot className="pl-4">
              <Ionicons name="calendar-outline" size={18} color="#9CA3AF" />
            </InputSlot>
            <InputField
              placeholder="YYYY-MM-DD"
              value={dob}
              onChangeText={formatDob}
              keyboardType="number-pad"
              className="text-charcoal"
              placeholderTextColor="#C0BBC4"
              style={{ fontFamily: 'Geist_400Regular' }}
            />
          </Input>
        </View>

        {/* Gender */}
        <View>
          <Text
            className="mb-2 text-xs font-bold uppercase tracking-wider text-charcoal/60"
            style={{ fontFamily: 'Geist_600SemiBold' }}>
            Gender
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {GENDERS.map((g) => (
              <TouchableOpacity
                key={g}
                onPress={() => setGender(g)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: gender === g ? '#0E7C7B' : '#E5E0D8',
                  backgroundColor: gender === g ? '#F0FAF9' : 'white',
                }}>
                <Text
                  className={gender === g ? 'text-[#0E7C7B]' : 'text-charcoal/60'}
                  style={{
                    fontFamily: gender === g ? 'Geist_600SemiBold' : 'Geist_400Regular',
                    fontSize: 14,
                  }}>
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* City */}
        <View>
          <Text
            className="mb-2 text-xs font-bold uppercase tracking-wider text-charcoal/60"
            style={{ fontFamily: 'Geist_600SemiBold' }}>
            City
          </Text>
          <Input
            variant="rounded"
            size="lg"
            className="h-13 rounded-xl border border-[#E5E0D8] bg-white">
            <InputSlot className="pl-4">
              <Ionicons name="location-outline" size={18} color="#9CA3AF" />
            </InputSlot>
            <InputField
              placeholder="Lagos"
              value={city}
              onChangeText={setCity}
              className="text-charcoal"
              placeholderTextColor="#C0BBC4"
              style={{ fontFamily: 'Geist_400Regular' }}
            />
          </Input>
        </View>
      </View>
    </OnboardingStepLayout>
  );
}
