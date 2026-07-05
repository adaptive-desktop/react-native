# v0.5.0 - 2026-07-05

- Upgraded project dependencies from Expo SDK 56 to Expo SDK 57
- Updated React Native runtime/tooling alignment to `react-native@0.86.0`
- Regenerated dependency lockfile for Expo 57-compatible package set

# v0.4.0 - 2026-05-28

- Expo 56-only release contract cleanup for published runtime usage
- Reduced runtime peerDependencies to required imports only (`react`, `react-native`, `react-native-safe-area-context`)
- Removed demo component export from the package root entrypoint

# v0.3.2 - 2025-09-28

- Fixed TypeScript build for library output:
  - Added react-native as a devDependency for type checking
  - Updated tsconfig to avoid DOM type conflicts (lib: ["esnext"], skipLibCheck)
  - Removed 'react-native' from types array
- Library now builds cleanly for consumers and CI

# v0.3.1 - 2025-09-28

- Moved react, react-dom, react-native, and expo to peerDependencies to prevent version conflicts
- Updated minimum expo peerDependency to 50.0.0 (React 19 support)
- Ensured peerDependency ranges match supported versions
- No breaking changes; safe for all consumers

# v0.3.0 - 2025-09-26

- Feature: Workspace viewports now automatically update when the screen size or orientation changes
- No breaking changes; fully backward compatible

# Changelog

All notable changes to this project will be documented in this file.

## v0.2.0 - 2025-09-26

- BREAKING: Remove static WorkspaceFactory.create, use instance methods and idGenerator everywhere
- All tests and stories now use WorkspaceFactory.fromSnapshot or instance .create()
- Demo and stories updated for new workspace API
- Improved Storybook device/orientation switching and snapshot loading
- Lint, type, and test fixes for new workspace API
- Removed legacy test utils and static JSON snapshot loading
- Upgraded @adaptive-desktop/adaptive-workspace to v0.7.4

## v0.1.1 - 2025-09-12

- Added `.github/copilot-instructions.md` and improved project documentation
- Updated and simplified GitHub Actions publish workflow
- Added new ESLint config and related dev dependencies
- Upgraded Expo, React Native, and related dependencies
- Refactored `WorkspaceView` and its tests (simplified viewport rendering and test coverage)
- Minor code and test cleanups

## v0.1.0 - 2025-09-10

- Initial release of `@adaptive-desktop/react-native`
- React Native components for adaptive desktop layouts
- Integration with `@adaptive-desktop/adaptive-workspace` v0.6.x
- TypeScript types and ESM/CJS build via react-native-builder-bob
- Verified build artifacts and exports
