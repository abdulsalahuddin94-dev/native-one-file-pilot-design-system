const root = await docRoot('➜ Segmented Control', 'Segmented Control', 'Segment (atom) and Segmented Control (molecule). iOS: gray track, 2px padding, white selected pill (Radius Outer 9 / Radius Inner 7). Android (M3 segmented buttons): outlined, full radius, segments clipped square (Radius Inner 0), 1px dividers, selected segment tinted with a check icon. All of it is OS tokens plus one icon whose visibility is bound to Platform/Is Android.');
// ---- Segment atom
const segs = [];
for (const sel of ['Yes', 'No']) {
  const c = figma.createComponent(); c.name = `Selected=${sel}`;
  c.layoutMode = 'HORIZONTAL'; c.primaryAxisAlignItems = 'CENTER'; c.counterAxisAlignItems = 'CENTER'; bind(c, { itemSpacing: 'OS:Spacing/Stack Gap' });
  c.primaryAxisSizingMode = 'FIXED'; c.counterAxisSizingMode = 'AUTO'; c.resize(110, 28);
  padX(c, 'OS:Spacing/Stack Gap');
  radius(c, 'Component Specific:Segmented Control/Radius Inner');
  fill(c, sel === 'Yes' ? 'Component Specific:Segmented Control/Selected Fill' : 'Color:Fill/Transparent');
  c.strokes = [paint('Color:Border/Strong')]; c.strokeAlign = 'INSIDE'; c.strokeTopWeight = 0; c.strokeBottomWeight = 0; c.strokeLeftWeight = 0;
  c.setBoundVariable('strokeRightWeight', V('Component Specific:Segmented Control/Border'));
  await dirRows(c, 'Content', {}, async (r, dir) => {
    bind(r, { itemSpacing: 'OS:Spacing/Stack Gap' });
    const ic = await iconInst('Check', 'Color:Icon/Primary', 'Selected Icon');
    const lb = await txt('Segment', 'Subhead', 'Color:Label/Primary', 'Segment Label');
    for (const n of dir === LTR ? [ic, lb] : [lb, ic]) r.appendChild(n);
    if (sel === 'Yes') ic.setBoundVariable('visible', V('OS:Platform/Is Android')); else ic.visible = false;
  });
  segs.push(c);
}
const segSet = combine(segs, 'Segment', root, 2);
const kLab = segSet.addComponentProperty('Label', 'TEXT', 'Segment');
for (const c of segSet.children) for (const n of c.findAll(n => n.name === 'Segment Label')) n.componentPropertyReferences = { characters: kLab };
describe(segSet, 'One option inside a Segmented Control. Not used on its own.', 'Only inside Segmented Control. Label 1-2 words, no icons except the Android selected check (automatic).', 'Selected state is not color-only: iOS adds a raised pill, Android adds a check icon.');
// ---- Segmented Control molecule
const sc = figma.createComponent(); sc.name = 'Segmented Control';
sc.layoutMode = 'HORIZONTAL'; sc.resize(343, 32); sc.primaryAxisSizingMode = 'FIXED'; sc.counterAxisSizingMode = 'FIXED'; sc.clipsContent = true;
bind(sc, { height: 'Component Specific:Segmented Control/Height' });
bind(sc, { paddingLeft: 'Component Specific:Segmented Control/Padding', paddingRight: 'Component Specific:Segmented Control/Padding', paddingTop: 'Component Specific:Segmented Control/Padding', paddingBottom: 'Component Specific:Segmented Control/Padding' });
radius(sc, 'Component Specific:Segmented Control/Radius Outer'); fill(sc, 'Component Specific:Segmented Control/Track');
stroke(sc, 'Color:Border/Strong', 'Component Specific:Segmented Control/Border'); sc.strokeAlign = 'INSIDE';
const yes = segSet.children.find(c => c.name === 'Selected=Yes'), no = segSet.children.find(c => c.name === 'Selected=No');
const labels = ['Day', 'Week', 'Month', 'Year'];
// Two rows: LTR (Segment 1 at the left) and RTL (Segment 1 at the right). Figma cannot reverse auto layout order by
// a variable, so the RTL row repeats the segments in reverse order; its labels are set separately (exposed as "RTL ...").
const k4 = sc.addComponentProperty('Show Segment 4', 'BOOLEAN', false);
const k3 = sc.addComponentProperty('Show Segment 3', 'BOOLEAN', true);
for (const dir of [LTR, RTL]) {
  const row = AL('HORIZONTAL', dir === LTR ? 'Segments LTR' : 'Segments RTL', {}); sc.appendChild(row);
  row.layoutSizingHorizontal = 'FILL'; row.layoutSizingVertical = 'FILL';
  const order = dir === LTR ? [0, 1, 2, 3] : [3, 2, 1, 0];
  for (const i of order) {
    const inst = (i === 0 ? yes : no).createInstance(); inst.name = (dir === RTL ? 'RTL ' : '') + 'Segment ' + (i + 1);
    row.appendChild(inst); inst.layoutSizingHorizontal = 'FILL'; inst.layoutSizingVertical = 'FILL';
    inst.setProperties({ [Object.keys(inst.componentProperties).find(k => k.startsWith('Label'))]: labels[i] });
    if (i === 3) inst.componentPropertyReferences = { visible: k4 }; if (i === 2) inst.componentPropertyReferences = { visible: k3 };
    inst.isExposedInstance = true;
  }
  row.setBoundVariable('visible', V(dir));
}
root.appendChild(sc);
describe(sc, 'Switches between 2-4 views or filters of the same content.',
  'Use 2-4 segments with short labels of similar length; more options -> Tabs or Select. Exactly one segment selected (set Selected on the exposed Segment). Not for actions (use Button) or settings (use Toggle).',
  'Each segment is at least 44 (iOS: 32 control + list padding) / 48 Android touch target in context. Selected state uses shape and icon, not only color. Labels via the exposed Segment Label properties.');
await preview(root, null, async (f) => { const i = sc.createInstance(); f.appendChild(i); const j = sc.createInstance(); j.setProperties({ [Object.keys(j.componentProperties).find(k => k.startsWith('Show Segment 3'))]: false }); f.appendChild(j); });
return { segment: segSet.id, control: sc.id };
