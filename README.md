# Hyperhire Tinder

A Tinder-inspired swiping app for Hyperhire, enabling users to discover and like profiles with a modern mobile interface.

## Tech Stack

- **React Native** with [Expo](https://expo.dev)
- **TypeScript** for type safety
- **Jotai** for lightweight, atomic state management. Chosen over Recoil because Recoil lacks React 19 support and Facebook shows no plans to update ([GitHub issue](https://github.com/facebookexperimental/Recoil/issues/2318#issuecomment-2120383312)).
- **React Query** (TanStack Query) for data fetching, caching, and synchronization
- **Atomic Design** for component organization (atoms, molecules, organisms)

## Project Structure

```
root/
├── app/               # Expo Router file-based routing
├── assets/            # Static assets (images/, icons, splash screen, Tinder logo)
├── components/        # Atomic design components
    ├── atoms/         # Reusable UI primitives
    ├── molecules/     # Composed components
    └── organisms/     # Complex sections
├── constants/         # App constants (theme.ts)
├── hooks/             # Custom React hooks
├── store/             # Jotai state atoms
├── types/             # TypeScript types
```

## Features

- Custom splash screen using Tinder logo with programmatic visibility control
- Profile discovery with swiping interface (dummy implementation)
- Jotai-powered liked profiles: Save likes from main screen and view on discover tab
- Responsive design following atomic principles

## Environment Setup

This project uses **local development builds** via `npx expo run:ios` or `npx expo run:android` (no Expo Go or EAS CLI needed) to enable custom native modules.

**Before running, set up your environment:**

Follow the [Expo guide](https://docs.expo.dev/get-started/set-up-your-environment):

- **iOS (macOS only)**: Install Xcode from the App Store and Xcode Command Line Tools (`xcode-select --install`)
- **Android**: Install [Android Studio](https://developer.android.com/studio), set up Android SDK and an emulator or connect a device

## Quick Start

1. Install dependencies

   ```bash
   npm install
   ```

2. Run the app:
   - **iOS Simulator**:
     ```bash
     npx expo run:ios
     ```
   - **Android Emulator/Device**:
     ```bash
     npx expo run:android
     ```

**Note**: First run performs prebuild (generates `ios/` and `android/` directories), installs native dependencies (CocoaPods for iOS, Gradle for Android), and launches the app. Subsequent runs are faster.

For physical devices: Connect via USB; select device with `i` (iOS) or `a` (Android) when prompted.

Optionally start the dev server manually:

```bash
npx expo start --dev-client
```

## Reset to Blank Project

```bash
npm run reset-project
```

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [Prebuild](https://docs.expo.dev/workflow/prebuild/)
- [Jotai](https://jotai.org/)
- [React Query](https://tanstack.com/query/latest/)
