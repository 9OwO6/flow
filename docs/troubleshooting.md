# Troubleshooting Notes

This document collects development and Expo troubleshooting notes for Flow.

## Expo Go loading checklist

If the app does not load in Expo Go, check the following first:

1. Start the development server:

```bash
npm start
```

2. Make sure the phone and computer are on the same Wi-Fi network.

3. If the devices are not on the same network, use tunnel mode:

```bash
npm start -- --tunnel
```

4. Clear the Expo cache:

```bash
npm start -- --clear
```

5. Confirm Expo Go is up to date on the phone.

## Common issues

### Cannot connect to development server

Try:

```bash
npm start -- --tunnel
```

Also check firewall settings and whether port `8081` is blocked.

### App stays on loading screen

Possible causes:

- dependency installation problem
- JavaScript runtime error
- i18n initialization issue
- stale Metro cache

Try:

```bash
rm -rf node_modules
npm install
npm start -- --clear
```

On Windows:

```bash
rmdir /s /q node_modules
npm install
npm start -- --clear
```

### Build fails on EAS / Gradle

Try:

```bash
npx expo-doctor
npx expo install --fix
npx eas build --platform android --profile preview --clear-cache
```

If it still fails, inspect the `Run gradlew` stage in Expo build logs. The real error is usually inside that step.

## Notes

- Expo / React Native version compatibility is a common failure source.
- When in doubt, verify package versions with `npx expo install --check`.
- Keep temporary troubleshooting notes in `docs/` instead of the repository root.
