# @adaptive-desktop/react-native

[![codecov](https://codecov.io/gh/adaptive-desktop/react-native/graph/badge.svg?token=BVr2jhrcb4)](https://codecov.io/gh/adaptive-desktop/react-native)

[![npm version](https://badge.fury.io/js/%40adaptive-desktop%2Freact-native.svg)](https://badge.fury.io/js/%40adaptive-desktop%2Freact-native)

Current version: **v0.1.1**

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
npm install @adaptive-desktop/react-native@0.1.1 @adaptive-desktop/adaptive-workspace
# or
yarn add react-native-safe-area-context
# or
pnpm add @adaptive-desktop/react-native@0.1.1 @adaptive-desktop/adaptive-workspace
````

````

### Setup

**Wrap your app with SafeAreaProvider:**

```tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return <SafeAreaProvider>{/* Your app content */}</SafeAreaProvider>;
}
````

## Quick Start

```tsx
import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WorkspaceFactory } from '@adaptive-desktop/adaptive-workspace';
import {
  WorkspaceView,
  createWorkspaceConfig,
} from '@adaptive-desktop/react-native';

const MyApp = () => {
  const dimensions = Dimensions.get('window');

  const [workspace] = useState(() => {
    const ws = WorkspaceFactory.create(
      createWorkspaceConfig({
        x: 0,
        y: 0,
        width: dimensions.width,
        height: dimensions.height,
      })
    );

    // Create initial viewport
    ws.createViewport();

    return ws;
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

### ID Generator Configuration

Starting with `@adaptive-desktop/adaptive-workspace` v0.5.0, an ID generator is required for creating workspaces. This library provides a convenient helper that uses `react-native-uuid`:

```tsx
import { createWorkspaceConfig } from '@adaptive-desktop/react-native';

// Use createWorkspaceConfig instead of passing bounds directly
const workspace = WorkspaceFactory.create(
  createWorkspaceConfig({
    x: 0,
    y: 0,
    width: 800,
    height: 600,
  })
);
```

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

The WorkspaceView automatically re-renders when workspace bounds change:

```tsx
const updateWorkspacePosition = () => {
  // This will automatically trigger a re-render of WorkspaceView
  workspace.updateScreenBounds({
    x: 100,
    y: 100,
    width: 600,
    height: 400,
  });
};
```

## Demo Application

The project includes a demo showing basic workspace functionality:

```tsx
import { AdaptiveDesktopDemo } from '@adaptive-desktop/react-native';

export default function App() {
  return <AdaptiveDesktopDemo />;
}
```

The demo demonstrates:

- Basic workspace creation and viewport management
- Automatic re-rendering on workspace changes
- Safe area handling for mobile devices
- Integration with `@adaptive-desktop/adaptive-workspace` v0.6.0

## Architecture

This library provides React Native components that integrate with `@adaptive-desktop/adaptive-workspace` v0.6.0:

### Core Integration Pattern

1. **Workspace Creation**: Use `WorkspaceFactory.create()` to create workspace instances
2. **Component Integration**: Pass workspace to `WorkspaceView` component
3. **Automatic Updates**: Component watches `workspace.screenBounds` for re-rendering
4. **Safe Area Handling**: Built-in support for device safe areas

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
