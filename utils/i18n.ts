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
    warning: 'Worth noticing',
    later: 'Later',
    ok: 'OK',
  },
  
  // 主页
  home: {
    title: 'Flow',
    subtitle: 'Track your body flow',
    quickRecord: 'Track Flow',
    editRecord: 'Edit Flow',
    healthReport: 'Pattern Summary',
    todayStats: 'Today\'s snapshot',
    todayRecords: 'Today\'s Records',
    totalRecords: 'Total Records',
    records: 'records',
    healthScore: 'Pattern Score',
    cooldownMessage: 'You can record again in {{time}}',
    cooldownDisabled: 'Record disabled',
    motivationalMessage: 'Keep up the good work! 🌟',
    detailedHealthAnalysis: 'View personal pattern insights',
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
    noDataForReport: 'Add a few saved entries before opening a summary',
    generateReportError: 'Could not open the summary. Please try again later.',
    generateReportFailed: 'Could not open the summary',
    lastPoop: 'Last bowel movement',
    emptyGuideTitle: 'Start with one simple entry',
    emptyGuideSubtitle: 'No entries yet. Add one when it feels useful.',
    emptyGuideBullets: [
      'Everything stays on this device until you export or share.',
      'Use quick log for a fast entry, or add details when you want more context.',
      'This app is for awareness, not diagnosis.',
    ],
    emptyGuideCta: 'Tap Track Flow to save your first entry.',
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
    noRecordsSubtitle: 'Save a few entries to make your personal patterns easier to see.',
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
    dayRecords: '{{day}} records',
    dayRecordsTitle: '{{day}} Records',
    emptyGuidedTitle: 'Your log is empty',
    emptyGuidedSubtitle:
      'Add your first entry from Home. Everything stays on this device until you export or share.',
    noRecordsInMonth: 'No records this month',
    noRecordsInMonthSubtitle: 'Switch months or add a new entry from Home.',
    backToCurrent: 'Back to current month',
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
    healthReport: 'Pattern Insights',
    weeklyReport: 'Weekly Summary',
    monthlyReport: 'Monthly Summary',
    weeklyReportSubtitle: 'Based on your saved entries this week',
    monthlyReportSubtitle: 'Based on your saved entries this month',
    overview: 'Overview',
    totalRecords: 'Total Records',
    averageFrequency: 'Average Frequency',
    consistency: 'Consistency',
    smoothness: 'Smoothness',
    healthScore: 'Pattern Score',
    recommendations: 'Tips',
    trends: 'Trends',
    excellent: 'More regular',
    good: 'Mostly regular',
    fair: 'Some variation',
    poor: 'Less regular',
    veryPoor: 'Not enough data',
  },

  /** Full localized copy for generated analytics report (UI + service strings) */
  healthReport: {
    periodRange: '{{start}} – {{end}}',
    scoreTitle: 'Pattern score',
    scoreOutOf: '/ 100',
    scoreBandExcellent: 'More regular',
    scoreBandGood: 'Mostly regular',
    scoreBandFair: 'Some variation',
    scoreBandPoor: 'Less regular',
    overviewTitle: '📊 Summary',
    statAvgPerDay: 'Avg per day',
    statAvgSmooth: 'Avg comfort',
    statAvgGap: 'Avg gap (days)',
    ratingTitle: '🏆 Pattern signals',
    labelConsistency: 'Regularity',
    labelSmoothness: 'Comfort',
    labelOverall: 'Overall pattern',
    distributionTitle: '📈 Comfort distribution',
    recommendationsTitle: '💡 Tips',
    trendsTitle: '📊 Trends',
    timePatternTitle: '⏰ Time pattern',
    reportTitle: '📋 Pattern summary',
    basisNote: 'Based only on your saved entries.',
    reflectionNote: 'For personal reflection, not diagnosis.',
    closeReport: 'Close summary',
    regularityBandExcellent: 'More regular',
    regularityBandGood: 'Mostly regular',
    regularityBandFair: 'Some variation',
    regularityBandPoor: 'Less regular',
    comfortBandExcellent: 'More comfortable',
    comfortBandGood: 'Mostly comfortable',
    comfortBandFair: 'Mixed comfort',
    comfortBandPoor: 'Less comfortable',
    patternBandExcellent: 'Balanced pattern',
    patternBandGood: 'Mostly steady',
    patternBandFair: 'Variable pattern',
    patternBandPoor: 'Needs more context',
    distCount: '{{count}}× ({{pct}}%)',
    hourCount: '{{count}}×',
    emptyStart: 'Consider tracking for a few more days to make this summary more useful.',
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
    rec_fl1: '📅 If entries are rare for you, note timing, fluids, meals, and routine.',
    rec_fl2: '🌅 A relaxed morning routine can help regularity.',
    rec_fh1: '⚠️ If frequency feels unusually different for you, consider speaking with a healthcare professional.',
    rec_gap1: '🚨 If several days pass and you feel concerned, consider speaking with a healthcare professional.',
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
    trustDataSection: 'Trust & Data',
    loggingSection: 'Logging',
    remindersSection: 'Reminders',
    feedbackSection: 'Feedback & Delight',
    trustDataFooter: 'Your records stay on this device unless you export or share them yourself.',
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
    delightSection: 'Feedback & Delight',
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

  /** Relative time labels for last-activity UI (service + screens use i18n, not hardcoded copy). */
  time: {
    noRecords: 'No records yet',
    dayAgo: '1 day ago',
    daysAgo: '{{count}} days ago',
    hourAgo: '1 hour ago',
    hoursAgo: '{{count}} hours ago',
    minuteAgo: '1 minute ago',
    minutesAgo: '{{count}} minutes ago',
    justNow: 'Just now',
  },

  /** Home reminder banner copy (avoid hardcoded strings in ReminderService). */
  reminder: {
    attention: 'Worth noticing',
    poopStreakMessage:
      "No entry for {{days}} days. Check your recent pattern, and consider tracking for a few more days.",
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
      { text: 'Patterns start with small notes.', emoji: '💪' },
      { text: 'Every record is amazing!', emoji: '✨' }
    ],
    weekly: [
      { text: 'Regular notes make patterns easier to see.', emoji: '📊' }
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
      title: 'Pattern check-in',
      message: 'No entry for {{days}} days. Notice your fluids, meals, and routine; consider qualified health advice if you feel concerned.',
      recordNow: 'Record Now'
    },
    reminder: {
      title: 'Friendly Reminder 💧',
      message: 'No record for {{days}} days\nRemember to drink more water and exercise appropriately~'
    },
    start: {
      title: 'Start noticing your pattern',
      message: 'Record your first entry and begin learning your own rhythm.'
    },
    improvement: {
      title: 'Pattern notes',
      message: 'Recent comfort has been lower. You may want to notice fluids, meals, movement, and routine.'
    },
    excellent: {
      title: 'Pattern looking steady',
      message: 'Recent entries look comfortable and regular. Keep noticing what works for you.'
    },
    motivational: {
      messages: [
        'Every entry helps you notice your pattern 💖',
        'Keep recording, discover body patterns 📊',
        'Small records can reveal useful patterns 🌟',
        'You are learning your own rhythm',
        'Regular recording, better quality of life ✨'
      ],
      firstRecord: 'Congratulations on your first record! 🎊',
      weekRecord: 'Great job sticking to it for a week! 🏆',
      monthRecord: 'A month of persistence, amazing! 🌟',
      milestone: 'Already recorded {{count}} times, keep going! 💪'
    },
    healthScore: {
      startRecording: 'Start Recording',
      needsImprovement: 'Needs more context',
      good: 'Mostly steady',
      excellent: 'More regular',
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
    warning: '值得留意',
    later: '稍后再说',
    ok: '确定',
  },
  
  // 主页
  home: {
    title: '律动',
    subtitle: '记录身体自然律动',
    quickRecord: '快速记录',
    editRecord: '编辑记录',
    healthReport: '模式总结',
    todayStats: '今日概览',
    todayRecords: '今日记录',
    totalRecords: '总记录',
    records: '条记录',
    healthScore: '模式分数',
    cooldownMessage: '{{time}}后可以再次记录',
    cooldownDisabled: '记录已禁用',
    motivationalMessage: '继续保持好习惯！🌟',
    detailedHealthAnalysis: '查看个人模式洞察',
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
    noDataForReport: '多保存几条记录后再查看总结',
    generateReportError: '暂时无法打开总结，请稍后再试',
    generateReportFailed: '暂时无法打开总结',
    lastPoop: '上次排便',
    emptyGuideTitle: '从一条简单记录开始',
    emptyGuideSubtitle: '还没有记录。觉得有用时再添加即可。',
    emptyGuideBullets: [
      '数据仅保存在本机，除非你导出或主动分享。',
      '随时用快速记录或详细表单添加条目。',
      '本应用用于自我观察，不能替代诊疗。',
    ],
    emptyGuideCta: '点击「快速记录」保存第一条记录。',
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
    noRecordsSubtitle: '保存几条记录后，个人模式会更容易看见。',
    noRecordsInMonth: '本月暂无记录',
    noRecordsInMonthSubtitle: '可以切换月份，或从首页添加新记录。',
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
    dayRecords: '{{day}} 条记录',
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
    healthReport: '模式洞察',
    weeklyReport: '周总结',
    monthlyReport: '月总结',
    weeklyReportSubtitle: '基于本周已保存的记录',
    monthlyReportSubtitle: '基于本月已保存的记录',
    overview: '概览',
    totalRecords: '总记录数',
    averageFrequency: '平均频率',
    consistency: '一致性',
    smoothness: '顺畅度',
    healthScore: '模式分数',
    recommendations: '提示',
    trends: '趋势',
    excellent: '更规律',
    good: '基本规律',
    fair: '有些波动',
    poor: '不太规律',
    veryPoor: '数据不足',
  },

  healthReport: {
    periodRange: '{{start}} 至 {{end}}',
    scoreTitle: '模式分数',
    scoreOutOf: '/ 100',
    scoreBandExcellent: '更规律',
    scoreBandGood: '基本规律',
    scoreBandFair: '有些波动',
    scoreBandPoor: '不太规律',
    overviewTitle: '📊 基础统计',
    statAvgPerDay: '日均次数',
    statAvgSmooth: '平均顺畅度',
    statAvgGap: '平均间隔（天）',
    ratingTitle: '🏆 模式信号',
    labelConsistency: '规律性',
    labelSmoothness: '顺畅度',
    labelOverall: '整体模式',
    distributionTitle: '📈 顺畅度分布',
    recommendationsTitle: '💡 小提示',
    trendsTitle: '📊 趋势分析',
    timePatternTitle: '⏰ 时间模式',
    reportTitle: '📋 模式总结',
    basisNote: '仅基于你已保存的记录。',
    reflectionNote: '用于个人回顾，不用于诊断。',
    closeReport: '关闭总结',
    regularityBandExcellent: '更规律',
    regularityBandGood: '基本规律',
    regularityBandFair: '有些波动',
    regularityBandPoor: '不太规律',
    comfortBandExcellent: '更舒适',
    comfortBandGood: '基本舒适',
    comfortBandFair: '舒适度有波动',
    comfortBandPoor: '不太舒适',
    patternBandExcellent: '模式较平衡',
    patternBandGood: '整体较稳定',
    patternBandFair: '模式有波动',
    patternBandPoor: '需要更多记录',
    distCount: '{{count}}次 ({{pct}}%)',
    hourCount: '{{count}}次',
    emptyStart: '可以再连续记录几天，让总结更有参考价值。',
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
    rec_fh1: '⚠️ 若频率和你平时明显不同，可以考虑咨询专业人士。',
    rec_gap1: '🚨 连续多日没有记录到排便，若你感到担心，可以寻求专业意见。',
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
    attention: '值得留意',
    poopStreakMessage: '已经 {{days}} 天没有新增记录。可以查看最近的模式，也可以再连续记录几天。',
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
    trustDataSection: '信任与数据',
    loggingSection: '记录',
    remindersSection: '提醒',
    feedbackSection: '反馈与愉悦感',
    trustDataFooter: '记录保存在本机，除非你主动导出或分享。',
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
    delightSection: '反馈与愉悦感',
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

  time: {
    noRecords: '暂无记录',
    dayAgo: '1 天前',
    daysAgo: '{{count}} 天前',
    hourAgo: '1 小时前',
    hoursAgo: '{{count}} 小时前',
    minuteAgo: '1 分钟前',
    minutesAgo: '{{count}} 分钟前',
    justNow: '刚刚',
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
      { text: '模式从小记录开始。', emoji: '💪' },
      { text: '每一次记录都很棒！', emoji: '✨' }
    ],
    weekly: [
      { text: '规律记录，让模式更容易看见。', emoji: '📊' }
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
      title: '模式提醒',
      message: '已经 {{days}} 天没有新增记录。可以留意饮水、饮食和日常节律；如果你感到担心，可以咨询专业人士。',
      recordNow: '记录一次'
    },
    reminder: {
      title: '温馨提醒 💧',
      message: '已经{{days}}天没有记录了\n记得多喝水，适当运动哦～'
    },
    start: {
      title: '开始观察自己的模式',
      message: '记录第一条，慢慢了解自己的身体节律。'
    },
    improvement: {
      title: '模式笔记',
      message: '最近的舒适度偏低。可以留意饮水、饮食、活动和日常节律。'
    },
    excellent: {
      title: '太棒了! 🎉',
      message: '最近的记录看起来较舒适、较规律。继续留意适合自己的节律。'
    },
    motivational: {
      messages: [
        '每一次记录都能帮助你看见模式 💖',
        '坚持记录，发现身体的规律 📊',
        '小记录也能慢慢形成有用的线索 🌟',
        '你正在了解自己的身体节律',
        '规律记录，拥有更好的生活质量 ✨'
      ],
      firstRecord: '恭喜完成第一次记录! 🎊',
      weekRecord: '坚持一周了，真棒! 🏆',
      monthRecord: '一个月的坚持，太厉害了! 🌟',
      milestone: '已经记录{{count}}次了，继续加油! 💪'
    },
    healthScore: {
      startRecording: '开始记录',
      needsImprovement: '需要更多记录',
      good: '整体较稳定',
      excellent: '更规律',
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
      returnEmptyString: true,
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
      returnEmptyString: true,
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
