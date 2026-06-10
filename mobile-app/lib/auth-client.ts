import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import { emailOTPClient } from 'better-auth/client/plugins';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig?.extra?.apiUrl ?? 'http://10.0.2.2:3000';
const scheme = (Constants.expoConfig?.scheme as string) ?? 'homelyn';

export const authClient = createAuthClient({
  baseURL: apiUrl,
  plugins: [
    expoClient({
      scheme,
      storagePrefix: 'homelyn',
      storage: SecureStore,
    }),
    emailOTPClient(),
  ],
});
