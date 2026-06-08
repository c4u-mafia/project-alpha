import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { authClient } from '@/lib/auth-client';
import { useGlobalStore } from '@/store/global-store';
import { SplashScreen } from '../components/splash-screen';

export default function IndexPage() {
  const router = useRouter();
  const { setRole } = useGlobalStore();

  const handleNext = async () => {
    try {
      const session = await authClient.getSession();
      if (session?.data?.user) {
        const userRole = (session.data.user as any)?.role ?? 'tenant';
        setRole(userRole);
        router.replace(userRole === 'landlord' ? '/(landlord)' : '/(tenant)');
      } else {
        router.replace('/onboarding');
      }
    } catch {
      router.replace('/onboarding');
    }
  };

  return <SplashScreen onNext={handleNext} />;
}
