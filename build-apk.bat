@echo off
echo Starting APK build process...

echo Step 1: Installing dependencies...
npm install

echo Step 2: Clearing cache...
npx expo start --clear

echo Step 3: Building APK with EAS...
eas build --platform android --profile preview --non-interactive

echo Build process completed!
pause 