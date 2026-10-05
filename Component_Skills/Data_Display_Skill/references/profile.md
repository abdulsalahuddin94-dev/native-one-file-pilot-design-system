# Profile components

Built by Codex on 2026-10-05; user review pending.

## Avatar (Atom)

- Page: `➜ Avatar`.
- Initials TEXT property; default `AS`. Decorative alongside a readable account name.
- 64 x 64 via existing Number/64; OS Radius/Full; Fill/Accent Subtle; Label/Primary; Title text style.
- Inherits OS, Color and Language. No platform, language or theme variants.
- Pending: semantic Avatar size alias approval; see `audits/2026-10-05-profile-audit.md`.

## Profile Header (Organism)

- Page: `➜ Profile Header`.
- Atomic map: Avatar + Title display name + Subhead email + Secondary Button.
- Display name and Email TEXT properties; nested Avatar and Button exposed.
- Centered layout; native fonts, spacing and button appearance come from existing modes.
- Email remains LTR. Arabic text is supplied as overrides, not automatic translation.
- Pending: expanded Android Button touch area token approval.

The composed `Pattern/Profile Screen` is documented in `docs/profile.md`; it is a Pattern, not another Data Display component.
