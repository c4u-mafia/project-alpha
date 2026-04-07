import { useRouter } from 'expo-router';
import { Onboarding } from '../components/onboarding';

export default function OnboardingPage() {
  const router = useRouter();

  const handleFinish = () => {
    router.replace('/login');
  };

  return <Onboarding onFinish={handleFinish} />;
}
