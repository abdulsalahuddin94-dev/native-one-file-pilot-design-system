# Native_One_File_Pilot - Changelog

What was built or changed in Figma, newest first. Every build or Figma change session adds one entry with `Storybook synced: no`; a Storybook update marks the entries `yes` (`python tools/project_status.py "My Projects/Native_One_File_Pilot" --mark-synced`). The daily check reads only this file and `status.json`, never Figma.

Entry format:

```
## YYYY-MM-DD - <what, e.g. Components: Button, Input Field>
- Storybook synced: yes
- Tool: <Claude Code / Codex / Cursor / Antigravity / ...>
- Changed: <components, variables or styles added, changed or removed>
- Figma file: <name>
- Library published: <yes / no> (DS changes only)
- Design files updated (Accept updates): <name: yes / no, one per linked Design file>
```

## 2026-10-05 - Quick task: Profile pattern and reusable identity components (Codex)
- Storybook synced: no
- Tool: Codex (FigCli Yolo)
- Changed: Avatar, Profile Header, Pattern/Profile Screen; new Avatar, Profile Header and Profile pages; eight OS x Color x Language screen previews; eight Profile Header previews on Platform Preview; registry, component docs, screen spec and scoped audit. Existing components and Abdul's Settings sections preserved.
- Figma file: Native One File Pilot Design System (a2EAdCeKeaXN679TMNlIev)
- Library published: no
- Design files updated (Accept updates): none linked
- Design file audit: in-library pattern scope; 8 screens, check_screens 0 issues, 140 visible texts checked with 0 contrast failures, raw paints/spacing/radius 0, missing main components 0. Report: audits/2026-10-05-profile-audit.md.
- Screenshot: audits/2026-10-05-profile-modes-final.png
- Pending: user review; Avatar width/height bind directly to Number/64 (semantic aliases proposed); existing Android Button height is 40px (expanded 48px touch area proposed). No new token added without approval. Library publish and Storybook sync pending.
- Handoff: Inputs/profile-*.figma.js contains scoped creation/finalization/audit scripts; initialize DS and PF helpers before reuse. No external screenshot source; original design from the approved spec.

## 2026-10-05 - Pilot build: foundations, components, RTL, Platform Preview, audit
- Storybook synced: yes
- Tool: Claude Code (FigCli Yolo)
- Changed: collections Primitives, Color (Light/Dark), Language (EN/AR, incl. Direction/Is LTR|RTL), OS (iOS/Android), Component Specific (one mode, 44 tokens aliasing OS; components rebound to it); 8 text styles, 1 effect style; 11 dual icons; Button, Icon Button, Toggle, Checkbox, Segment, Segmented Control, Text Field, List Item, Top App Bar (wrapper + private platform set); Pattern/Settings Screen. RTL: direction rows (Row LTR / Row RTL) in Button, Segment, Text Field, List Item, Top App Bar, fixing the 100x100 hidden-wrapper bug. Per-component Preview frames removed; new ⭐Setup › ➜ Platform Preview (instances only, 6 mode frames per component). "Text" layers renamed; 48 spacer frames given auto layout. Abdul's sections on ➜ Settings kept; the instance in "IOS - light" re-created after the rebuild.
- Audit: audits/2026-10-05-audit.md (all checks 0). Findings: docs/findings.md.
- Figma file: Native One File Pilot Design System
- Library published: no
- Design files updated (Accept updates): none linked
