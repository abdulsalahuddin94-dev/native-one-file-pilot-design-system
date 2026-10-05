const root = await docRoot('➜ Checkbox', 'Checkbox', 'Atom. iOS shows a round check (Reminders and list selection style); Material 3 shows a square box. Same anatomy: size, radius and border width are OS tokens (iOS 22 circle, 1.5 border; Android 18 square, radius 2, border 2).');
const comps = [];
for (const val of ['Checked', 'Unchecked']) for (const s of ['Default', 'Disabled']) {
  const on = val === 'Checked';
  const c = figma.createComponent(); c.name = `Value=${val}, State=${s}`;
  c.layoutMode = 'HORIZONTAL'; c.primaryAxisAlignItems = 'CENTER'; c.counterAxisAlignItems = 'CENTER';
  c.primaryAxisSizingMode = 'FIXED'; c.counterAxisSizingMode = 'FIXED'; c.resize(22, 22);
  bind(c, { width: 'Component Specific:Checkbox/Size', height: 'Component Specific:Checkbox/Size' }); radius(c, 'Component Specific:Checkbox/Radius');
  if (on) fill(c, 'Color:Fill/Accent'); else { fill(c, null); stroke(c, 'Color:Border/Strong', 'Component Specific:Checkbox/Border'); c.strokeAlign = 'INSIDE'; }
  if (s === 'Disabled') bind(c, { opacity: 'OS:State/Disabled Opacity' });
  const i = await iconInst('Check', 'Color:Icon/On Accent', 'Check'); c.appendChild(i);
  bind(i, { width: 'Component Specific:Checkbox/Glyph', height: 'Component Specific:Checkbox/Glyph' }); i.visible = on;
  comps.push(c);
}
const set = combine(comps, 'Checkbox', root, 2);
describe(set, 'Selects one or more items from a list, or confirms an option before submitting.',
  'Use for multi-select and for options confirmed by a later action; use Toggle for settings that apply at once and Radio (2-6 options) or Select (7+) for single choice. Label lives in the List Item title.',
  'Touch target comes from the List Item row (44 iOS / 48 Android); the box itself is 22 / 18. Check glyph on the yellow fill uses Icon/On Accent (14.7:1). Unchecked border uses Border/Strong (3:1+ on surfaces).');
await preview(root, set, async (f) => { const r = AL('HORIZONTAL', 'Instances', { itemSpacing: 16, counterAxisAlignItems: 'CENTER' }); f.appendChild(r); for (const c of set.children) r.appendChild(c.createInstance()); });
return { set: set.id };
