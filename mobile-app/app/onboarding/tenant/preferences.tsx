import React, { useState } from 'react';
import { Alert, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { OnboardingStepLayout } from '@/components/onboarding-step-layout';
import { Text } from '@/components/ui/text';
import { apiFetch, getApiErrorMessage } from '@/lib/api';

const AREAS = [
  'Lekki',
  'Victoria Island',
  'Ikeja',
  'Surulere',
  'Yaba',
  'Ajah',
  'Ikorodu',
  'Maryland',
];
const BEDROOMS = ['Studio', '1 Bed', '2 Beds', '3 Beds', '4+ Beds'];
const TIMELINES = ['ASAP', '1–3 months', '3–6 months', '6+ months'];
const TIMELINE_VALUES: Record<string, string> = {
  ASAP: 'immediately',
  '1–3 months': 'within_3_months',
  '3–6 months': 'within_6_months',
  '6+ months': 'flexible',
};

export default function TenantPreferences() {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string[]>([]);
  const [timeline, setTimeline] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const toggleBed = (b: string) => {
    setSelectedBedrooms((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      await apiFetch('/onboarding/tenant/preferences', {
        method: 'POST',
        body: JSON.stringify({
          preferredAreas: selectedAreas.length ? selectedAreas : undefined,
          preferredBedrooms: selectedBedrooms.length
            ? selectedBedrooms.map((b) => (b === 'Studio' ? 0 : parseInt(b)))
            : undefined,
          moveInTimeline: timeline ? TIMELINE_VALUES[timeline] : undefined,
        }),
      });
      router.push('/onboarding/complete');
    } catch (error) {
      Alert.alert('Could not save your preferences', getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingStepLayout
      step={4}
      total={4}
      title="Your preferences"
      subtitle="Optional — used to personalise your home feed."
      onNext={handleNext}
      onSkip={() => router.push('/onboarding/complete')}
      loading={loading}
      canProceed={true}
      nextLabel="Finish Setup">
      <View className="mt-4 gap-5">
        {/* Areas */}
        <View>
          <Text
            className="mb-2 text-xs font-bold uppercase tracking-wider text-charcoal/60"
            style={{ fontFamily: 'Geist_600SemiBold' }}>
            Preferred Areas
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {AREAS.map((area) => {
              const sel = selectedAreas.includes(area);
              return (
                <TouchableOpacity
                  key={area}
                  onPress={() => toggleArea(area)}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 14,
                    borderRadius: 999,
                    borderWidth: 1.5,
                    borderColor: sel ? '#0E7C7B' : '#E5E0D8',
                    backgroundColor: sel ? '#D4EDE6' : 'white',
                  }}>
                  <Text
                    style={{
                      fontFamily: sel ? 'Geist_600SemiBold' : 'Geist_400Regular',
                      color: sel ? '#0E7C7B' : '#6B7280',
                      fontSize: 13,
                    }}>
                    {area}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Bedrooms */}
        <View>
          <Text
            className="mb-2 text-xs font-bold uppercase tracking-wider text-charcoal/60"
            style={{ fontFamily: 'Geist_600SemiBold' }}>
            Bedroom Count
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {BEDROOMS.map((b) => {
              const sel = selectedBedrooms.includes(b);
              return (
                <TouchableOpacity
                  key={b}
                  onPress={() => toggleBed(b)}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: sel ? '#0E7C7B' : '#E5E0D8',
                    backgroundColor: sel ? '#F0FAF9' : 'white',
                  }}>
                  <Text
                    style={{
                      fontFamily: sel ? 'Geist_600SemiBold' : 'Geist_400Regular',
                      color: sel ? '#0E7C7B' : '#1A2332',
                      fontSize: 14,
                    }}>
                    {b}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Timeline */}
        <View>
          <Text
            className="mb-2 text-xs font-bold uppercase tracking-wider text-charcoal/60"
            style={{ fontFamily: 'Geist_600SemiBold' }}>
            Move-in Timeline
          </Text>
          <View className="gap-2">
            {TIMELINES.map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setTimeline(t)}
                style={{
                  padding: 14,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: timeline === t ? '#0E7C7B' : '#E5E0D8',
                  backgroundColor: timeline === t ? '#F0FAF9' : 'white',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontFamily: timeline === t ? 'Geist_600SemiBold' : 'Geist_400Regular',
                    color: timeline === t ? '#0E7C7B' : '#1A2332',
                    fontSize: 14,
                  }}>
                  {t}
                </Text>
                {timeline === t && <Text className="text-[#0E7C7B]">✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </OnboardingStepLayout>
  );
}
