import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// @ts-ignore - AsyncStorage may not have types in some environments
import AsyncStorage from '@react-native-async-storage/async-storage';

// 英文翻译
const en = {
  // 通用
  common: {
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    delete: 'Delete',
    edit: 'Edit',
    confirm: 'Confirm',
    loading: 'Loading...',
    success: 'Success!',
    error: 'Error',
    warning: 'Warning',
    later: 'Later',
  },
  
  // 主页
  home: {
    title: 'Flow',
    subtitle: 'Track your body flow',
    quickRecord: 'Track Flow',
    editRecord: 'Edit Flow',
    healthReport: 'Health Report',
    todayStats: 'Today\'s Stats',
    todayRecords: 'Today\'s Records',
    totalRecords: 'Total Records',
    records: 'records',
    healthScore: 'Health Score',
    cooldownMessage: 'You can record again in {{time}}',
    cooldownDisabled: 'Record disabled',
    motivationalMessage: 'Keep up the good work! 🌟',
    detailedHealthAnalysis: 'View detailed health analysis reports',
    // 幽默消息（改为更有机、健康的提示）
    humorousMessages: [
      'Take a deep breath and relax 🌿',
      'Your body is finding its rhythm ✨',
      'Rest is essential for flow 🌊',
      'Keep listening to your body 🧘'
    ],
    // 按钮文本
    buttonSubText: 'Click to record poop',
    cooldownSubText: '{{time}} minutes until available',
    // 报告相关
    noDataForReport: 'No data available, cannot generate report',
    generateReportError: 'Failed to generate report, please try again later',
    generateReportFailed: 'Failed to generate report',
    lastPoop: 'Last bowel movement',
    emptyGuideTitle: 'Start in your own time',
    emptyGuideSubtitle: 'No entries yet — that is okay.',
    emptyGuideBullets: [
      'Everything stays on this device until you export or share.',
      'Use quick log or add details whenever it feels right.',
      'This app is for awareness, not diagnosis.',
    ],
    emptyGuideCta: 'Tap Track Flow when you are ready.',
    recordIntervalTitle: 'Already logged recently',
    recordIntervalMessage:
      'Only one new entry every 3 hours. You can add again in about {{minutes}} minutes. (You can still edit your latest entry in History.)',
  },
  
  // 历史记录
  history: {
    title: 'History 📊',
    week: 'This Week',
    month: 'This Month',
    year: 'Year',
    searchPlaceholder: 'Search records...',
    noRecords: 'No records found',
    noRecordsSubtitle: 'Start tracking your body flow to see your health insights',
    weekTitle: 'This Week\'s Records 📅',
    monthTitle: 'Calendar View',
    yearTitle: 'Year Statistics',
    // 周/月名称
    weekDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    recordDetails: 'Record Details 📝',
    time: 'Time',
    feeling: 'Feeling',
    notes: 'Notes',
    none: 'None',
    deleteConfirm: 'Are you sure you want to delete this record?',
    deleteSuccess: 'Record deleted successfully! ✨',
    deleteError: 'Failed to delete record 😥',
    // 删除相关
    deleteTitle: 'Confirm Delete 🗑️',
    deleteMessage: 'Are you sure you want to delete this record? This action cannot be undone!',
    deleteButton: 'Delete',
    deleteFailed: 'Delete Failed',
    recordNotFound: 'Record not found',
    deleteSuccessMessage: 'Record has been safely deleted! ✨',
    deleteErrorMessage: 'Delete failed 😥',
    // 记录相关
    recordSuccess: 'Record saved! 🎉',
    updateSuccess: 'Updated successfully! ✨',
    updateMessage: 'Record has been updated!',
    // 统计相关
    times: 'times',
    recordCount: '{{count}} records',
    dayRecords: '{{day}} 条记录',
    dayRecordsTitle: '{{day}} Records',
    emptyGuidedTitle: 'Your log is empty',
    emptyGuidedSubtitle:
      'Add a record from the Home tab. Everything stays on this device until you export or share.',
  },
  
  // 记录模态框
  recordModal: {
    newTitle: 'Track Flow 🌿',
    editTitle: 'Edit Record ✏️',
    timeInfo: 'Current time: {{date}} {{time}}',
    feelingQuestion: 'How do you feel? 🤔',
    notesLabel: 'Notes (optional) 💭',
    notesPlaceholder: 'Record your feelings today...',
    saveButton: 'Save Record',
    updateButton: 'Update Record',
    saveSuccess: 'Record saved successfully! ✨',
    updateSuccess: 'Record updated successfully! ✨',
    saveError: 'Failed to save record 😥',
  },
  
  // 健康报告
  health: {
    healthReport: 'Health Report',
    weeklyReport: 'Weekly Report',
    monthlyReport: 'Monthly Report',
    weeklyReportSubtitle: 'View this week\'s health analysis',
    monthlyReportSubtitle: 'View this month\'s health analysis',
    overview: 'Overview',
    totalRecords: 'Total Records',
    averageFrequency: 'Average Frequency',
    consistency: 'Consistency',
    smoothness: 'Smoothness',
    healthScore: 'Health Score',
    recommendations: 'Recommendations',
    trends: 'Trends',
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor',
    veryPoor: 'Very Poor',
  },

  /** Full localized copy for generated analytics report (UI + service strings) */
  healthReport: {
    periodRange: '{{start}} – {{end}}',
    scoreTitle: 'Health score',
    scoreOutOf: '/ 100',
    scoreBandExcellent: 'Excellent',
    scoreBandGood: 'Good',
    scoreBandFair: 'Fair',
    scoreBandPoor: 'Needs improvement',
    overviewTitle: '📊 Summary',
    statAvgPerDay: 'Avg per day',
    statAvgSmooth: 'Avg comfort',
    statAvgGap: 'Avg gap (days)',
    ratingTitle: '🏆 Ratings',
    labelConsistency: 'Regularity',
    labelSmoothness: 'Comfort',
    labelOverall: 'Overall',
    distributionTitle: '📈 Comfort distribution',
    recommendationsTitle: '💡 Tips',
    trendsTitle: '📊 Trends',
    timePatternTitle: '⏰ Time pattern',
    reportTitle: '📋 Health report',
    closeReport: 'Close report',
    distCount: '{{count}}× ({{pct}}%)',
    hourCount: '{{count}}×',
    emptyStart: 'Start logging to better understand your patterns.',
    noTrendData: 'Not enough data yet.',
    trendFreqUp: 'Recent frequency is a bit higher.',
    trendFreqDown: 'Recent frequency is a bit lower.',
    trendFreqStable: 'Frequency is holding steady.',
    trendSmoothUp: 'Comfort looks a little better lately.',
    trendSmoothDown: 'Comfort looks a little lower lately.',
    trendSmoothStable: 'Comfort is holding steady.',
    trendDataShort: 'Not enough data to judge trends.',
    rec_cp1: '💧 Hydrate steadily through the day.',
    rec_cp2: '🥗 Add more fiber-rich foods (vegetables, fruit, whole grains).',
    rec_cp3: '🚶 Keep gentle movement in your routine.',
    rec_cf1: '⏰ Try a calm, regular bathroom routine.',
    rec_cf2: '🍎 Add a bit more fiber if it feels right for you.',
    rec_sp1: '🚰 Drink enough water so urine stays pale yellow.',
    rec_sp2: '🥬 Add leafy greens and whole foods if you can.',
    rec_sp3: '🧘 Stress can affect digestion—small breaks help.',
    rec_sf1: '🥤 Warm water or light fluids can feel soothing.',
    rec_sf2: '🌾 Swap in some whole grains where easy.',
    rec_fl1: '📅 If you rarely go, note timing and fluids—you may want clinician input.',
    rec_fl2: '🌅 A relaxed morning routine can help regularity.',
    rec_fh1: '⚠️ If frequency feels unusually high for you, consider medical advice.',
    rec_gap1: '🚨 Several days without a movement warrants checking in with a clinician.',
    rec_pos1: '🎉 Patterns look strong—keep the habits that work for you.',
  },
  
  // 顺畅度级别
  smoothLevel: {
    veryDifficult: 'Very Difficult',
    difficult: 'Difficult',
    normal: 'Normal',
    smooth: 'Smooth',
    verySmooth: 'Very Smooth',
  },

  diet: {
    highFiber: 'High fiber',
    lowFiber: 'Low fiber',
    oily: 'Oily',
    spicy: 'Spicy',
    dairy: 'Dairy',
    caffeine: 'Caffeine',
    alcohol: 'Alcohol',
  },

  legal: {
    privacyTitle: 'Privacy (local-first)',
    privacyBody:
      'Flow stores your entries on this device using local storage. We do not operate a Flow account or sync server—your logs stay on your phone unless you export or share them yourself. Clearing app data or uninstalling may delete local records, so use Export if you need a backup. If you enable OS backups, data may be included in your device backup at the system level.',
    disclaimerTitle: 'Medical disclaimer',
    disclaimerBody:
      'Flow is a self-tracking tool for personal awareness. It is not a medical device and does not diagnose, treat, or prevent any disease. Trends, summaries, and share cards are for convenience only. Always seek qualified health advice for symptoms or concerns.',
  },

  onboarding: {
    pageTitle: 'Welcome to Flow',
    privacyHeading: 'Your data stays local',
    privacyText:
      'Entries are saved only on this device. Nothing is uploaded to Flow servers. You control exports and any image you share.',
    whyHeading: 'Why keep a simple log?',
    whyText:
      'Noticing patterns over time can help you reflect on hydration, meals, and how you feel—without judgement. Use it in a way that feels comfortable for you.',
    disclaimerHeading: 'Not medical advice',
    disclaimerText:
      'Flow does not diagnose or treat conditions. Talk to a clinician for health decisions. You can read the full disclaimer anytime in Settings.',
    continue: 'Continue',
  },

  share: {
    cardBrand: 'FLOW',
    cardHeadline: '7-day reflection',
    cardRange: '{{start}} – {{end}}',
    cardTotal: 'Entries (7 days):',
    cardAvgComfort: 'Avg comfort',
    cardAvgComfortLine: '{{label}}: {{value}}',
    cardTrend: 'Trend',
    cardTagsTitle: 'Tagged meals / habits (when logged)',
    cardNoTags: 'No diet tags in this window',
    cardDisclaimer:
      'For personal use only. Not medical advice. Flow does not diagnose or treat any condition.',
    cardTagLine: '{{label}} · {{count}}',
    trend: {
      steady: 'Activity was fairly steady across the week.',
      up: 'More entries toward the end of the window.',
      down: 'More entries toward the start of the window.',
    },
    modalTitle: '7-day summary card',
    previewCaption: 'Preview — exported image may look sharper on device.',
    sharePng: 'Share PNG',
    sharing: 'Preparing…',
    notEnoughData: 'Add at least one entry in the last 7 days to build a card.',
    localNote: 'Image is generated locally from your saved entries.',
    homeCta: 'Share 7-day card',
    settingsCta: 'Create & share 7-day PNG',
  },
  
  // 设置
  settings: {
    title: 'Settings',
    subtitle: 'Customize your experience',
    language: 'Language',
    english: 'English',
    chinese: '中文',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    about: 'About',
    version: 'Version',
    clearData: 'Clear All Data',
    clearDataConfirm: 'Are you sure you want to clear all data? This action cannot be undone.',
    languageChanged: 'Language changed to English',
    clearDataSuccess: 'All data cleared successfully!',
    clearDataError: 'Failed to clear data',
    changeLanguageError: 'Failed to change language',
    dataManagement: 'Data Management',
    followsSystem: 'Follows system settings',
    description: 'Track your body flow with ease and care',
    reminderSettings: 'Reminder Settings',
    maxDaysWithoutPoop: 'Alert after days without bowel movement',
    waterSettings: 'Water Settings',
    dailyWaterGoal: 'Daily water goal (ml)',
    settingsSaved: 'Settings saved successfully',
    saveError: 'Failed to save settings',
    exportCSV: 'Export CSV',
    exportJSON: 'Export JSON',
    exportSuccess: 'Data exported successfully',
    exportError: 'Failed to export data',
    delightSection: 'Sound & feedback',
    delightSound: 'Success sound',
    delightHaptics: 'Haptics',
    delightMotion: 'Enhanced motion',
    delightTestSound: 'Test sound',
    delightSoundOffHint: 'Turn on “Success sound” to hear the test.',
    celebrationToggle: 'Celebration on save',
    celebrationSillyToggle: 'Silly mode (funny lines + extra sparkles)',
    celebrationPreview: 'Preview celebration',
    celebrationOffHint: 'Turn on “Celebration on save” to preview.',
    celebration: {
      n1: 'Nice — logged.',
      n2: 'Good job.',
      n3: 'Noted with care.',
      n4: 'One more step for your rhythm.',
      n5: 'Captured. Well done.',
      s1: 'Mission accomplished! (toilet edition)',
      s2: 'Another heroic flush… of data.',
      s3: 'You’re on a roll — literally.',
      s4: 'Science thanks you for this sample.',
      s5: 'Legend status: updated.',
    },
    legalSection: 'Privacy & disclaimer',
    privacyPolicy: 'Privacy policy',
    medicalDisclaimer: 'Medical disclaimer',
    showWelcomeAgain: 'Show welcome screen again',
    guidanceSection: 'Guidance',
    emptyGuidanceToggle: 'Empty-state tips on Home & History',
    shareSection: 'Sharing',
    share7DayToggle: '7-day summary share card',
    notificationPermissionNeeded: 'Please allow notifications in system settings to use hydration reminders.',
    customSoundSection: 'Custom success sound',
    customSoundHint: 'Add up to 3 short clips (record or import). Shown only on iPhone / Android. Max about 2 MB each.',
    customSoundUseCustom: 'Use custom clips',
    customSoundUseCustomSub: 'When on (and clips exist), plays one of your sounds after a successful quick log instead of the default chime.',
    customSoundRandom: 'Random clip',
    customSoundRandomSub: 'Picks one of your saved clips at random when more than one exists.',
    customSoundRandomNeedTwo: 'Add at least two clips to enable random playback.',
    customSoundSlot: 'Clip {{n}}',
    customSoundImport: 'Import',
    customSoundRecord: 'Record',
    customSoundStop: 'Stop',
    customSoundPreview: 'Preview',
    customSoundRemove: 'Remove',
    customSoundTooLarge: 'This file is too large. Try a shorter clip (under about 2 MB).',
    customSoundImportError: 'Could not import this audio file.',
    customSoundRecordError: 'Recording failed. Check microphone permission and try again.',
    customSoundPlayError: 'Could not play this clip.',
    customSoundMicDeniedTitle: 'Microphone access',
    customSoundMicDeniedBody: 'Allow microphone access in system settings to record a custom sound.',
  },
  
  quickRecord: {
    pickComfortTitle: 'How did it feel?',
    pickComfortHint: 'Swipe left or right for all five levels.',
    confirmLog: 'Save record',
  },

  // 饮水相关
  water: {
    dailyIntake: 'Daily Water Intake',
    nudgeTitle: 'Hydration nudge',
    nudgeBody1: 'A little water now can feel great.',
    nudgeBody2: "It's been a while — hydrate when you can.",
    nudgeBody3: 'Small sips count. Want to log a glass?',
    nudgeBody4: 'Friendly reminder: time for some water 💧',
    quickLogTitle: 'Log water',
    quickLogSub: 'Tap an amount (ml)',
    nudgeToggle: 'Hydration reminders',
    nudgeHint: 'At most 3 gentle nudges per day, at least 3 hours apart. Never during quiet hours.',
    quietHours: 'Quiet hours (no nudges)',
    sleepStart: 'Start',
    sleepEnd: 'End',
  },
  
  // 数据可视化
  dataViz: {
    frequencyTitle: 'Last {{days}} Days Frequency',
    smoothnessTitle: 'Smoothness Trend',
    correlationTitle: 'Water & Bowel Movement Correlation',
    water: 'Water',
    bowelMovement: 'Bowel Movement',
  },
  
  // 成就系统
  achievements: {
    first: {
      title: 'First Timer',
      description: 'Complete your first record',
      emoji: '🎊'
    },
    week: {
      title: 'Week Warrior',
      description: 'Record for 7 consecutive days',
      emoji: '🏆'
    },
    month: {
      title: 'Monthly Master',
      description: 'Record 30 times total',
      emoji: '🌟'
    },
    hundred: {
      title: 'Poop Master',
      description: 'Record 100 times total',
      emoji: '👑'
    },
    unlocked: 'Achievement Unlocked!',
    continueButton: 'Keep Going! 💪',
    totalRecords: 'Total Records',
    weeklyAverage: 'Weekly Average',
    times: 'times'
  },
  
  // 激励消息
  motivational: {
    default: [
      { text: 'Health starts with recording!', emoji: '💪' },
      { text: 'Every record is amazing!', emoji: '✨' }
    ],
    weekly: [
      { text: 'Regular recording, healthy life!', emoji: '📊' }
    ],
    firstRecord: 'Congratulations on your first record! This is a great start!',
    weekRecord: 'Amazing! You\'ve been recording for a week!',
    monthRecord: 'Wow! You\'re already a poop recording master!',
    recordCount: 'You\'ve recorded {{count}} times, that\'s incredible!',
    totalRecords: 'Total Records'
  },

  // 健康管理
  healthManager: {
    cooldown: {
      title: 'Wait a moment! 🚫',
      message: 'For data accuracy, please wait at least 5 hours between records.\nStill need to wait {{hours}} hours {{minutes}} minutes',
      iKnow: 'I know',
      forceRecord: 'Force Record'
    },
    constipation: {
      title: 'Constipation Warning! 😰',
      message: 'No bowel movement for {{days}} days!\nRecommend drinking more water, increasing fiber intake, and consulting a doctor if necessary.',
      recordNow: 'Record Now'
    },
    reminder: {
      title: 'Friendly Reminder 💧',
      message: 'No record for {{days}} days\nRemember to drink more water and exercise appropriately~'
    },
    start: {
      title: 'Start Your Health Journey! 🌟',
      message: 'Record your first bowel movement and start paying attention to intestinal health!'
    },
    improvement: {
      title: 'Improvement Suggestions 🌱',
      message: 'Recent smoothness is not ideal, suggestions:\n• Eat more fiber-rich foods\n• Increase water intake\n• Exercise appropriately'
    },
    excellent: {
      title: 'Excellent! 🎉',
      message: 'Recent intestinal health is very good!\nKeep maintaining healthy lifestyle habits~'
    },
    motivational: {
      messages: [
        'Every record is care for health 💖',
        'Keep recording, discover body patterns 📊',
        'Healthy life starts with small records 🌟',
        'You are becoming your own health manager 👨‍⚕️',
        'Regular recording, better quality of life ✨'
      ],
      firstRecord: 'Congratulations on your first record! 🎊',
      weekRecord: 'Great job sticking to it for a week! 🏆',
      monthRecord: 'A month of persistence, amazing! 🌟',
      milestone: 'Already recorded {{count}} times, keep going! 💪'
    },
    healthScore: {
      startRecording: 'Start Recording',
      needsImprovement: 'Needs Improvement',
      good: 'Good Health',
      excellent: 'Excellent Health',
      calculationError: 'Calculation Error'
    }
  },
  
  // 月份
  months: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  
  // 星期
  weekDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
};

// 中文翻译
const zh = {
  // 通用
  common: {
    save: '保存',
    cancel: '取消',
    close: '关闭',
    delete: '删除',
    edit: '编辑',
    confirm: '确认',
    loading: '加载中...',
    success: '成功！',
    error: '错误',
    warning: '警告',
    later: '稍后再说',
  },
  
  // 主页
  home: {
    title: '律动',
    subtitle: '记录身体自然律动',
    quickRecord: '快速记录',
    editRecord: '编辑记录',
    healthReport: '健康报告',
    todayStats: '今日统计',
    todayRecords: '今日记录',
    totalRecords: '总记录',
    records: '条记录',
    healthScore: '健康评分',
    cooldownMessage: '{{time}}后可以再次记录',
    cooldownDisabled: '记录已禁用',
    motivationalMessage: '继续保持好习惯！🌟',
    detailedHealthAnalysis: '查看详细健康分析报告',
    // 幽默消息
    humorousMessages: [
      '休息一下，让肠道放松 🛌',
      '5小时后回来，给身体一些时间 ⏰',
      '刚记录完，放松一下 😌',
      '休息是为了更好的便便 💪'
    ],
    // 按钮文本
    buttonSubText: '点击记录便便',
    cooldownSubText: '{{time}}分钟后可用',
    // 报告相关
    noDataForReport: '没有可用数据，无法生成报告',
    generateReportError: '生成报告失败，请稍后重试',
    generateReportFailed: '生成报告失败',
    lastPoop: '上次排便',
    emptyGuideTitle: '按自己的节奏开始',
    emptyGuideSubtitle: '还没有记录——这很正常。',
    emptyGuideBullets: [
      '数据仅保存在本机，除非你导出或主动分享。',
      '随时用快速记录或详细表单添加条目。',
      '本应用用于自我观察，不能替代诊疗。',
    ],
    emptyGuideCta: '准备好后，点击「快速记录」即可。',
    recordIntervalTitle: '最近已记过一次',
    recordIntervalMessage:
      '每 3 小时只能新增 1 条记录，约 {{minutes}} 分钟后可再记。（可在历史里编辑最新一条。）',
  },
  
  // 历史记录
  history: {
    title: '历史记录 📊',
    week: '本周',
    month: '本月',
    year: '年度',
    searchPlaceholder: '搜索记录...',
    noRecords: '没有找到记录',
    noRecordsSubtitle: '开始追踪身体律动，查看健康洞察',
    noRecordsInMonth: '本月暂无记录',
    noRecordsInMonthSubtitle: '可以切换月份查看其他时间的记录',
    backToCurrent: '回到当前月',
    weekTitle: '本周记录 📅',
    monthTitle: '日历视图',
    yearTitle: '年度统计',
    // 周/月名称
    weekDays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    recordDetails: '记录详情 📝',
    time: '时间',
    feeling: '感觉',
    notes: '备注',
    none: '无',
    deleteConfirm: '确定要删除这条记录吗？',
    deleteSuccess: '记录删除成功！✨',
    deleteError: '删除记录失败 😥',
    // 删除相关
    deleteTitle: '确认删除 🗑️',
    deleteMessage: '确定要删除这条记录吗？此操作无法撤销！',
    deleteButton: '删除',
    deleteFailed: '删除失败',
    recordNotFound: '记录未找到',
    deleteSuccessMessage: '记录已安全删除！✨',
    deleteErrorMessage: '删除失败 😥',
    // 记录相关
    recordSuccess: '记录已保存！🎉',
    updateSuccess: '更新成功！✨',
    updateMessage: '记录已更新！',
    // 统计相关
    times: '次',
    recordCount: '{{count}} 条记录',
    dayRecordsTitle: '{{day}} 条记录',
    emptyGuidedTitle: '还没有记录',
    emptyGuidedSubtitle:
      '在首页添加一条记录。数据仅保存在本机，除非你导出或主动分享。',
  },
  
  // 记录模态框
  recordModal: {
    newTitle: '记录律动 🌿',
    editTitle: '编辑记录 ✏️',
    timeInfo: '当前时间: {{date}} {{time}}',
    feelingQuestion: '感觉如何？🤔',
    notesLabel: '备注 (可选) 💭',
    notesPlaceholder: '记录一下今天的感受...',
    saveButton: '保存记录',
    updateButton: '更新记录',
    saveSuccess: '记录保存成功！✨',
    updateSuccess: '记录更新成功！✨',
    saveError: '保存记录失败 😥',
  },
  
  // 健康报告
  health: {
    healthReport: '健康报告',
    weeklyReport: '周报告',
    monthlyReport: '月报告',
    weeklyReportSubtitle: '查看本周的健康分析',
    monthlyReportSubtitle: '查看本月的健康分析',
    overview: '概览',
    totalRecords: '总记录数',
    averageFrequency: '平均频率',
    consistency: '一致性',
    smoothness: '顺畅度',
    healthScore: '健康评分',
    recommendations: '建议',
    trends: '趋势',
    excellent: '优秀',
    good: '良好',
    fair: '一般',
    poor: '较差',
    veryPoor: '很差',
  },

  healthReport: {
    periodRange: '{{start}} 至 {{end}}',
    scoreTitle: '健康评分',
    scoreOutOf: '/ 100',
    scoreBandExcellent: '优秀',
    scoreBandGood: '良好',
    scoreBandFair: '一般',
    scoreBandPoor: '需要改善',
    overviewTitle: '📊 基础统计',
    statAvgPerDay: '日均次数',
    statAvgSmooth: '平均顺畅度',
    statAvgGap: '平均间隔（天）',
    ratingTitle: '🏆 健康评级',
    labelConsistency: '规律性',
    labelSmoothness: '顺畅度',
    labelOverall: '整体健康',
    distributionTitle: '📈 顺畅度分布',
    recommendationsTitle: '💡 健康建议',
    trendsTitle: '📊 趋势分析',
    timePatternTitle: '⏰ 时间模式',
    reportTitle: '📋 健康报告',
    closeReport: '关闭报告',
    distCount: '{{count}}次 ({{pct}}%)',
    hourCount: '{{count}}次',
    emptyStart: '建议开始记录，以便更好地了解自身节律。',
    noTrendData: '暂无数据',
    trendFreqUp: '📈 最近排便频率有所上升',
    trendFreqDown: '📉 最近排便频率有所下降',
    trendFreqStable: '📊 排便频率保持稳定',
    trendSmoothUp: '😊 排便顺畅度有所改善',
    trendSmoothDown: '😔 排便顺畅度有所下降',
    trendSmoothStable: '😐 排便顺畅度保持稳定',
    trendDataShort: '数据不足，无法分析趋势',
    rec_cp1: '💧 建议均衡补水，少量多次更稳。',
    rec_cp2: '🥗 适当增加蔬菜、水果与全谷物摄入。',
    rec_cp3: '🚶 保持适度活动，有助于肠道蠕动。',
    rec_cf1: '⏰ 尝试建立相对固定的如厕时间。',
    rec_cf2: '🍎 在合适范围内增加一点膳食纤维。',
    rec_sp1: '🚰 注意饮水，让身体保持足够水分。',
    rec_sp2: '🥬 可增加绿叶菜与全谷物比例。',
    rec_sp3: '🧘 压力会影响消化，适当放松有帮助。',
    rec_sf1: '🥤 可尝试温热饮品，少量多次。',
    rec_sf2: '🌾 可选用全麦等粗粮替代部分精制主食。',
    rec_fl1: '📅 若长期偏少，可记录并咨询专业人士。',
    rec_fl2: '🌅 早晨留出放松时间，有助于形成节律。',
    rec_fh1: '⚠️ 若频率异常偏高，建议咨询医生。',
    rec_gap1: '🚨 连续多日未有排便，建议及时就医评估。',
    rec_pos1: '🎉 整体节律不错——继续保持适合你的习惯。',
  },
  
  // 顺畅度级别
  smoothLevel: {
    veryDifficult: '非常困难',
    difficult: '困难',
    normal: '正常',
    smooth: '顺畅',
    verySmooth: '非常顺畅',
  },
  
  diet: {
    highFiber: '高纤维',
    lowFiber: '低纤维',
    oily: '油腻',
    spicy: '辛辣',
    dairy: '乳制品',
    caffeine: '咖啡因',
    alcohol: '酒精',
  },

  legal: {
    privacyTitle: '隐私说明（本地优先）',
    privacyBody:
      'Flow 使用本机存储保存你的记录，不向 Flow 服务器上传数据。除非你自己导出或生成分享图，数据不会离开设备。清除应用数据或卸载应用可能导致本地记录丢失，请使用导出功能备份。若开启系统备份，数据可能被包含在设备备份中。',
    disclaimerTitle: '健康免责声明',
    disclaimerBody:
      'Flow 是用于自我觉察的记录工具，不是医疗器械，不能用于诊断、治疗或预防任何疾病。统计、摘要与分享卡片仅供参考。如有症状或健康问题，请咨询专业医疗人员。',
  },

  onboarding: {
    pageTitle: '欢迎使用 Flow',
    privacyHeading: '数据保存在本机',
    privacyText:
      '记录只保存在当前设备，不会上传到 Flow 服务器。导出与分享由你主动操作。',
    whyHeading: '为什么简单记录？',
    whyText:
      '长期观察有助于了解饮水、饮食与身体感受之间的关系，无需评判自己。按你舒适的方式使用即可。',
    disclaimerHeading: '非医疗建议',
    disclaimerText:
      'Flow 不能替代医生诊疗。重要健康决策请咨询专业人士。完整声明可在设置中随时查看。',
    continue: '开始使用',
  },

  share: {
    cardBrand: 'FLOW',
    cardHeadline: '7 天回顾',
    cardRange: '{{start}} – {{end}}',
    cardTotal: '近 7 天条数：',
    cardAvgComfort: '平均舒适度',
    cardAvgComfortLine: '{{label}}：{{value}}',
    cardTrend: '趋势',
    cardTagsTitle: '饮食/习惯标签（若已记录）',
    cardNoTags: '该时间段无饮食标签',
    cardDisclaimer:
      '仅供个人使用，不能作为医疗建议。Flow 不诊断或治疗任何疾病。',
    cardTagLine: '{{label}} · {{count}} 次',
    trend: {
      steady: '本周记录节奏相对平稳。',
      up: '在时间窗口的后半段记录更多。',
      down: '在时间窗口的前半段记录更多。',
    },
    modalTitle: '7 天摘要分享图',
    previewCaption: '预览 — 导出 PNG 清晰度取决于设备。',
    sharePng: '分享 PNG',
    sharing: '准备中…',
    notEnoughData: '近 7 天至少需要 1 条记录才能生成图片。',
    localNote: '图片由本机根据已保存记录生成。',
    homeCta: '分享 7 天摘要图',
    settingsCta: '生成并分享 7 天 PNG',
  },
  
  exercise: {
    none: '无',
    light: '轻度',
    moderate: '中度',
    intense: '强度',
  },
  
  reminder: {
    attention: '注意',
  },
  
  // 设置
  settings: {
    title: '设置',
    subtitle: '自定义你的体验',
    language: '语言',
    english: 'English',
    chinese: '中文',
    theme: '主题',
    light: '浅色',
    dark: '深色',
    about: '关于',
    version: '版本',
    clearData: '清除所有数据',
    clearDataConfirm: '确定要清除所有数据吗？此操作无法撤销。',
    languageChanged: '语言已切换为中文',
    clearDataSuccess: '所有数据清除成功！',
    clearDataError: '清除数据失败',
    changeLanguageError: '切换语言失败',
    dataManagement: '数据管理',
    followsSystem: '跟随系统设置',
    description: '轻松追踪身体律动，关爱健康',
    reminderSettings: '提醒设置',
    maxDaysWithoutPoop: '未排便天数提醒阈值',
    waterSettings: '饮水设置',
    dailyWaterGoal: '每日饮水目标（毫升）',
    settingsSaved: '设置保存成功',
    saveError: '保存设置失败',
    exportCSV: '导出 CSV',
    exportJSON: '导出 JSON',
    exportSuccess: '数据导出成功',
    exportError: '数据导出失败',
    delightSection: '声音与反馈',
    delightSound: '成功音效',
    delightHaptics: '触感反馈',
    delightMotion: '增强动效',
    delightTestSound: '试听成功音效',
    delightSoundOffHint: '请先开启「成功音效」后再试听。',
    celebrationToggle: '保存成功庆祝',
    celebrationSillyToggle: '搞怪模式（趣味文案 + 额外礼花）',
    celebrationPreview: '预览庆祝动效',
    celebrationOffHint: '请先开启「保存成功庆祝」后再预览。',
    celebration: {
      n1: '记下啦，做得很好。',
      n2: '真棒，又记了一笔。',
      n3: '温柔地收录成功。',
      n4: '节律又清晰了一点。',
      n5: '完成记录，赞。',
      s1: '任务完成！（厕所特供版）',
      s2: '又一个载入史册的…数据点。',
      s3: '您已达成「顺畅连击」。',
      s4: '科学界感谢这份样本。',
      s5: '传说级记录员就是您。',
    },
    legalSection: '隐私与免责声明',
    privacyPolicy: '隐私说明',
    medicalDisclaimer: '医疗免责声明',
    showWelcomeAgain: '再次显示欢迎页',
    guidanceSection: '引导',
    emptyGuidanceToggle: '首页与历史页空态提示',
    shareSection: '分享',
    share7DayToggle: '7 天摘要分享卡片',
    notificationPermissionNeeded: '需要在系统设置中允许通知，才能使用饮水提醒。',
    customSoundSection: '自定义成功音效',
    customSoundHint: '最多 3 段短音频（录音或从文件导入）。仅适用于手机端。单文件建议不超过约 2 MB。',
    customSoundUseCustom: '使用自定义音效',
    customSoundUseCustomSub: '开启且已保存音频时，快速记录成功后将播放你的音效，而不是默认提示音。',
    customSoundRandom: '随机播放',
    customSoundRandomSub: '当保存了多于一条音频时，每次随机播放其中一段。',
    customSoundRandomNeedTwo: '随机播放需至少保存两段音频。',
    customSoundSlot: '音频 {{n}}',
    customSoundImport: '导入',
    customSoundRecord: '录音',
    customSoundStop: '停止',
    customSoundPreview: '试听',
    customSoundRemove: '删除',
    customSoundTooLarge: '文件过大，请使用更短的音频（约 2 MB 以内）。',
    customSoundImportError: '无法导入该音频文件。',
    customSoundRecordError: '录音失败，请检查麦克风权限后重试。',
    customSoundPlayError: '无法播放该音频。',
    customSoundMicDeniedTitle: '需要麦克风权限',
    customSoundMicDeniedBody: '请在系统设置中允许使用麦克风，以便录制自定义音效。',
  },
  
  quickRecord: {
    pickComfortTitle: '这次感觉如何？',
    pickComfortHint: '左右滑动可查看全部五个等级。',
    confirmLog: '保存记录',
  },

  // 饮水相关
  water: {
    dailyIntake: '每日饮水量',
    nudgeTitle: '喝水小提醒',
    nudgeBody1: '有空的话，喝一小口水吧。',
    nudgeBody2: '有一阵子啦，记得温和补水～',
    nudgeBody3: '几口也算数，要记一笔吗？',
    nudgeBody4: '轻轻提醒：该喝点水啦 💧',
    quickLogTitle: '记录饮水',
    quickLogSub: '点选毫升数（快捷）',
    nudgeToggle: '饮水提醒（通知）',
    nudgeHint: '每天最多 3 次温和提醒，间隔至少约 3 小时；安静时段不打扰。',
    quietHours: '安静时段（不提醒）',
    sleepStart: '开始',
    sleepEnd: '结束',
  },
  
  // 数据可视化
  dataViz: {
    frequencyTitle: '近{{days}}天频率',
    smoothnessTitle: '顺畅度趋势',
    correlationTitle: '饮水与排便关联',
    water: '饮水',
    bowelMovement: '排便',
  },
  
  // 成就系统
  achievements: {
    first: {
      title: '初来乍到',
      description: '完成第一次记录',
      emoji: '🎊'
    },
    week: {
      title: '坚持一周',
      description: '连续记录7天',
      emoji: '🏆'
    },
    month: {
      title: '月度达人',
      description: '累计记录30次',
      emoji: '🌟'
    },
    hundred: {
      title: '便便大师',
      description: '累计记录100次',
      emoji: '👑'
    },
    unlocked: '解锁成就！',
    continueButton: '继续加油！💪',
    totalRecords: '总记录数',
    weeklyAverage: '平均每周',
    times: '次'
  },
  
  // 激励消息
  motivational: {
    default: [
      { text: '健康从记录开始！', emoji: '💪' },
      { text: '每一次记录都很棒！', emoji: '✨' }
    ],
    weekly: [
      { text: '规律记录，健康生活！', emoji: '📊' }
    ],
    firstRecord: '恭喜完成第一次记录！这是一个很好的开始！',
    weekRecord: '太棒了！坚持记录一周了！',
    monthRecord: '哇！你已经是便便记录达人了！',
    recordCount: '已经记录{{count}}次了，太厉害了！',
    totalRecords: '总记录数'
  },

  // 健康管理
  healthManager: {
    cooldown: {
      title: '慢着慢着! 🚫',
      message: '为了数据准确性，建议至少间隔5小时再记录哦～\n还需要等待 {{hours}}小时{{minutes}}分钟',
      iKnow: '我知道了',
      forceRecord: '强制记录'
    },
    constipation: {
      title: '便秘警告! 😰',
      message: '已经{{days}}天没有便便了！\n建议多喝水、增加纤维摄入，必要时咨询医生。',
      recordNow: '记录一次'
    },
    reminder: {
      title: '温馨提醒 💧',
      message: '已经{{days}}天没有记录了\n记得多喝水，适当运动哦～'
    },
    start: {
      title: '开始你的健康之旅! 🌟',
      message: '记录你的第一次便便，开始关注肠道健康吧！'
    },
    improvement: {
      title: '改善建议 🌱',
      message: '最近的顺畅度不太理想，建议：\n• 多吃富含纤维的食物\n• 增加水分摄入\n• 适当运动'
    },
    excellent: {
      title: '太棒了! 🎉',
      message: '最近的肠道健康状况很好！\n继续保持健康的生活习惯～'
    },
    motivational: {
      messages: [
        '每一次记录都是对健康的关爱 💖',
        '坚持记录，发现身体的规律 📊',
        '健康生活从点滴记录开始 🌟',
        '你正在成为自己的健康管家 👨‍⚕️',
        '规律记录，拥有更好的生活质量 ✨'
      ],
      firstRecord: '恭喜完成第一次记录! 🎊',
      weekRecord: '坚持一周了，真棒! 🏆',
      monthRecord: '一个月的坚持，太厉害了! 🌟',
      milestone: '已经记录{{count}}次了，继续加油! 💪'
    },
    healthScore: {
      startRecording: '开始记录',
      needsImprovement: '需要改善',
      good: '健康良好',
      excellent: '非常健康',
      calculationError: '计算错误'
    }
  },
  
  // 月份
  months: [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ],
  
  // 星期
  weekDays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
};

// 语言检测函数
const getLanguageFromStorage = async (): Promise<string> => {
  try {
    // 添加超时保护，避免在 Expo Go 中阻塞
    const language = await Promise.race([
      AsyncStorage.getItem('userLanguage'),
      new Promise<string>((resolve) => setTimeout(() => resolve('en'), 1000))
    ]);
    return language || 'en'; // 默认英语
  } catch (error) {
    console.error('Error getting language from storage:', error);
    return 'en';
  }
};

// 保存语言设置
const saveLanguageToStorage = async (language: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('userLanguage', language);
  } catch (error) {
    console.error('Error saving language to storage:', error);
  }
};

// 初始化i18n - 同步初始化，立即完成
// 先使用默认配置，然后异步加载用户设置
try {
  // Initialize synchronously - don't wait for async operations
  if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
      resources: {
        en: { translation: en },
        zh: { translation: zh },
      },
      lng: 'en', // 先使用默认语言
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
  }

  // 异步加载用户语言设置（不阻塞应用启动）
  setTimeout(() => {
    getLanguageFromStorage()
      .then(language => {
        if (language && language !== i18n.language) {
          i18n.changeLanguage(language).catch(() => {
            // Silent fail - app can continue
          });
        }
      })
      .catch(() => {
        // Silent fail - app can continue
      });
  }, 1000);
} catch (error) {
  console.error('i18n setup error:', error);
  // Even if init fails, ensure i18n has basic config
  if (!i18n.isInitialized) {
    i18n.init({
      resources: { en: { translation: en }, zh: { translation: zh } },
      lng: 'en',
      fallbackLng: 'en',
    });
  }
}

// 切换语言函数
export const changeLanguage = async (language: string) => {
  try {
    await i18n.changeLanguage(language);
    await saveLanguageToStorage(language);
  } catch (error) {
    console.error('Error changing language:', error);
  }
};

// 获取当前语言
export const getCurrentLanguage = (): string => {
  return i18n.language || 'en';
};

export default i18n; 