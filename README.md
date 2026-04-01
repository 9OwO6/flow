# Flow (la-le-mo)

Private health companion built with **Expo SDK 54** and **React Native**. Track bowel movements with smoothness levels, water intake, reminders, streaks, and light celebratory feedback—all stored on-device.

## Features

- **Home**: quick log (smooth picker), detailed entry, hydration card, mini charts, weekly/monthly health reports modal.
- **History**: week / month / year views, search, export (CSV/JSON).
- **Settings**: language, delights (sound, haptics, motion, celebrations), **custom success sounds** (iOS/Android only: record or import up to 3 clips, optional shuffle), water nudges, privacy copy.
- **Onboarding** and optional **7-day share card** (native screenshot path).

## Tech stack

- Expo Router, React 19, TypeScript  
- React Native Paper, i18next (EN/ZH)  
- AsyncStorage, `expo-av`, `expo-notifications`, `expo-file-system` (legacy API where needed), `expo-document-picker`  

## Requirements

- Node.js 20+ recommended  
- [Expo dev environment](https://docs.expo.dev/get-started/installation/) for iOS Simulator / Android emulator or physical devices  

## Getting started

```bash
npm install
npx expo start
```

Common scripts:

| Command | Description |
|--------|-------------|
| `npm run start` | Metro + Expo dev menu |
| `npm run start:go` | Expo Go |
| `npm run android` | Development build on Android |
| `npm run ios` | Development build on iOS |
| `npm run web` | Web (some native-only modules are gated or stubbed) |
| `npm test` | Jest (watch mode) |

After changing native permissions (e.g. microphone for custom sounds), rebuild with `expo run:ios` / `expo run:android` or your EAS profile in `eas.json`.

## Build & release

- **EAS**: project id is configured under `expo.extra.eas` in `app.json`; use `eas build` as needed.  
- Store signing assets (`.jks`, `.p8`, etc.) must stay **local**—they are gitignored.  

## Privacy & data

- Bowel and water records live in **local storage** on the device.  
- Review in-app **Privacy** and **Medical disclaimer** screens before shipping.  

## 简体中文摘要

本地优先的如厕与饮水记录应用：快速记录五档顺畅度、饮水提醒、周报/月报、数据导出。成功音效可在 **设置 → 自定义成功音效**（仅手机端）中录音或导入最多 3 段短音频并可选随机播放；修改原生权限后需重新编译安装。

## License

Private / all rights reserved unless otherwise stated by the repository owner.
