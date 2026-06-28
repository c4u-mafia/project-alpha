import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentUser, useUpdateProfile, type UpdateProfilePayload } from '@/hooks/use-api';

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
] as const;

const PHONE_RE = /^\+?[0-9]{7,15}$/;
const DOB_RE = /^\d{4}-\d{2}-\d{2}$/;

export default function EditProfile() {
  const { data: user, isLoading } = useCurrentUser();
  const update = useUpdateProfile();

  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState<UpdateProfilePayload['gender']>(undefined);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (user && !hydrated) {
      setPhone(user.profile?.phone ?? '');
      setDob(user.profile?.dateOfBirth ?? '');
      setCity(user.profile?.city ?? '');
      setGender(user.profile?.gender ?? undefined);
      setHydrated(true);
    }
  }, [user, hydrated]);

  const validate = (): UpdateProfilePayload | null => {
    if (phone && !PHONE_RE.test(phone)) {
      Alert.alert('Invalid phone', 'Enter a valid phone like +2348012345678.');
      return null;
    }
    if (dob && !DOB_RE.test(dob)) {
      Alert.alert('Invalid date', 'Use YYYY-MM-DD, e.g. 1995-06-15.');
      return null;
    }
    const payload: UpdateProfilePayload = {};
    if (phone !== (user?.profile?.phone ?? '')) payload.phone = phone || undefined;
    if (dob !== (user?.profile?.dateOfBirth ?? '')) payload.dateOfBirth = dob || undefined;
    if (city !== (user?.profile?.city ?? '')) payload.city = city || undefined;
    if (gender !== (user?.profile?.gender ?? undefined)) payload.gender = gender;
    return payload;
  };

  const onSave = () => {
    const payload = validate();
    if (!payload) return;
    if (Object.keys(payload).length === 0) {
      router.back();
      return;
    }
    update.mutate(payload, {
      onSuccess: () => {
        Alert.alert('Saved', 'Your profile has been updated.');
        router.back();
      },
      onError: (e: Error) => {
        Alert.alert('Could not save', e.message);
      },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#FAF7F2' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />

      {/* Header */}
      <View
        style={{
          paddingTop: 56,
          paddingHorizontal: 20,
          paddingBottom: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
        }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: '#F0EBE4',
          }}>
          <Ionicons name="arrow-back" size={20} color="#1A2332" />
        </TouchableOpacity>
        <Text
          style={{ fontFamily: 'Geist_700Bold', color: '#1A2332', fontSize: 22, letterSpacing: -0.3 }}>
          Edit Profile
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 80, gap: 24 }}
        keyboardShouldPersistTaps="handled">
        {/* Account (read-only) */}
        <Animated.View entering={FadeInDown.delay(50).duration(400)}>
          <Text
            style={{
              fontFamily: 'Geist_600SemiBold',
              fontSize: 12,
              color: '#9CA3AF',
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 8,
            }}>
            Account
          </Text>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#F0EBE4',
              padding: 16,
              gap: 14,
            }}>
            {isLoading ? (
              <>
                <Skeleton style={{ height: 14, width: '70%', borderRadius: 6 }} />
                <Skeleton style={{ height: 14, width: '50%', borderRadius: 6 }} />
              </>
            ) : (
              <>
                <Row label="Name" value={user?.name ?? '—'} />
                <Row label="Email" value={user?.email ?? '—'} />
                <Row label="Role" value={user?.role ?? '—'} />
              </>
            )}
          </View>
          <Text
            style={{
              fontFamily: 'Geist_400Regular',
              color: '#9CA3AF',
              fontSize: 11,
              marginTop: 6,
            }}>
            Contact support to change your name or email.
          </Text>
        </Animated.View>

        {/* Personal details (editable) */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Text
            style={{
              fontFamily: 'Geist_600SemiBold',
              fontSize: 12,
              color: '#9CA3AF',
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 8,
            }}>
            Personal details
          </Text>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#F0EBE4',
              padding: 16,
              gap: 14,
            }}>
            <Field
              label="Phone number"
              value={phone}
              onChange={setPhone}
              placeholder="+2348012345678"
              keyboardType="phone-pad"
            />
            <Field
              label="Date of birth"
              value={dob}
              onChange={setDob}
              placeholder="YYYY-MM-DD"
              keyboardType="numbers-and-punctuation"
            />
            <Field label="City" value={city} onChange={setCity} placeholder="Lagos" />

            <View>
              <Text
                style={{
                  fontFamily: 'Geist_500Medium',
                  fontSize: 13,
                  color: '#6B7280',
                  marginBottom: 8,
                }}>
                Gender
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {GENDER_OPTIONS.map((g) => {
                  const active = gender === g.value;
                  return (
                    <TouchableOpacity
                      key={g.value}
                      onPress={() => setGender(g.value)}
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        borderRadius: 999,
                        backgroundColor: active ? '#0E7C7B' : '#FAF7F2',
                        borderWidth: 1.5,
                        borderColor: active ? '#0E7C7B' : '#E5E0D8',
                      }}>
                      <Text
                        style={{
                          fontFamily: active ? 'Geist_600SemiBold' : 'Geist_400Regular',
                          color: active ? 'white' : '#6B7280',
                          fontSize: 13,
                        }}>
                        {g.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(160).duration(400)}>
          <Button
            size="lg"
            onPress={onSave}
            isDisabled={update.isPending || isLoading}
            style={{ height: 52, borderRadius: 14, backgroundColor: '#0E7C7B' }}>
            <ButtonText
              style={{ fontFamily: 'Geist_700Bold', color: 'white', fontSize: 15 }}>
              {update.isPending ? 'Saving…' : 'Save changes'}
            </ButtonText>
          </Button>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={{ fontFamily: 'Geist_400Regular', color: '#9CA3AF', fontSize: 13 }}>
        {label}
      </Text>
      <Text
        style={{
          fontFamily: 'Geist_600SemiBold',
          color: '#1A2332',
          fontSize: 13,
          textTransform: label === 'Role' ? 'capitalize' : 'none',
          maxWidth: '60%',
          textAlign: 'right',
        }}
        numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  keyboardType,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'phone-pad' | 'numbers-and-punctuation';
}) {
  return (
    <View>
      <Text
        style={{
          fontFamily: 'Geist_500Medium',
          fontSize: 13,
          color: '#6B7280',
          marginBottom: 6,
        }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#C0BBC4"
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize="none"
        style={{
          height: 46,
          borderRadius: 10,
          borderWidth: 1.5,
          borderColor: '#E5E0D8',
          backgroundColor: '#FAF7F2',
          paddingHorizontal: 12,
          fontFamily: 'Geist_400Regular',
          fontSize: 14,
          color: '#1A2332',
        }}
      />
    </View>
  );
}
