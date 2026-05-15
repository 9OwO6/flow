# Flow / La-le-mo Portfolio Case Study

## Project Summary

Flow / La-le-mo is a local-first mobile app for tracking bowel habits, hydration, and wellness notes. It focuses on calm daily logging, personal pattern reflection, and privacy-sensitive data controls without presenting itself as a medical or diagnostic tool.

## Problem

Sensitive wellness patterns are easy to forget and often too private for cloud-first tracking products. The challenge was to design a tracker that feels useful enough for daily use while staying careful about trust, privacy, and non-medical language.

## Target Users

- People who want a private, lightweight log of bowel habits and hydration.
- People who want to notice timing, comfort, routine, and hydration patterns.
- People who may want exportable records for personal reflection or a conversation with a professional.

## Product Decisions

- Prioritized quick logging as the main daily loop.
- Used Pattern Summary and Pattern Insights language instead of diagnostic scoring language.
- Kept summaries framed as “based only on saved entries.”
- Added History views for weekly, monthly, and yearly review.
- Grouped Settings around Trust & Data, Logging, Reminders, Feedback & Delight, and About.

## Privacy-First Design Choices

- Local-first storage with no account requirement.
- Explicit CSV / JSON export.
- Clear local data control in Settings.
- Privacy and non-medical disclaimer screens.
- No claims of diagnosis, treatment, clinical accuracy, or medical certainty.

## UX Improvements From Prototype To V2

- Reduced Home screen feature clutter and emphasized the daily logging loop.
- Replaced alarmist wording with calm pattern-tracking language.
- Removed hidden destructive History actions and added explicit delete confirmation.
- Added cautious report empty states so summaries do not imply certainty without data.
- Improved Settings information architecture so privacy, export, delete, and disclaimers are easier to find.

## Technical Highlights

- Built with Expo, React Native, TypeScript, and Expo Router.
- Uses AsyncStorage for local-first records and preferences.
- Supports bilingual UI resources through i18next.
- Includes export and sharing flows through Expo File System and Sharing.
- Uses reusable design-system components and design tokens for mobile UI consistency.

## QA / Stability Improvements

- TypeScript checks are the primary automated safety check.
- QA focus areas include Home logging, History record details, delete confirmation, report empty states, export, clear data, privacy modal, and language switching.
- Product copy was reviewed for non-diagnostic wording and privacy-sensitive framing.

## Limitations

- No cloud sync or backup restore flow.
- Local data may be lost if the app is deleted without export.
- Runtime QA still needs repeated testing on real iOS and Android devices.
- Charts and accessibility can be improved further.
- The app is a portfolio project, not a clinically validated product.

## Future Improvements

- Encrypted local storage.
- Backup and restore support.
- Stronger chart visualizations.
- More accessibility and contrast testing.
- Smoother onboarding.
- iOS TestFlight build.
- More manual QA across real devices.

## Interview Talking Points

- How I reframed sensitive wellness copy from diagnostic language to personal pattern reflection.
- How I balanced feature richness with a calmer daily-use Home screen.
- How local-first data choices support trust for sensitive records.
- How I used TypeScript and manual QA checklists to stabilize a mobile app.
- How product critique informed concrete V1 and V2 polish passes.
