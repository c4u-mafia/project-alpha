import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Onboarding } from "@/components/onboarding";

export default function OnboardingPage() {
  const router = useRouter();

  const handleFinish = useCallback(() => {
    router.replace('/role-select');
  }, [router]);

  return <Onboarding onFinish={handleFinish} />;
}
