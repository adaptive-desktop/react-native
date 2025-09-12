## Committing Code

- All code must pass tests, linting, and formatting before committing.
- Use the following scripts to verify and auto-format:
  - `yarn test` — Run all tests
  - `yarn lint` — Run linter
  - `yarn format:check` — Check code formatting
  - `yarn format` — Auto-format code (run this before committing)
- Only commit code when all checks pass and code is auto-formatted.

# Copilot Instructions for @adaptive-desktop/react-native

This project provides React Native components for adaptive desktop layouts, built on the `@adaptive-desktop/adaptive-workspace` core. Use these guidelines to maximize AI agent productivity and maintain project conventions.

## Architecture Overview

- **Core Principle:** All layout logic is delegated to `@adaptive-desktop/adaptive-workspace` (framework-agnostic). This repo is a React Native wrapper.
- **Key Components:**
  - `WorkspaceView`, `Panel`, `ViewportView` (see `src/components/`)
  - Demo usage: `src/demo/AdaptiveDesktopDemo.tsx`
- **Data Flow:**
  - Workspace state is managed via the core library and passed as props to React Native components.
  - Use `createWorkspaceConfig` for workspace setup.
- **Type Safety:** All code is TypeScript-first. Types are defined in `src/components/Panel/types.ts` and similar files.

## Developer Workflows

- **Build:**
  - Standard: `yarn build`
  - Build & verify: `yarn build-and-verify` (runs `bin/verify-build.js`)
- **Test:**
  - Run all tests: `yarn test` (Jest, 100% coverage expected)
  - Test files: `*.test.ts(x)` in `src/`
- **Verification:**
  - Use `yarn verify-build` to check build artifacts and type declarations (see `bin/verify-build.js`)
- **iOS/Android:**
  - Native code in `ios/` and `android/` folders. Use standard React Native CLI for platform-specific builds.

## Project Conventions

- **Safe Area:**
  - All consumers of this library must wrap their app in `SafeAreaProvider` from `react-native-safe-area-context`.
  - Library components should assume they are rendered within a `SafeAreaProvider` context, but should **not** wrap themselves in it.
- **Component Structure:**
  - Each major component has its own folder with `index.ts`, main component, stories, and tests.
  - Example: `src/components/Panel/Panel.tsx`, `Panel.stories.tsx`, `Panel.test.tsx`
- **Exports:**
  - All public components are re-exported from `src/components/index.ts`.
- **Demo:**
  - Use `src/demo/AdaptiveDesktopDemo.tsx` for integration and manual testing.

## Patterns & Integrations

- **Workspace Management:**
  - Use `WorkspaceFactory` and `createWorkspaceConfig` for workspace instantiation.
- **Testing:**
  - Use Jest for all tests. 100% coverage is enforced.
- **External Dependencies:**
  - Peer: `@adaptive-desktop/adaptive-workspace`, `react-native-safe-area-context`

## Package Management

- This project uses **Yarn 4.9.4**. Use `yarn` commands for all dependency management and scripts.
- **Expo:** To add a package, use `yarn expo install <package-name>` (ensures correct native versions for Expo projects).

## Common Yarn Scripts

- `yarn demo` / `yarn demo:android` / `yarn demo:ios` / `yarn demo:web` — Run the demo app on all or specific platforms
- `yarn storybook` / `yarn storybook:android` / `yarn storybook:ios` / `yarn storybook:web` — Run Storybook for component development
- `yarn library:build` — Build the component library (via Bob)
- `yarn library:verify` — Run build verification script
- `yarn test` / `yarn test:watch` / `yarn test:coverage` — Run tests, watch mode, or with coverage
- `yarn format` / `yarn format:check` — Format codebase or check formatting
- `yarn prebuild` / `yarn prebuild:clean` — Prepare native code for Expo (must run before `yarn android`/`yarn ios` if native changes are made)
- `yarn android` / `yarn ios` — Build and run native app via Expo

## References

- Main entry: `App.tsx`, `src/index.tsx`
- Component examples: `src/components/Panel/Panel.stories.tsx`, `src/components/ViewportView/ViewportView.stories.tsx`
- Build verification: `bin/verify-build.js`

> For more, see the main [README.md](../README.md) and demo files.
