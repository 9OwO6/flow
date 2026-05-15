# UI Polish — Phase 2 (Paper + DesignTokens alignment)

## Before → After（按组件）

| 组件 | Before | After |
|------|--------|--------|
| **PaperProvider** | 默认 MD3 紫系 palette，与 App 纸张绿不一致 | `flowPaperLightTheme`：`constants/paperTheme.ts` 映射 `DesignTokens.colors` + `radius.sm` |
| **RecordModal** | `Alert.alert` 成功/间隔/错误 | `AppSnackbar`（编辑保存成功）、`AppAlertDialog`（间隔提示、保存失败）；标题/分区用 `AppText` |
| **ModernCard** | 仅静态 Surface | 可选 `onPress`/`onLongPress` + pressed 透明度；可覆盖 `backgroundColor`/`borderColor`；interactive 时外层 `Pressable` 承接 `style` 边距 |
| **StatCard** | 自建 `Surface` + RN `Text` | 基于 `ModernCard` + `AppText` |
| **HistoryListItem** | `TouchableOpacity` + `Themed` Text | `ModernCard` 按压；`AppText`；`notes` **最多 2 行** |
| **PrimaryButton** | RN `Text` | `AppText variant="button"` |
| **HealthAlert** | Paper Card + emoji + 硬编码背景/阴影 | `design-system/AlertBanner`：FontAwesome 类型图标 + tokens；`HealthAlert.tsx` 仅 re-export |
| **SkeletonLoader** | 无卸载、无 Reduce Motion | `useEffect` cleanup `loop.stop()`；Reduce Motion → 静态灰块 `surfaceVariant` |
| **AppText**（新建） | — | `h1`–`button` + 语义 `color` |

## 逐文件改动列表

| 文件 | 变更 |
|------|------|
| `constants/paperTheme.ts` | **新建**：MD3 Light 覆盖 primary/surface/background/outline/error/onSurface… |
| `app/_layout.tsx` | `PaperProvider theme={flowPaperLightTheme}` |
| `components/design-system/AppText.tsx` | **新建** |
| `components/design-system/AppSnackbar.tsx` | **新建**（Portal + Snackbar） |
| `components/design-system/AppConfirmDialog.tsx` | **新建**（`AppConfirmDialog` + `AppAlertDialog`） |
| `components/design-system/ModernCard.tsx` | 按压态、`style` 位置、tokens 底色/边框 |
| `components/design-system/StatCard.tsx` | `ModernCard` + `AppText` |
| `components/design-system/HistoryListItem.tsx` | `ModernCard` + `AppText` + notes `numberOfLines={2}` |
| `components/design-system/PrimaryButton.tsx` | `AppText` |
| `components/design-system/SkeletonLoader.tsx` | cleanup、`DimensionValue`、`useReduceMotion` 静态降级 |
| `components/design-system/AlertBanner.tsx` | **新建**（替代原 HealthAlert UI） |
| `components/HealthAlert.tsx` | 改为 re-export `AlertBanner` |
| `components/RecordModal.tsx` | 去 `Alert`；接 Snackbar / AlertDialog；Paper `Text` → `AppText`（局部） |

## Card / Button / Dialog 规范摘要

- **Card（ModernCard）**：`radius.lg`、`borderWidth: 1`、`borderColor`、`elevation` 取自 tokens；按压 `opacity ≈ 0.94`。
- **Button（PrimaryButton）**：`radius.md`、`elevation.sm`（filled）；文案 `AppText` + `typography.button`。
- **Dialog**：Paper `Dialog` + tokens 色；destructive 预留 `AppConfirmDialog.destructive`（RecordModal 当前主要为提示型）。

## 真机截图对比（须本地补充）

当前环境无法代为截取 **iOS / Android / Web** 真机画面。请在仓库根目录自建目录（例如 `docs/screenshots/phase2/`）并上传：

| 平台 | Home | History | RecordModal | Settings |
|------|------|---------|-------------|----------|
| iOS | `ios-home.png` | `ios-history.png` | `ios-record-modal.png` | `ios-settings.png` |
| Android | `android-home.png` | … | … | … |
| Web | `web-home.png` | … | … | … |

建议在 PR 描述中贴 Before/After 拼图各一张。

## 后续（未在本次范围内）

- 全站其余页面逐步替换 `Text`/`Themed` 为 `AppText`。
- `SearchBar.tsx` 等处重复的 `elevation`（既有 TS 告警）可单独收尾。
- Navigation theme 仍跟系统 DarkTheme/DefaultTheme；若要与 Paper 完全一致可再做 Navigation tokens 对齐。
