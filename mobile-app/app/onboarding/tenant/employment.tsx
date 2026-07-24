import React, { useState } from 'react';
import { Alert, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { OnboardingStepLayout } from '@/components/onboarding-step-layout';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { apiFetch, getApiErrorMessage } from '@/lib/api';

const INCOME_RANGES = [
  'Below ₦100k/mo',
  '₦100k–₦300k/mo',
  '₦300k–₦600k/mo',
  '₦600k–₦1m/mo',
  'Above ₦1m/mo',
];

const INCOME_VALUES: Record<string, string> = {
  'Below ₦100k/mo': '50k_100k',
  '₦100k–₦300k/mo': '100k_200k',
  '₦300k–₦600k/mo': '200k_500k',
  '₦600k–₦1m/mo': 'above_500k',
  'Above ₦1m/mo': 'above_500k',
};

export default function TenantEmployment() {
  const [employerName, setEmployerName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [income, setIncome] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    setLoading(true);
    try {
      await apiFetch('/onboarding/tenant/employment', {
        method: 'POST',
        body: JSON.stringify({
          employerName: employerName || undefined,
          jobRole: jobTitle || undefined,
          monthlyIncomeRange: income ? INCOME_VALUES[income] : undefined,
        }),
      });
      router.push('/onboarding/tenant/preferences');
    } catch (error) {
      Alert.alert('Could not save employment details', getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingStepLayout
      step={3}
      total={4}
      title="Employment details"
      subtitle="Optional — helps landlords assess your application faster."
      onNext={handleNext}
      onSkip={() => router.push('/onboarding/tenant/preferences')}
      loading={loading}
      canProceed={true}
      nextLabel="Continue">
      <View className="mt-4 gap-4">
        <View>
          <Text
            className="mb-2 text-xs font-bold uppercase tracking-wider text-charcoal/60"
            style={{ fontFamily: 'Geist_600SemiBold' }}>
            Employer / Company Name
          </Text>
          <Input
            variant="rounded"
            size="lg"
            className="h-13 rounded-xl border border-[#E5E0D8] bg-white">
            <InputField
              placeholder="e.g. Dangote Group"
              value={employerName}
              onChangeText={setEmployerName}
              className="px-4 text-charcoal"
              placeholderTextColor="#C0BBC4"
              style={{ fontFamily: 'Geist_400Regular' }}
            />
          </Input>
        </View>

        <View>
          <Text
            className="mb-2 text-xs font-bold uppercase tracking-wider text-charcoal/60"
            style={{ fontFamily: 'Geist_600SemiBold' }}>
            Job Title / Role
          </Text>
          <Input
            variant="rounded"
            size="lg"
            className="h-13 rounded-xl border border-[#E5E0D8] bg-white">
            <InputField
              placeholder="e.g. Software Engineer"
              value={jobTitle}
              onChangeText={setJobTitle}
              className="px-4 text-charcoal"
              placeholderTextColor="#C0BBC4"
              style={{ fontFamily: 'Geist_400Regular' }}
            />
          </Input>
        </View>

        <View>
          <Text
            className="mb-2 text-xs font-bold uppercase tracking-wider text-charcoal/60"
            style={{ fontFamily: 'Geist_600SemiBold' }}>
            Monthly Income Range
          </Text>
          <View className="gap-2">
            {INCOME_RANGES.map((range) => (
              <TouchableOpacity
                key={range}
                onPress={() => setIncome(range)}
                style={{
                  padding: 14,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: income === range ? '#0E7C7B' : '#E5E0D8',
                  backgroundColor: income === range ? '#F0FAF9' : 'white',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontFamily: income === range ? 'Geist_600SemiBold' : 'Geist_400Regular',
                    color: income === range ? '#0E7C7B' : '#1A2332',
                    fontSize: 14,
                  }}>
                  {range}
                </Text>
                {income === range && <Text className="text-base text-[#0E7C7B]">✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </OnboardingStepLayout>
  );
}
