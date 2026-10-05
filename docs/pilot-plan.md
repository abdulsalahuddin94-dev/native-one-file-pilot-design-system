# Native One File Pilot - Plan (for approval)

Pilot of "Native, one file": iOS + Android in ONE Figma DS file. Platform differences live in variables, not in duplicate components.
Status: Approved 2026-10-05. Brand color #FDD501 (ramp in data/source/brand-ramp.json). Arabic: EN + AR (Noto Sans Arabic: Abdul 2026-10-05, IBM Plex Sans Arabic not installed). Plan approved by Abdul 2026-10-05.

## 1. Collections

| Collection | Modes | Holds |
|---|---|---|
| Primitives | (one mode) | Raw values: color scales, Transparent, spacing/radius/size numbers |
| Color | Light, Dark | Semantic colors shared by both platforms, alias Primitives only |
| Language | EN, AR | Type primitives per language: font family, size, line height per platform role |
| OS | iOS, Android | Only what differs by platform: type roles, spacing, radius, heights, platform booleans, a few component tokens |

Two-stage chain: layer -> OS token -> Language token -> value.
Example: `Font Size/Body` (OS) iOS -> `iOS/Body/Size` (Language: EN 17, AR 17), Android -> `Android/Body Large/Size` (EN 16, AR 16). Line heights differ for AR (taller). The layer binding never changes; switching OS or Language mode on a frame changes the result.

## 2. Tokens

### Primitives
- `Color/Brand/50..950` (generated from the brand color), `Color/Neutral/0..1000`, `Color/Red|Green|Orange/100,500,600,700`, `Color/Transparent` (alpha 0).
- `Number/0,2,4,6,8,10,12,14,16,20,24,28,32,36,40,44,48,50,56,64,999`.

### Color (Light / Dark)
Background/Primary, Background/Grouped, Background/Elevated, Surface/Container, Surface/Container High,
Label/Primary, Label/Secondary, Label/Tertiary, Label/On Accent, Label/Error,
Fill/Accent, Fill/Accent Pressed, Fill/Secondary, Fill/Disabled, Fill/Track Off,
Icon/Primary, Icon/Secondary, Icon/Accent, Icon/On Accent,
Border/Default, Border/Strong, Border/Focus, Border/Error, Separator/Default,
Shadow/Default, Shadow/None (Transparent).

### Language (EN / AR)
- `Font Family/iOS` (SF Pro | Noto Sans Arabic), `Font Family/Android` (Roboto | Noto Sans Arabic).
- `iOS/<Role>/Size|Line Height` for Large Title 34, Title 2 22, Headline 17, Body 17, Subheadline 15, Footnote 13, Caption 1 12.
- `Android/<Role>/Size|Line Height` for Headline Small 24, Title Large 22, Title Medium 16, Body Large 16, Body Medium 14, Label Large 14, Body Small 12.

### OS (iOS / Android)
- Booleans: `Platform/Is iOS`, `Platform/Is Android`. String: `Platform/Name` (iOS | Android).
- Type roles (alias Language): `Font Family`, `Font Size|Line Height|Font Weight /` Large Title, Title, Headline, Body, Subhead, Footnote, Caption, Button Label.
- Spacing: Screen Margin 16|16, Stack Gap 8|8, List Item Padding X 16|16, List Item Padding Y 11|12, Section Gap 35|24.
- Radius: Button 12|999, Card 10|12, Field 10|4, Checkbox 999|2.
- Height: Button 50|40, Icon Button 44|48, List Item 44|56, Text Field 44|56, Top Bar 44|64, Icon 22|24.
- Surface aliases (OS -> Color): `Surface/Screen` iOS -> Background/Grouped, Android -> Background/Primary; `Shadow/Elevation 1` iOS -> Shadow/None, Android -> Shadow/Default.
- Component tokens (pilot exception, `Component / Property`): Segmented Control/Radius Outer 9|999, Radius Inner 7|999, Height 32|40, Padding 2|0;
  Toggle/Track Width 51|52, Track Height 31|32, Thumb Size Off 27|16, Thumb Size On 27|24, Track Border 0|2; Checkbox/Size 22|18.

Code syntax on every variable: iOS (SwiftUI, e.g. `Color.labelPrimary`, `.font(.body)`), Android (Compose / M3, e.g. `MaterialTheme.colorScheme.primary`, `md.sys.typescale.body-large`).

## 3. Text and effect styles
Text styles per OS role (Large Title ... Button Label), every field bound to OS tokens. Effect style `Elevation 1` with color bound to `Shadow/Elevation 1` (invisible on iOS).

## 4. Components (atomic map)
Rule: token first; variant only when the anatomy changes.

- Atoms
  - Icon: one component per meaning (Chevron Right, Back, Search, Settings, Notifications, Lock, Person, Check, Close): SF Symbol layer (visible: Is iOS) + Material Symbol layer (visible: Is Android); Material glyph box padding vs SF glyph-only sized so they match optically. Color bound to Icon tokens.
  - Button: Variant (Primary, Secondary, Text) x State (Default, Pressed, Disabled); leading icon swap + boolean. Radius/height/type from OS.
  - Icon Button: Variant (Standard, Filled) x State.
  - Toggle: Value (On, Off) x State (Default, Disabled); sizes from Toggle tokens; M3 track border via Track Border.
  - Checkbox: Value (Checked, Unchecked) x State; iOS circle / Android square via Checkbox radius + size.
  - Segment: Selected (yes, no) - used only inside Segmented Control.
- Molecules
  - Segmented Control: 2-4 Segment instances, Radius Outer / Inner, Padding.
  - List Item: leading Icon, Title, Supporting Text, trailing (Chevron, Toggle, Checkbox, Value) as booleans/swaps; separator (Is iOS) and chevron (Is iOS) visibility bound.
  - Text Field: two label layers, in-flow label (Is iOS) and on-border label (Is Android), visibility bound; State (Default, Focused, Error, Disabled).
- Organisms
  - Top App Bar: real anatomy difference (iOS centered title + optional large title; Android left title, 64 tall). Built as a private set `_Top App Bar / Platform=iOS|Android` and a published wrapper `Top App Bar` whose nested instance's Platform property is bound to `Platform/Name` (tests whether Figma binds variant props to variables; fallback: two visibility-bound layers, reported).
- Pattern
  - Settings screen 375 wide, built once, shown side by side: iOS / Android x Light / Dark (+ AR if included).

## 5. Pages
Cover, ⭐Setup (➜ Colors, ➜ Typography, ➜ Platform Tokens), ⭐Navigation (Button, Icon Button, Segmented Control, Top App Bar), ⭐Form Elements (Toggle, Checkbox, Text Field), ⭐Data Display (Icon, List Item), Pilot Screens.

## 6. Checkpoints
1. This plan approved.
2. Foundation screenshots (iOS/Android x Light/Dark) after styles.
3. Component screenshots per component in iOS/Android x Light/Dark.
4. Settings screen side by side, audit-design-system, findings note (`docs/findings.md`).
