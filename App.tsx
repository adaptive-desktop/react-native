import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AdaptiveDesktopDemo } from './src/demo/AdaptiveDesktopDemo';

function App() {
  return (
    <SafeAreaProvider>
      <AdaptiveDesktopDemo />
    </SafeAreaProvider>
  );
}

let AppEntryPoint = App;

// Use environment variable to switch between demo and storybook
// To enable Storybook, set STORYBOOK_ENABLED=true in your environment
// You can do this by:
// 1. Setting it in your shell: export STORYBOOK_ENABLED=true && npm start
// 2. Or modify this condition to suit your needs
const isStorybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

if (isStorybookEnabled) {
  // @ts-ignore - Dynamic require for storybook
  AppEntryPoint = require('./.rnstorybook').default;
}

export default AppEntryPoint;
