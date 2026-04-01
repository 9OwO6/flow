# Flow App - Android APK 构建指南

## 方法一：使用 EAS Build（推荐）✨

EAS Build 是 Expo 官方提供的云端构建服务，最简单快捷。

### 前置要求
1. 已安装 `eas-cli`（项目已包含）
2. 已登录 Expo 账户（之前已经登录过）

### 步骤

#### 1. 确保已登录
```bash
npx eas login
```

#### 2. 配置构建（如果还没有 eas.json）
项目已经有 `eas.json`，可以直接使用。

#### 3. 开始构建 APK
```bash
npx eas build --platform android --profile preview
```

这会生成一个 APK 文件（可以直接安装到手机）。

#### 4. 等待构建完成
- 构建会在云端进行，通常需要 10-20 分钟
- 构建完成后，EAS 会提供一个下载链接
- 你可以：
  - 在终端中看到下载链接
  - 访问 https://expo.dev 查看构建状态和下载链接

#### 5. 下载并安装
- 点击下载链接下载 APK 文件
- 将 APK 传输到手机（通过 USB、云盘、微信等）
- 在手机上允许"安装未知来源应用"
- 点击 APK 文件安装

### 构建配置说明

**Preview Profile（预览版）**：
- 生成 APK 文件，可以直接安装
- 适合测试和个人使用
- 不需要 Google Play 开发者账户

**Production Profile（生产版）**：
- 生成 AAB 文件（用于 Google Play 上架）
- 需要签名配置
- 适合正式发布

## 方法二：本地构建（需要 Android Studio）

如果你有 Android Studio 和完整的 Android 开发环境，也可以本地构建。

### 步骤

#### 1. 生成原生项目
```bash
npx expo prebuild
```

#### 2. 构建 APK
```bash
cd android
./gradlew assembleRelease
```

#### 3. 找到 APK
APK 文件会在 `android/app/build/outputs/apk/release/app-release.apk`

## 推荐方案

**建议使用方法一（EAS Build）**，因为：
- ✅ 不需要安装 Android Studio
- ✅ 不需要配置 Android SDK
- ✅ 云端构建，不占用本地资源
- ✅ 自动处理签名和优化
- ✅ 可以随时下载 APK

## 注意事项

1. **首次构建**：可能需要较长时间（20-30分钟）
2. **网络要求**：需要稳定的网络连接
3. **APK 大小**：预计 30-50MB
4. **安装权限**：Android 手机需要允许"安装未知来源应用"

## 快速命令

```bash
# 构建 APK（预览版）
npx eas build --platform android --profile preview

# 查看构建状态
npx eas build:list

# 下载构建结果
npx eas build:download
```

## 构建完成后

构建完成后，你会得到：
- 一个 APK 文件下载链接
- 可以下载到电脑，然后传输到手机安装
- 或者直接在手机上打开链接下载

祝你构建顺利！🎉

