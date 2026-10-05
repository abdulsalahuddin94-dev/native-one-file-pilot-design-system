# Profile screen - proposed spec

Status: Ready for review; awaiting Abdul's approval before Figma writes.
Tool: Codex
Target: Native One File Pilot Design System, new page `➜ Profile`.
Purpose: a reusable account profile pattern demonstrating native OS, Color and Language modes, consistent with the existing Settings pattern.
Source: original design requested by Abdul; no external source screen supplied.
Size: 375 x 812, matching the existing Settings pattern.

## Sections, top to bottom

| Section | Component / content | Behavior |
|---|---|---|
| App bar | Top App Bar; Profile / الملف الشخصي; back enabled, settings action | Full width; pinned |
| Identity | New Profile Header composed of Avatar and text styles; initials AS; Abdul Salah / عبدالرحمن صلاح; abdul@example.com; Secondary Button: Edit profile / تعديل الملف الشخصي | Content gutter; centered identity; sample account content |
| Personal information | Section title: Personal information / المعلومات الشخصية. Three List Item Value rows: Full name / الاسم الكامل = Abdul Salah / عبدالرحمن صلاح; Email / البريد الإلكتروني = abdul@example.com; Phone number / رقم الهاتف = +20 100 123 4567 | Reuse List Item and available icons; email and phone stay LTR |
| Account | Section title: Account / الحساب. List Item Chevron rows: Security / الأمان (Lock), Notifications / الإشعارات (Notifications), Language / اللغة (Globe); each navigates to details | Scrollable with preceding content |
| Action | Secondary Button: Sign out / تسجيل الخروج; no invented danger token | In content flow; separated from navigation rows |

## Component gaps and atomic map

| Component | Tier | Availability | Dependencies |
|---|---|---|---|
| Top App Bar | Organism | Existing | Existing native wrapper and icons |
| List Item | Molecule | Existing | Existing Value / Chevron variants |
| Button | Atom | Existing | Secondary variant |
| Avatar | Atom | Missing | Existing surface, text, size and radius variables; initials fallback |
| Profile Header | Organism | Missing | Avatar + existing Button + existing text styles |
| Pattern/Profile Screen | Pattern | New deliverable | Top App Bar + Profile Header + List Item + Button |

## Mode and quality rules

- One pattern, OS iOS/Android and Color Light/Dark through modes. No platform, theme or direction variants.
- Eight instances covering OS x Color x EN/AR. Arabic copy is supplied through exposed text overrides; it does not require new translation variables.
- Direction-sensitive components follow the existing LTR/RTL boolean visibility convention.
- Existing tokens and icons only. If inspection shows an essential missing token, propose it before adding it.
- Preserve all existing components, pages and Abdul's manually edited Settings sections.
- Inspect screenshots of each combination and audit bindings, instances, layout, text overflow and RTL.
- This is a DS demonstration pattern, matching the existing Settings arrangement, not a new linked Design file.

## Approval scope

Approve the copy and structure above, creation of Avatar and Profile Header in the DS, and composition of the Profile pattern and eight previews. No library publishing is included.
