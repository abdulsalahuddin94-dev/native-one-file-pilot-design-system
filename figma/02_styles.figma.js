// Text styles per OS role (family, size, line height, weight bound to OS tokens) + Elevation 1 effect style.
if (!figma.root.name.startsWith('Native One File Pilot')) throw new Error('Wrong file: ' + figma.root.name);
const vars = await figma.variables.getLocalVariablesAsync();
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const osCol = cols.find(c => c.name === 'OS');
const v = n => { const x = vars.find(y => y.name === n && y.variableCollectionId === osCol.id); if (!x) throw new Error('missing ' + n); return x; };
for (const s of ['Regular','Medium','Semibold','Bold']) await figma.loadFontAsync({ family: 'SF Pro', style: s });
for (const s of ['Regular','Medium','SemiBold','Bold']) await figma.loadFontAsync({ family: 'Roboto', style: s });
const ROLES = { 'Large Title': 'Large title, top of a scrolling screen', 'Title': 'Screen and section titles', 'Headline': 'Emphasized row and card titles', 'Body': 'Default reading text, list item titles', 'Subhead': 'Supporting text under a title', 'Footnote': 'Section footers, helper text', 'Caption': 'Labels on small elements', 'Button Label': 'Button and segmented control labels' };
const existing = await figma.getLocalTextStylesAsync();
const out = [];
for (const [r, d] of Object.entries(ROLES)) {
  let st = existing.find(s => s.name === r);
  if (!st) { st = figma.createTextStyle(); st.name = r; }
  st.fontName = { family: 'SF Pro', style: 'Regular' };
  st.description = d + '. Bound to OS tokens: iOS / Android role switches with the OS mode, EN / AR with the Language mode.';
  st.setBoundVariable('fontFamily', v('Font Family'));
  st.setBoundVariable('fontSize', v('Font Size/' + r));
  st.setBoundVariable('lineHeight', v('Line Height/' + r));
  st.setBoundVariable('fontWeight', v('Font Weight/' + r));
  out.push({ name: st.name, id: st.id, bound: Object.keys(st.boundVariables || {}) });
}
const effs = await figma.getLocalEffectStylesAsync();
let e = effs.find(s => s.name === 'Elevation 1');
if (!e) { e = figma.createEffectStyle(); e.name = 'Elevation 1'; }
let eff = { type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.2 }, offset: { x: 0, y: 1 }, radius: 3, spread: 0, visible: true, blendMode: 'NORMAL' };
eff = figma.variables.setBoundVariableForEffect(eff, 'color', v('Shadow/Elevation 1'));
e.effects = [eff];
e.description = 'Android elevation level 1 (cards, raised bars). On iOS the color resolves to Shadow/None (transparent), so no shadow shows.';
return { textStyles: out, effect: { id: e.id, bound: !!e.effects[0].boundVariables } };
