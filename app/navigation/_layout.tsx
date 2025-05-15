import { useAuth } from '../utils/auth-context';
import { Redirect, Slot, usePathname } from 'expo-router';

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  const publicPaths = ["/navigation/loginScreen", "/navigation/registerScreen"];

  if (isLoading) return null;

  if (!isAuthenticated && !publicPaths.includes(pathname)) {
    return <Redirect href="/navigation/loginScreen" />;
  }

  return <Slot />;
}
