# Phase 3 Visual Consistency — 逐页验收检查点

用于你对照 Before/After 截图（或真机目测）。**不包含新功能**，只做视觉与组件一致性。

---

## 全局规则（所有页面快速扫一眼）

| 检查项 | 通过标准 |
|--------|----------|
| **文字** | 业务文案均为 `AppText`（或 `Themed.Text`，其内部已是 AppText）；不出现页面级直接使用 RN `Text` / Paper `Text`。 |
| **图标** | 信息展示用 FontAwesome（或与现有 tabs 一致的向量图标）；**不作为信息图标使用的 emoji**（庆祝动画里的贴纸/彩蛋除外）。 |
| **间距** | 竖向区块间距、卡片内边距落在 **8 / 12 / 16 / 24**（token：`xs/sm/md/lg`）；避免 10、14、18、22 等随意值堆砌。 |
| **对话框** | 确认类：`AppConfirmDialog`（取消左、确认右）；危险操作用 **`destructive`** 红色确认按钮；正文与标题留白与 Playground 一致。 |
| **Snackbar** | `AppSnackbar` 内文字与背景对比清晰（inverse 可选）。 |

---

## Home（`/(tabs)` index）

- [ ] **Section**：`SectionHeader` 与下方卡片/图表之间的外边距约为 **16 / 24**，无明显忽大忽小。
- [ ] **提醒卡片**：文案等级清晰（标题 `h3` + 正文 `body2`），强调色仅用警示色而非 emoji。
- [ ] **上次排便**：单行正文 + 时钟图标，灰色阶一致。
- [ ] **快速记录**：主按钮区上下留白与其他区块对齐（`lg/md`）。
- [ ] **饮水**：`WaterTracker` 卡片 `padding="md"`，进度文案与按钮内文字用 AppText；按钮为图标 + 文字，无 emoji。
- [ ] **图表**：`DataVisualization` 柱状标签与数值可读，间距统一。
- [ ] **今日统计**：三列 Stat 卡片对齐，与 SectionHeader 间距 **md** 量级。
- [ ] **健康报告入口**：周报/月报使用 **日历 / 柱状图** 图标，标题副标题层级清晰（无 🌿 📊）。
- [ ] **报告 Modal 顶栏**：左侧图标 + 标题，右侧 `close`；标题无日历/图表 emoji 前缀。
- [ ] **报告正文**：`HealthReport` 分数卡与卡片标题层级统一；顺畅度分布为 **色点 + 文字**，无表情列。

---

## History（`/(tabs)` two）

- [ ] **顶栏**：标题 + 副标题（统计摘要）字重与颜色符合 secondary。
- [ ] **分段控件**：`SegmentedTabs` 选中/未选中对比清晰，圆角与 background token 一致。
- [ ] **周/月/年视图**：日历格内时间与空状态「-」对齐；月卡片数字层级统一。
- [ ] **删除记录 Dialog**：详情三行字段对齐；**删除**为 contained + **`theme.colors.error`** + `textOnPrimary`；关闭为文本按钮。
- [ ] **间距**：列表卡片之间、筛选区域与列表之间为 **md/lg** 档位。

---

## Settings（`/(tabs)` settings）

- [ ] **分组标题**：`SettingsGroup` caption + 卡片，组与组之间约 **lg**。
- [ ] **行组件**：标签/副标题为 AppText；右侧 chevron 为 **FontAwesome**，不是 `›` 字符。
- [ ] **清除全部数据**：点击后弹出 **`AppConfirmDialog` + `destructive`**，**不是**系统 `Alert` 双按钮；成功后 **`AppAlertDialog`** 单行确认。
- [ ] **自定义成功音区块**：全部为 AppText，按钮排布整齐。
- [ ] **`__DEV__`**：存在 **Development → UI Playground** 入口（仅开发构建）。

---

## 模态与辅助页

- [ ] **快速记录舒适度**：五色为 **纯色圆点** + 标签，无舒适度 emoji。
- [ ] **饮水快速记**：标题/副标题/chip 文案为 AppText。
- [ ] **法律/免责 Modal**：关闭为 **FontAwesome `close`**，无 `✕` 字符。
- [ ] **分享 7 天 Modal**：同上；加载/空状态/说明文字为 AppText + token 颜色。
- [ ] **分享卡片 PNG**（`SevenDayShareCard`）：嵌套强调用 AppText，无裸 RN Text。
- [ ] **Onboarding**：折叠块内标题与正文为 AppText。
- [ ] **成就/激励**（若仍使用 `MotivationalMessage`）：成就用奖杯图标；随机句前为向量图标；统计行用 **line-chart / bullseye**，无 📈 🎯。

---

## 庆祝动画（例外范围）

- [ ] **SuccessCelebration**：贴纸/confetti 仍可为 emoji（产品允许的 celebration 彩蛋）；**底部 toast 文案**为 AppText，与全局字号一致。

---

## UI Playground（仅限 `__DEV__`，路由 `/playground`）

- [ ] 非 dev 构建打开会 **redirect** 回 tabs。
- [ ] 可逐项看到：Typography 档、图标行、spacing 示意条、Snackbar + 三种 Dialog（含 destructive）。

---

## 推荐截屏清单（供你贴 Before/After）

1. Home 全屏（含报告入口）
2. 报告 Modal（顶栏 + HealthReport 分布一页）
3. History 周视图 + 删除 Dialog
4. Settings（含清除数据确认弹窗一次）
5. QuickRecord 舒适度弹层
6. Playground 一页汇总

---

## 已知未在本次 Phase 3 强行修改项（避免误判）

- `EditScreenInfo` / `StyledText` 等模板代码仍可能使用 `Themed`（底层已是 AppText）。
- `react-native-paper` 的 `Dialog.Title`、`Button`、`Chip` 等内部实现不限（页面侧未直接使用 Paper `Text` 承载业务段落即可）。
