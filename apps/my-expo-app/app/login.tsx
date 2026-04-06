import { useRouter } from 'expo-router';
import { LoginScreen } from '../components/login-screen';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.replace('/(main)/home');
  };

  return <LoginScreen onLogin={handleLogin} />;
}
