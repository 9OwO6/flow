# Expo Go 无法加载问题排查指南

## 快速检查清单

### 1. 确认开发服务器已启动
```bash
npm start
```
应该看到：
- ✅ Metro bundler 正在运行
- ✅ 显示二维码
- ✅ 显示本地 URL (exp://...)

### 2. 检查网络连接
- **手机和电脑必须在同一 WiFi 网络**
- 如果不在同一网络，使用：
  ```bash
  npm start -- --tunnel
  ```

### 3. 检查 Expo Go 版本
- 确保 Expo Go 是最新版本
- Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
- iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

### 4. 清除缓存重新启动
```bash
# 停止当前服务器 (Ctrl+C)
# 清除缓存并重启
npm start -- --clear
```

### 5. 检查控制台错误
- 查看终端是否有红色错误信息
- 查看 Expo Go 应用内的错误提示

---

## 常见问题及解决方案

### 问题 1: 扫描后显示"无法连接到服务器"
**解决方案：**
```bash
# 使用 tunnel 模式（适合不同网络）
npm start -- --tunnel

# 或使用 localhost（需要 USB 连接）
npm start -- --localhost
```

### 问题 2: 显示"加载中"但一直不完成
**可能原因：**
- 代码有错误
- 依赖未安装
- i18n 初始化失败

**解决方案：**
```bash
# 1. 重新安装依赖
npm install

# 2. 清除缓存
npm start -- --clear

# 3. 检查错误日志
```

### 问题 3: 二维码扫描后没有任何反应
**解决方案：**
1. 检查手机网络是否正常
2. 尝试手动输入 URL（终端显示的 exp://...）
3. 重启 Expo Go 应用
4. 重启开发服务器

### 问题 4: 显示"需要开发客户端"
**原因：** 项目使用了 `expo-dev-client`

**解决方案：**
```bash
# 使用 Expo Go 模式启动
npm start -- --go
```

---

## 调试步骤

### 步骤 1: 检查开发服务器
```bash
npm start
```
确认看到：
```
Metro waiting on exp://192.168.x.x:8081
Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

### 步骤 2: 测试网络连接
在手机浏览器访问：
```
http://你的电脑IP:8081
```
应该能看到 JSON 响应

### 步骤 3: 查看详细日志
```bash
# 启用详细日志
EXPO_DEBUG=true npm start
```

### 步骤 4: 检查代码错误
查看终端是否有：
- ❌ 红色错误信息
- ⚠️ 黄色警告信息
- 🔴 编译失败提示

---

## 如果还是不行

### 方案 A: 使用 Tunnel 模式（推荐）
```bash
npm start -- --tunnel
```
这会通过 ngrok 创建隧道，即使不在同一网络也能连接。

### 方案 B: 检查防火墙
- Windows: 允许 Node.js 通过防火墙
- 确保端口 8081 未被占用

### 方案 C: 使用 Web 版本测试
```bash
npm start -- --web
```
在浏览器中测试应用是否正常。

---

## 快速修复命令

```bash
# 完全重置
rm -rf node_modules
npm install
npm start -- --clear

# 或 Windows
rmdir /s /q node_modules
npm install
npm start -- --clear
```

---

## 需要帮助？

如果以上方法都不行，请提供：
1. 终端显示的完整错误信息
2. Expo Go 应用内显示的错误
3. 你的网络环境（同一 WiFi 还是不同网络）

