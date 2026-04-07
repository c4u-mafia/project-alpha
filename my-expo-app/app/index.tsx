import { useRouter } from 'expo-router';
import { SplashScreen } from '../components/splash-screen';

export default function IndexPage() {
  const router = useRouter();

  const handleNext = () => {
    router.replace('/onboarding');
  };

  return <SplashScreen onNext={handleNext} />;
}
