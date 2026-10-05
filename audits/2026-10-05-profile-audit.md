# Profile audit - 2026-10-05

Tool: Codex / FigCli Yolo. Status: Ready for review, with two decisions below.
File: Native One File Pilot Design System (`a2EAdCeKeaXN679TMNlIev`).
Scope: Avatar, Profile Header, Pattern/Profile Screen and eight Profile previews. This is an in-library demonstration pattern, not a separate Design file.

| Check | Result |
|---|---|
| Preview combinations | 8: iOS/Android x Light/Dark x EN/AR |
| Screen size | 375 x 812 for all 8 |
| check_screens placeholders / repeated content / overflow / squashed / bars / unbound screen paints and spacing | 0 / 0 / 0 / 0 / 0 / 0 |
| New component raw fills, strokes, positive spacing and radii | 0 |
| Text without a shared text style in new components | 0 |
| New public text properties without layer references | 0 |
| Missing main components across the Profile previews | 0 |
| Raw fill overrides across the Profile previews | 0 |
| Visible text contrast | 140 checked, 0 failures; threshold 4.5:1 used conservatively for text below 24px |
| New variables or styles | 0 |
| New public platform/theme/direction variants | 0 |
| Existing components/pages removed or rebuilt | 0 |
| Existing Settings sections edited | 0 |
| Profile direct primitive dimension bindings | 2: Avatar width and height -> Number/64; see decision 1 |
| Android buttons below 48px with no documented expanded hit area | 8 rendered buttons across 4 previews; see decision 2 |

## Decisions still needed

1. Avatar size currently uses the existing `Primitives::Number/64` for width and height. Propose `OS::Components/Avatar/Size` (iOS/Android -> Number/64) and `Component Specific::Avatar/Size` (alias OS), then rebind both dimensions. No new token was added without approval.
2. The existing Button is 50px tall on iOS and 40px on Android. Android list rows are 56px; iOS rows are at least 45px. For the Profile buttons, propose a native touch-target height token (iOS 50, Android 48) and an expanded hit-area wrapper that preserves the Android 40px visible pill. Shared Button values were left unchanged. Eight buttons in the four Android previews need that treatment.

## Visual verification

Reviewed all eight previews in `2026-10-05-profile-modes-final.png`: correct native bar anatomy, Light/Dark colors, directional back and chevron icons, Arabic row order, right-aligned Arabic section headings, exact supplied demo copy, visible Sign out action and no clipped screen content. The Arabic iOS email title wraps to two lines and the row grows accordingly. Email and phone display LTR.

No external screenshot was supplied; this is an original design against the approved spec. Source side-by-side comparison is therefore not applicable.

Profile component demos were also added to `➜ Platform Preview` (eight Profile Header instances, each containing an Avatar). Component pages contain their main components only.

## Implementation notes

- Existing DS color, spacing, radius, typography, icons and components are reused.
- New Avatar and Profile Header have purpose, usage and accessibility descriptions.
- Profile Header exposes Display name, Email, nested Avatar Initials and Button Label. Profile pattern exposes section titles and nested content instances.
- Text translations are instance overrides; Language mode supplies fonts and direction. Changing only the Language mode does not translate English copy automatically.
- Top App Bar stays full width outside the scrolling content frame.
- Profile initials and Profile Back Label use existing Label/Primary to avoid contrast failures, without changing the shared Top App Bar.
- These are editable design references; click destinations and app functionality are not implemented.
- Foundation_Skill remains a pre-existing empty stub, and data/rules.json is absent. This scoped report uses the platform and Mobile Adaptive rules, not fabricated project thresholds.
- Library publish and Storybook sync remain pending. No linked Design files are registered.

This report does not approve the screen or certify the whole library.
