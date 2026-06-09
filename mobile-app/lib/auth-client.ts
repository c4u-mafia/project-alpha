import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import { emailOTPClient } from 'better-auth/client/plugins';
import * as SecureStore from 'expo-secure-store';

export const authClient = createAuthClient({
  baseURL: 'http://localhost:3001',
  plugins: [
    expoClient({
      scheme: 'homelyn',
      storagePrefix: 'homelyn',
      storage: SecureStore,
    }),
    emailOTPClient(),
  ],
});
