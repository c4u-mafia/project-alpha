const variant = process.env.APP_VARIANT ?? 'production';

const IS_DEV = variant === 'development';
const IS_PREVIEW = variant === 'preview';

const appName = IS_DEV ? 'Homelyn Dev' : IS_PREVIEW ? 'Homelyn Preview' : 'Homelyn';
const appPackage = IS_DEV
  ? 'com.homelyn.dev'
  : IS_PREVIEW
    ? 'com.homelyn.preview'
    : 'com.homelyn.app';

const RAILWAY_URL = 'https://homelyn-backend-production.up.railway.app';

const apiUrl = IS_DEV
  ? 'http://10.0.2.2:3000' // Android emulator → host machine
  : IS_PREVIEW
    ? (process.env.PREVIEW_API_URL ?? RAILWAY_URL)
    : (process.env.PRODUCTION_API_URL ?? RAILWAY_URL);

/** @type {import('@expo/config').ExpoConfig} */
module.exports = {
  name: appName,
  slug: 'Homelyn',
  owner: 'whizzie',
  version: '1.0.0',
  scheme: IS_DEV ? 'homelyn-dev' : IS_PREVIEW ? 'homelyn-preview' : 'homelyn',
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
    reactCompiler: true,
  },
  plugins: [
    'expo-font',
    'expo-router',
    'expo-secure-store',
    'expo-system-ui',
    [
      'expo-splash-screen',
      {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#0E7C7B',
      },
    ],
    'expo-status-bar',
    'expo-web-browser',
  ],
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: appPackage,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: appPackage,
    usesCleartextTraffic: IS_DEV,
    // arm64-v8a only — cuts APK size ~60% vs universal. Covers all modern Android (2017+).
    supportedCpuArchitectures: IS_DEV ? undefined : ['arm64-v8a'],
  },
  extra: {
    apiUrl,
    variant,
    eas: {
      projectId: '9fd9a160-3301-4f79-aa27-2c249661326f',
    },
  },
};
