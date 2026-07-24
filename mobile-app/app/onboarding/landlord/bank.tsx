import React, { useState } from 'react';
import { Alert, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingStepLayout } from '@/components/onboarding-step-layout';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { apiFetch, getApiErrorMessage } from '@/lib/api';

const BANKS = [
  'Access Bank',
  'GTBank',
  'First Bank',
  'Zenith Bank',
  'UBA',
  'Fidelity Bank',
  'Stanbic IBTC',
  'FCMB',
  'Sterling Bank',
  'Wema Bank',
];

const BANK_CODES: Record<string, string> = {
  'Access Bank': '044',
  GTBank: '058',
  'First Bank': '011',
  'Zenith Bank': '057',
  UBA: '033',
  'Fidelity Bank': '070',
  'Stanbic IBTC': '221',
  FCMB: '214',
  'Sterling Bank': '232',
  'Wema Bank': '035',
};

export default function LandlordBank() {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const canProceed = !!bankName && accountNumber.length === 10 && accountName.length > 2;

  const handleNext = async () => {
    setLoading(true);
    try {
      await apiFetch('/onboarding/landlord/bank', {
        method: 'POST',
        body: JSON.stringify({
          bankName,
          accountNumber,
          accountName,
          bankCode: BANK_CODES[bankName],
        }),
      });
      router.push('/onboarding/complete');
    } catch (error) {
      Alert.alert('Could not save bank account', getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingStepLayout
      step={4}
      total={4}
      title="Bank account"
      subtitle="Where rent payments will be deposited after 24-hour hold."
      onNext={handleNext}
      onSkip={() => router.push('/onboarding/complete')}
      loading={loading}
      canProceed={canProceed}
      nextLabel="Finish Setup">
      <View className="mt-4 gap-4">
        <View className="flex-row gap-3 rounded-2xl bg-mint p-4">
          <Ionicons name="lock-closed-outline" size={18} color="#0E7C7B" />
          <Text
            className="flex-1 text-[13px] leading-5 text-[#0E7C7B]"
            style={{ fontFamily: 'Geist_400Regular' }}>
            Rent is held for 24 hours before release to protect both parties.
          </Text>
        </View>

        {/* Bank picker */}
        <View>
          <Text
            className="mb-2 text-xs font-bold uppercase tracking-wider text-charcoal/60"
            style={{ fontFamily: 'Geist_600SemiBold' }}>
            Bank
          </Text>
          <TouchableOpacity
            onPress={() => setShowPicker(!showPicker)}
            style={{
              height: 52,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: bankName ? '#0E7C7B' : '#E5E0D8',
              backgroundColor: 'white',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
            }}>
            <Text
              style={{
                fontFamily: 'Geist_400Regular',
                color: bankName ? '#1A2332' : '#C0BBC4',
                fontSize: 14,
                flex: 1,
              }}>
              {bankName || 'Select your bank'}
            </Text>
            <Ionicons name={showPicker ? 'chevron-up' : 'chevron-down'} size={18} color="#9CA3AF" />
          </TouchableOpacity>

          {showPicker && (
            <View
              style={{
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#E5E0D8',
                backgroundColor: 'white',
                marginTop: 4,
                overflow: 'hidden',
              }}>
              {BANKS.map((bank, i) => (
                <TouchableOpacity
                  key={bank}
                  onPress={() => {
                    setBankName(bank);
                    setShowPicker(false);
                  }}
                  style={{
                    padding: 14,
                    borderTopWidth: i > 0 ? 1 : 0,
                    borderTopColor: '#F0EBE4',
                    backgroundColor: bankName === bank ? '#F0FAF9' : 'white',
                  }}>
                  <Text
                    style={{
                      fontFamily: bankName === bank ? 'Geist_600SemiBold' : 'Geist_400Regular',
                      color: bankName === bank ? '#0E7C7B' : '#1A2332',
                      fontSize: 14,
                    }}>
                    {bank}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View>
          <Text
            className="mb-2 text-xs font-bold uppercase tracking-wider text-charcoal/60"
            style={{ fontFamily: 'Geist_600SemiBold' }}>
            Account Number
          </Text>
          <Input
            variant="rounded"
            size="lg"
            className="h-13 rounded-xl border border-[#E5E0D8] bg-white">
            <InputField
              placeholder="0123456789"
              value={accountNumber}
              onChangeText={(v) => setAccountNumber(v.replace(/[^0-9]/g, '').slice(0, 10))}
              keyboardType="number-pad"
              maxLength={10}
              className="px-4 tracking-widest text-charcoal"
              placeholderTextColor="#C0BBC4"
              style={{ fontFamily: 'Geist_400Regular' }}
            />
          </Input>
        </View>

        <View>
          <Text
            className="mb-2 text-xs font-bold uppercase tracking-wider text-charcoal/60"
            style={{ fontFamily: 'Geist_600SemiBold' }}>
            Account Name
          </Text>
          <Input
            variant="rounded"
            size="lg"
            className="h-13 rounded-xl border border-[#E5E0D8] bg-white">
            <InputField
              placeholder="As shown on your bank statement"
              value={accountName}
              onChangeText={setAccountName}
              className="px-4 text-charcoal"
              placeholderTextColor="#C0BBC4"
              style={{ fontFamily: 'Geist_400Regular' }}
            />
          </Input>
        </View>
      </View>
    </OnboardingStepLayout>
  );
}
