# @adaptive-desktop/react-native

[![codecov](https://codecov.io/gh/adaptive-desktop/react-native/graph/badge.svg?token=BVr2jhrcb4)](https://codecov.io/gh/adaptive-desktop/react-native)

[![npm version](https://badge.fury.io/js/%40adaptive-desktop%2Freact-native.svg)](https://badge.fury.io/js/%40adaptive-desktop%2Freact-native)

Current version: **v0.3.2**

React Native components for building adaptive desktop layouts with flexible workspace management. Built on the framework-agnostic `@adaptive-desktop/adaptive-workspace` core library.

## Features

- **🏗️ Viewport-Based Layout** - Simple workspace management with direct viewport control
- **📱 React Native Optimized** - Native performance with proper safe area handling
- **🎯 Framework Integration** - Clean React Native wrapper for the adaptive-workspace core
- **⚡ Responsive Updates** - Automatic re-rendering when workspace bounds change
- **🧪 Fully Tested** - 100% test coverage with comprehensive test suite
- **📦 TypeScript First** - Complete type safety and IntelliSense support
- **🔧 Framework Agnostic Core** - Built on `@adaptive-desktop/adaptive-workspace` v0.6.0

## Installation

````sh
npm install @adaptive-desktop/react-native @adaptive-desktop/adaptive-workspace
# or
yarn add @adaptive-desktop/react-native @adaptive-desktop/adaptive-workspace
# or
pnpm add @adaptive-desktop/react-native @adaptive-desktop/adaptive-workspace



```sh
npm install @adaptive-desktop/react-native@0.3.2 @adaptive-desktop/adaptive-workspace
# or
yarn add @adaptive-desktop/react-native@0.3.2 @adaptive-desktop/adaptive-workspace
# or
pnpm add @adaptive-desktop/react-native@0.3.2 @adaptive-desktop/adaptive-workspace
```

````

### Setup

**Wrap your app with SafeAreaProvider:**

```tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return <SafeAreaProvider>{/* Your app content */}</SafeAreaProvider>;
}
```

## Expo Integration

This library is fully compatible with Expo and can be easily integrated into any Expo project.

### Installation in Expo Projects

```sh
# Using Expo CLI (recommended for Expo projects)
npx expo install @adaptive-desktop/react-native @adaptive-desktop/adaptive-workspace react-native-safe-area-context

# Or using yarn
yarn add @adaptive-desktop/react-native @adaptive-desktop/adaptive-workspace
yarn expo install react-native-safe-area-context
```

### Complete Expo App Example

Here's a complete example of integrating the adaptive desktop library into an Expo app:

**App.tsx:**

```tsx
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  WorkspaceFactory,
  loadDesktopSnapshot,
} from '@adaptive-desktop/adaptive-workspace';
import {
  WorkspaceView,
  useWorkspaceDimensions,
} from '@adaptive-desktop/react-native';
import { idGenerator } from '@adaptive-desktop/react-native/utils';

function AdaptiveDesktopApp() {
  const [workspace] = useState(() => {
    const snapshot = loadDesktopSnapshot();
    const context = snapshot.workspaceContexts[0];
    const factory = new WorkspaceFactory(idGenerator);
    return factory.fromSnapshot(snapshot, context.maxScreenBounds);
  });

  // Automatically handle dimension changes and update workspace
  useWorkspaceDimensions({
    workspace,
    autoUpdateWorkspace: true,
  });

  return (
    <View style={styles.container}>
      <WorkspaceView workspace={workspace} />
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AdaptiveDesktopApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
});
```

### Expo Configuration

No additional configuration is required in `app.json` or `expo.json`. The library works out of the box with:

- **Expo Go** - For development and testing
- **Expo Development Builds** - For custom native code (if needed)
- **EAS Build** - For production builds

### Platform Support

The library supports all Expo platforms:

- **📱 iOS** - Full support with safe area handling
- **🤖 Android** - Full support with safe area handling
- **🌐 Web** - Full support for web deployment
- **🖥️ Desktop** - Works with Expo's experimental desktop support

### Development Workflow

1. **Start Expo development server:**

   ```sh
   npx expo start
   ```

2. **Test on different platforms:**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Press `w` for web browser
   - Scan QR code for physical device

3. **Build for production:**

   ```sh
   # Using EAS Build
   npx eas build --platform all

   # Or classic Expo build
   npx expo build:ios
   npx expo build:android
   ```

### Responsive Design

The library automatically adapts to different screen sizes and orientations:

```tsx
import { useWorkspaceDimensions } from '@adaptive-desktop/react-native';

function ResponsiveWorkspace() {
  const [workspace] = useState(() => {
    const snapshot = loadDesktopSnapshot();
    // Choose context based on screen size
    const context =
      Dimensions.get('window').width > 768
        ? snapshot.workspaceContexts.find(ctx => ctx.id === 'desktop')
        : snapshot.workspaceContexts.find(ctx => ctx.id === 'tablet');

    const factory = new WorkspaceFactory(idGenerator);
    return factory.fromSnapshot(
      snapshot,
      context?.maxScreenBounds || snapshot.workspaceContexts[0].maxScreenBounds
    );
  });

  useWorkspaceDimensions({
    workspace,
    autoUpdateWorkspace: true,
  });

  return <WorkspaceView workspace={workspace} />;
}
```

## Quick Start

```tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  WorkspaceFactory,
  loadDesktopSnapshot,
} from '@adaptive-desktop/adaptive-workspace';
import { WorkspaceView } from '@adaptive-desktop/react-native';
import { idGenerator } from '@adaptive-desktop/react-native/utils';

const MyApp = () => {
  const [workspace] = useState(() => {
    const snapshot = loadDesktopSnapshot();
    const context = snapshot.workspaceContexts[0];
    const factory = new WorkspaceFactory(idGenerator);
    return factory.fromSnapshot(snapshot, context.maxScreenBounds);
  });

  return (
    <View style={styles.container}>
      <WorkspaceView workspace={workspace} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
});
```

## API Reference

### WorkspaceView

The main component that renders workspace viewports:

```tsx
interface WorkspaceViewProps {
  workspace: WorkspaceInterface;
  style?: ViewStyle;
  testID?: string;
}

<WorkspaceView
  workspace={workspace}
  style={{ backgroundColor: '#808080' }}
  testID="workspace-view"
/>;
```

**Props:**

- `workspace` - The workspace instance from `@adaptive-desktop/adaptive-workspace`
- `style` - Optional React Native ViewStyle for custom styling
- `testID` - Optional test identifier for testing

### Workspace Creation with Snapshots

Workspaces are created using snapshots that define the layout configuration. The library provides a default desktop snapshot:

```tsx
import {
  WorkspaceFactory,
  loadDesktopSnapshot,
} from '@adaptive-desktop/adaptive-workspace';
import { idGenerator } from '@adaptive-desktop/react-native/utils';

const snapshot = loadDesktopSnapshot();
const context = snapshot.workspaceContexts[0]; // Use first available context
const factory = new WorkspaceFactory(idGenerator);
const workspace = factory.fromSnapshot(snapshot, context.maxScreenBounds);
```

**Available workspace contexts:**

- `desktop` - Full desktop layout
- `laptop` - Laptop-optimized layout
- `tablet` - Tablet-friendly layout

### useDimensions Hook

Hook for tracking device dimension changes:

```tsx
import { useDimensions } from '@adaptive-desktop/react-native';

const MyComponent = () => {
  const dimensions = useDimensions();

  return (
    <Text>
      Screen: {dimensions.width}x{dimensions.height}
    </Text>
  );
};
```

## Dynamic Workspace Updates

The WorkspaceView automatically re-renders when workspace bounds change. Use the `useWorkspaceDimensions` hook for automatic updates:

```tsx
import { useWorkspaceDimensions } from '@adaptive-desktop/react-native';

const MyComponent = () => {
  const [workspace] = useState(() => {
    const snapshot = loadDesktopSnapshot();
    const context = snapshot.workspaceContexts[0];
    const factory = new WorkspaceFactory(idGenerator);
    return factory.fromSnapshot(snapshot, context.maxScreenBounds);
  });

  // Automatically update workspace when device dimensions change
  useWorkspaceDimensions({
    workspace,
    autoUpdateWorkspace: true,
  });

  // Manual updates are also supported
  const updateWorkspacePosition = () => {
    workspace.setScreenBounds({
      x: 100,
      y: 100,
      width: 600,
      height: 400,
    });
  };

  return <WorkspaceView workspace={workspace} />;
};
```

## Demo Application

The project includes a demo showing workspace functionality with snapshot-based initialization:

```tsx
import { AdaptiveDesktopDemo } from '@adaptive-desktop/react-native';

export default function App() {
  return <AdaptiveDesktopDemo />;
}
```

The demo demonstrates:

- Workspace creation using `loadDesktopSnapshot()` and `WorkspaceFactory.fromSnapshot()`
- Automatic viewport management from snapshot configuration
- Automatic re-rendering on workspace changes
- Safe area handling for mobile devices
- Integration with `@adaptive-desktop/adaptive-workspace` v0.6.0

## Architecture

This library provides React Native components that integrate with `@adaptive-desktop/adaptive-workspace` v0.6.0:

### Core Integration Pattern

1. **Workspace Creation**: Use `WorkspaceFactory.fromSnapshot()` with `loadDesktopSnapshot()` to create workspace instances
2. **Component Integration**: Pass workspace to `WorkspaceView` component
3. **Automatic Updates**: Component watches `workspace.screenBounds` for re-rendering
4. **Safe Area Handling**: Built-in support for device safe areas
5. **Dimension Management**: Use `useWorkspaceDimensions` hook for responsive updates

### Key Features

- **Framework Agnostic Core**: Built on the universal `@adaptive-desktop/adaptive-workspace` library
- **React Native Optimized**: Proper integration with React Native's rendering and safe areas
- **Type Safe**: 100% TypeScript with comprehensive type definitions
- **Test Coverage**: 100% test coverage with co-located test structure

## Development

### Running the Demo

The project supports two modes: **Demo mode** (default) and **Storybook mode**.

**Demo Mode (Basic workspace functionality):**

```sh
yarn start              # Start demo on all platforms
yarn demo               # Same as yarn start
yarn demo:android       # Start demo on Android
yarn demo:ios           # Start demo on iOS
yarn demo:web           # Start demo on web
```

**Storybook Mode (Component development and testing):**

```sh
yarn storybook          # Start Storybook on all platforms
yarn storybook:android  # Start Storybook on Android
yarn storybook:ios      # Start Storybook on iOS
yarn storybook:web      # Start Storybook on web
```

### Building

```sh
yarn library:build    # Build the library
yarn library:verify   # Verify the build
```

### Testing

The project has **100% test coverage** with co-located test structure:

```sh
yarn test                 # Run tests
yarn test:coverage        # Run with coverage report
```

**Test Structure:**

```
src/
├── components/
│   └── WorkspaceView/
│       ├── WorkspaceView.tsx
│       ├── WorkspaceView.test.tsx  ✅
│       └── WorkspaceView.stories.tsx
└── hooks/
    └── useDimensions/
        ├── useDimensions.ts
        └── useDimensions.test.ts   ✅
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Add tests for your changes
4. Ensure all tests pass
5. Submit a pull request

## License

Apache-2.0
