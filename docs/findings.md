# Native One File Pilot - Findings

Pilot: iOS + Android + EN/AR in ONE Figma DS file ("Native One File Pilot Design System"), platform and direction differences in variables, not in duplicate components. Built 2026-10-05 with FigCli Yolo. Audit: `audits/2026-10-05-audit.md`.

## Counts

| Item | Count |
|---|---|
| Variable collections | 5: Primitives (67), Color Light/Dark (36), Language EN/AR (34), OS iOS/Android (82), Component Specific one mode (44) = 263 variables |
| Text styles / effect styles | 8 / 1 (every field bound to OS tokens) |
| Icons | 11 dual icons (SF Symbol layer + Material Symbol layer, visibility bound to Platform/Is iOS / Is Android; directional icons mirror with Direction) |
| Component sets / single components | 9 sets + 2 single (Segmented Control, Top App Bar) + 1 pattern (Settings Screen) |
| Components with zero platform variants | 10 of 11 (Button, Icon Button, Toggle, Checkbox, Segment, Segmented Control, Text Field, List Item, Top App Bar wrapper, every Icon). Only the private `_Top App Bar Platform` has Platform=iOS/Android, because the anatomy really differs |
| Light/Dark or direction variants | 0 |
| Screens | 1 Settings pattern, shown in 6 mode frames; ⭐Setup › ➜ Platform Preview shows every component in 6 mode frames (instances only) |

## What worked
- Two-stage chain layer -> OS token -> Language token -> value: one binding, three switches (OS, Color, Language) set on the frame. Type, spacing, radius, heights, M3 switch/segmented/outlined field details all came from tokens.
- Component Specific collection with one mode, every token aliasing the OS collection: OS stays the only platform switch, and component tokens are readable per component (`Toggle/Track Width`).
- Platform-only parts (iOS chevron and inset separator, Android floating label and selected check) as layers whose visibility is bound to `Platform/Is iOS|Is Android`.
- **Variant property bound to a variable works**: the Top App Bar wrapper's nested `Platform` variant is bound to the string variable `Platform/Name`, so the right anatomy appears with the OS mode.
- Full RTL with no direction variants: `Direction/Is LTR|RTL` booleans in Language (EN true/false, AR false/true).
- Arabic: Noto Sans Arabic through the Language font family tokens, taller AR line heights.

## Figma limits found
- No variable for **layout direction**, **auto layout order** or **text alignment**. Workaround: each direction-sensitive row exists twice (Row LTR / Row RTL, visibility bound to Direction); the RTL row has the parts reversed and the text right-aligned. Text-only rows use spacers bound to Direction.
- **Hidden-before-filled frames**: a frame hidden (by a variable) before its children are added never computes its hug size and shows as 100x100 when a mode makes it visible. A hug frame whose children are all hidden also keeps its last size. Rule used: bind direction visibility after the content is in, and never wrap a single element that a property can hide.
- A layer's visibility takes ONE source: a component property OR a variable. "Leading icon on AND RTL" therefore needs two levels (direction row + property on the icon).
- No variable for **effect presence**: the iOS "no shadow" is a transparent shadow color, not a removed effect.
- Component text and swap properties must be wired to both direction copies; overrides on exposed nested instances (Toggle, Checkbox inside List Item) exist once per direction.
- Deleting and rebuilding a main component turns instances of it in the same file into plain frames; rebuilds now keep user sections and the instance was restored.

## Cost of the method
- About 2x layers in direction-sensitive components (two rows), invisible in use.
- Designers set three modes on a frame instead of picking a platform component; easy once a screen frame carries the modes.
- Developers get one component with platform tokens (SwiftUI / Compose names in code syntax), which matches how native code is written.

## Recommendation
Add "Native, one file" as a **third option in intake 1.3** (next to Native two files and Cross-platform), not as the default:
- Recommend it when the iOS and Android apps share the same product design and one team maintains the DS (most product companies), especially with EN/AR.
- Keep "Native, two files" when the platforms are designed by separate teams or diverge strongly (different navigation, many platform-only components).
- Required skill notes if adopted: the 4 collections + Component Specific, the direction-row pattern, the "bind visibility after content" rule, the dual icon pattern, and the Platform Preview page in ⭐Setup.

Ready for review (Abdul).
