# 构建问题排查指南

## 当前问题
Gradle 构建失败。需要查看详细日志来定位问题。

## 查看构建日志
访问构建日志链接：
https://expo.dev/accounts/wyhj/projects/la-le-mo/builds/f797f167-2554-428e-b9ef-043b6863657c

点击 "Run gradlew" 阶段查看详细错误信息。

## 常见问题和解决方案

### 1. 依赖版本冲突
如果日志显示依赖版本问题，可以尝试：
```bash
npm install --legacy-peer-deps
```

### 2. 清理缓存
```bash
# 清理 npm 缓存
npm cache clean --force

# 清理 Expo 缓存
npx expo start -c
```

### 3. 检查 babel 配置
确保 `babel.config.js` 中 `react-native-reanimated/plugin` 是最后一个插件。

### 4. 重新构建
修复问题后，重新运行：
```bash
npx eas build --platform android --profile preview
```

## 如果问题持续

1. **查看完整日志**：访问上面的链接，查看 "Run gradlew" 阶段的完整错误
2. **检查依赖**：确保所有依赖都是 SDK 54 兼容的版本
3. **简化构建**：可以尝试先构建一个最小版本，逐步添加功能

## 替代方案：本地构建

如果 EAS Build 持续失败，可以考虑本地构建：

1. 安装 Android Studio
2. 运行 `npx expo prebuild`
3. 在 Android Studio 中打开 `android` 文件夹
4. 构建 APK

但这需要完整的 Android 开发环境。

