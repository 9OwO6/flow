# AGENTS.md

## Project Overview

Flow / La-le-mo is a local-first personal pattern tracker for bowel habits, hydration, and wellness notes. The product should feel calm, private, daily-use friendly, and non-diagnostic. It is a portfolio project, so changes should preserve product polish, trust language, and mobile UX quality.

## Tech Stack

- Expo SDK 54
- React Native 0.81
- React 19
- TypeScript
- Expo Router
- React Native Paper
- i18next / react-i18next
- AsyncStorage
- Expo Notifications
- Expo File System / Sharing

## Safe Commands

Use these commands when appropriate:

```powershell
npm.cmd exec tsc -- --noEmit
npm.cmd run lint
npm.cmd test
```

Recommended check command:

```powershell
npm.cmd exec tsc -- --noEmit
```

Do not start a long-running dev server unless explicitly requested.

## Product Rules

- Keep language non-diagnostic.
- Position the app as a local-first personal pattern tracker.
- Do not claim medical diagnosis, treatment, prevention, or clinical certainty.
- Prefer “Pattern Summary,” “Pattern Insights,” “personal reflection,” and “based only on saved entries.”
- Avoid “Health Score,” “Health Report,” “Excellent/Poor health,” and alarmist warning language.
- Do not change data models or storage format without explicit approval.
- Do not install dependencies without explicit approval.
- Do not modify navigation structure unless explicitly requested.
- Do not claim App Store release, production users, or clinical validation.

## Code Style Notes

- Prefer existing components, design tokens, and local patterns.
- Keep changes small and scoped to the requested task.
- Use TypeScript types deliberately; avoid broad `any` unless matching existing code.
- Keep UI copy concise, calm, and privacy-sensitive.
- Preserve bilingual support when changing user-facing strings.
- Do not refactor unrelated code during product polish or documentation passes.

## Testing / QA Expectations

- Run `npm.cmd exec tsc -- --noEmit` after code changes unless the user asks not to.
- For UI changes, check Home, History, Pattern Summary, and Settings flows manually when a simulator/device is available.
- For privacy-sensitive flows, verify export, clear data confirmation, privacy modal, and disclaimer modal.
- If runtime verification is not possible, report that clearly and provide a manual QA checklist.

## Git Workflow Reminder

Codex may modify files, but the human should run `git add`, `git commit`, and `git push` manually if `.git` permission issues occur. If a rebase is active, resolve conflicts in the requested files only, then let the human continue if Git cannot write `.git/index.lock`.
