# Profile pattern

Page: `➜ Profile`. Main component: `Pattern/Profile Screen`.
Status: Ready for review.

Atomic map: Top App Bar + Profile Header + six List Item instances + Sign out Button.
Size: 375 x 812. Full-width pinned app bar, vertically scrolling body.
Modes: OS iOS/Android, Color Light/Dark, Language EN/AR; eight preview instances.

Personal section: Full name, Email, Phone number (Value rows). Account section: Security, Notifications, Language (Chevron rows). The header includes Edit profile; final action is Sign out.

All account data is illustrative. Arabic copy is supplied through instance overrides; modes handle fonts and direction. Automatic translation is not part of this pattern.

Reports: `audits/2026-10-05-screen-spec-profile.md`, `audits/2026-10-05-profile-audit.md`.
Final screenshot: `audits/2026-10-05-profile-modes-final.png`.
Reusable creation and audit scripts: `Inputs/profile-*.figma.js`. Run helpers first; build scripts reject duplicate nodes and must not be blindly rerun.

Pending: user review, two audit decisions about Avatar size and Android button touch area, library publication, and Storybook sync. No linked Design files are registered.
