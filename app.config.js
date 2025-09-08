export default ({ config }) => ({
  ...config,
  name: 'Adaptive Desktop React Native',
  slug: 'adaptive-desktop-react-native',
  version: '0.1.0',
  main: 'node_modules/expo/AppEntry.js',
  orientation: 'portrait',
  icon: './assets/icon.png',
  newArchEnabled: true,
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#1e1e1e',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: 'com.adaptivedesktop.reactnative',
    supportsTablet: true,
  },
  android: {
    package: 'com.adaptivedesktop.reactnative',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#1e1e1e',
    },
  },
  web: {
    favicon: './assets/favicon.png',
  },
});
