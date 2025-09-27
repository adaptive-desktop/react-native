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
