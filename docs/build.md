# Build Notes

This document consolidates build and release notes for Flow.

## Android APK build

Recommended build path:

```bash
npx eas build --platform android --profile preview
```

The `preview` profile should produce an Android APK suitable for manual installation and portfolio demonstration.

## Useful commands

```bash
# Check Expo / dependency health
npx expo-doctor

# Fix Expo-compatible package versions
npx expo install --fix

# Clear local Expo cache
npx expo start -c

# Build Android preview APK
npx eas build --platform android --profile preview --clear-cache
```

## Release process

1. Build the APK.
2. Rename the file using a clear versioned name, for example:

```text
flow-v1.0.0.apk
```

3. Create a GitHub Release using a tag such as:

```text
v1.0.0
```

4. Upload the APK as a release asset instead of committing it to the repository.

## Notes

- Keep large build artifacts out of the main repository.
- Use GitHub Releases for APK files.
- If EAS fails, inspect the `Run gradlew` step in the Expo build logs.
- Most build issues in this project came from Expo / React Native dependency compatibility and cache state.
