import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { OnboardingStepLayout } from '@/components/onboarding-step-layout';
import { Text } from '@/components/ui/text';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Ionicons } from '@expo/vector-icons';
import { authClient } from '@/lib/auth-client';

const TYPES = [
  {
    id: 'individual',
    label: 'Individual',
    icon: 'person-outline' as const,
    desc: "I'm listing personal property",
  },
  {
    id: 'company',
    label: 'Company / Agency',
    icon: 'business-outline' as const,
    desc: 'I represent a real estate firm',
  },
];

export default function LandlordProfile() {
  const [type, setType] = useState<'individual' | 'company'>('individual');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  const canProceed = phone.length >= 11 && city.length > 1;

  const handleNext = async () => {
    setLoading(true);
    try {
      const token = await authClient.getSession();
      const jwt = (token?.data as any)?.session?.token;
      await fetch('http://localhost:3001/onboarding/landlord/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
        body: JSON.stringify({
          type,
          phone: `+234${phone.replace(/^0/, '')}`,
          companyName: type === 'company' ? companyName : undefined,
          city,
        }),
      });
    } catch {}
    setLoading(false);
    router.push('/onboarding/landlord/nin');
  };

  return (
    <OnboardingStepLayout
      step={1}
      total={4}
      title="Landlord profile"
      subtitle="Let tenants know who they'll be renting from."
      onNext={handleNext}
      loading={loading}
      canProceed={canProceed}>
      <View className="mt-4 gap-5">
        {/* Type */}
        <View>
          <Text
            className="mb-2 text-xs font-bold uppercase tracking-wider text-charcoal/60"
            style={{ fontFamily: 'Geist_600SemiBold' }}>
            Listing as
          </Text>
          <View className="gap-2">
            {TYPES.map((t) => {
              const sel = type === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => setType(t.id as 'individual' | 'company')}
                  style={{
                    padding: 16,
                    borderRadius: 14,
                    borderWidth: 2,
                    borderColor: sel ? '#0E7C7B' : '#E5E0D8',
                    backgroundColor: sel ? '#F0FAF9' : 'white',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                  }}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      backgroundColor: sel ? '#D4EDE6' : '#F5F5F0',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Ionicons name={t.icon} size={20} color={sel ? '#0E7C7B' : '#9CA3AF'} />
                  </View>
                  <View className="flex-1">
                    <Text
                      style={{
                        fontFamily: 'Geist_600SemiBold',
                        color: sel ? '#0E7C7B' : '#1A2332',
                        fontSize: 15,
                      }}>
                      {t.label}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Geist_400Regular',
                        color: '#9CA3AF',
                        fontSize: 12,
                        marginTop: 1,
                      }}>
                      {t.desc}
                    </Text>
                  </View>
                  {sel && <Text className="text-lg text-[#0E7C7B]">✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {type === 'company' && (
          <View>
            <Text
              className="mb-2 text-xs font-bold uppercase tracking-wider text-charcoal/60"
              style={{ fontFamily: 'Geist_600SemiBold' }}>
              Company / Agency Name
            </Text>
            <Input
              variant="rounded"
              size="lg"
              className="h-13 rounded-xl border border-[#E5E0D8] bg-white">
              <InputField
                placeholder="e.g. Remax Properties Ltd"
                value={companyName}
                onChangeText={setCompanyName}
                className="px-4 text-charcoal"
                placeholderTextColor="#C0BBC4"
                style={{ fontFamily: 'Geist_400Regular' }}
              />
            </Input>
          </View>
        )}

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
