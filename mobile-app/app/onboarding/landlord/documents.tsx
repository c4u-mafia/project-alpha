import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingStepLayout } from '@/components/onboarding-step-layout';
import { Text } from '@/components/ui/text';
import { authClient } from '@/lib/auth-client';

const DOC_TYPES = [
  {
    id: 'certificate_of_occupancy',
    label: 'Certificate of Occupancy (C of O)',
    icon: 'document-text-outline' as const,
  },
  { id: 'deed_of_assignment', label: 'Deed of Assignment', icon: 'document-outline' as const },
  { id: 'survey_plan', label: 'Survey Plan', icon: 'map-outline' as const },
  { id: 'utility_bill', label: 'Recent Utility Bill', icon: 'receipt-outline' as const },
];

interface DocEntry {
  type: string;
  label: string;
  url: string;
}

export default function LandlordDocuments() {
  const [docs, setDocs] = useState<DocEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const addDoc = (type: string, label: string) => {
    if (docs.find((d) => d.type === type)) return;
    setDocs((prev) => [
      ...prev,
      { type, label, url: `https://placeholder.homelyn.ng/docs/${type}-${Date.now()}.pdf` },
    ]);
  };

  const removeDoc = (type: string) => {
    setDocs((prev) => prev.filter((d) => d.type !== type));
  };

  const handleNext = async () => {
    if (docs.length === 0) {
      router.push('/onboarding/landlord/bank');
      return;
    }
    setLoading(true);
    try {
      const token = await authClient.getSession();
      const jwt = (token?.data as any)?.session?.token;
      await Promise.all(
        docs.map((doc) =>
          fetch('http://localhost:3001/onboarding/landlord/documents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
            body: JSON.stringify({ type: doc.type, documentUrl: doc.url }),
          })
        )
      );
    } catch {}
    setLoading(false);
    router.push('/onboarding/landlord/bank');
  };

  return (
    <OnboardingStepLayout
      step={3}
      total={4}
      title="Property documents"
      subtitle="Upload at least one ownership document to list properties."
      onNext={handleNext}
      onSkip={() => router.push('/onboarding/landlord/bank')}
      loading={loading}
      canProceed={true}
      nextLabel={
        docs.length > 0
          ? `Submit ${docs.length} Document${docs.length > 1 ? 's' : ''}`
          : 'Skip for Now'
      }>
      <View className="mt-4 gap-3">
        <View className="flex-row gap-3 rounded-2xl border border-sunbloom/30 bg-sunbloom/10 p-4">
          <Ionicons name="time-outline" size={20} color="#F2A65A" />
          <Text
            className="flex-1 text-[13px] leading-5 text-charcoal/70"
            style={{ fontFamily: 'Geist_400Regular' }}>
            {
              "Our team reviews documents within 24 hours. You can still browse but won't be able to publish listings until approved."
            }
          </Text>
        </View>

        {DOC_TYPES.map((docType) => {
          const added = docs.find((d) => d.type === docType.id);
          return (
            <TouchableOpacity
              key={docType.id}
              onPress={() => (added ? removeDoc(docType.id) : addDoc(docType.id, docType.label))}
              style={{
                padding: 16,
                borderRadius: 14,
                borderWidth: 2,
                borderColor: added ? '#0E7C7B' : '#E5E0D8',
                borderStyle: added ? 'solid' : 'dashed',
                backgroundColor: added ? '#F0FAF9' : 'white',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: added ? '#D4EDE6' : '#F5F5F0',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Ionicons name={docType.icon} size={20} color={added ? '#0E7C7B' : '#9CA3AF'} />
              </View>
              <View className="flex-1">
                <Text
                  style={{
                    fontFamily: 'Geist_500Medium',
                    color: added ? '#0E7C7B' : '#1A2332',
                    fontSize: 14,
                  }}>
                  {docType.label}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Geist_400Regular',
                    color: '#9CA3AF',
                    fontSize: 12,
                    marginTop: 1,
                  }}>
                  {added ? 'Tap to remove' : 'Tap to add'}
                </Text>
              </View>
              {added ? (
                <Ionicons name="checkmark-circle" size={22} color="#0E7C7B" />
              ) : (
                <Ionicons name="add-circle-outline" size={22} color="#D0CCC6" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </OnboardingStepLayout>
  );
}
