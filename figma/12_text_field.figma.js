const root = await docRoot('➜ Text Field', 'Text Field', 'Molecule (Icon + text). iOS: label in the flow above a filled rounded field. Android (M3 outlined): label floats on the border, 1px outline (2px focused). Both labels exist in the component; visibility is bound to Platform/Is iOS and Platform/Is Android, and one Label text property drives both. RTL: the field content exists as an LTR row and an RTL row (Direction/Is LTR|RTL) with the icons swapped and the value right-aligned; label and helper texts are aligned by spacers.');
const comps = [];
const STROKE = { Default: 'Color:Border/Strong', Focused: 'Color:Border/Focus', Error: 'Color:Border/Error', Disabled: 'Color:Border/Default' };
const LAB = { Default: 'Color:Label/Secondary', Focused: 'Color:Label/Accent', Error: 'Color:Label/Error', Disabled: 'Color:Label/Secondary' };
for (const s of ['Default', 'Focused', 'Error', 'Disabled']) {
  const c = figma.createComponent(); c.name = `State=${s}`;
  c.layoutMode = 'VERTICAL'; c.resize(343, 80); c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'FIXED'; c.fills = [];
  bind(c, { itemSpacing: 'OS:Spacing/Stack Gap' });
  if (s === 'Disabled') bind(c, { opacity: 'OS:State/Disabled Opacity' });
  // iOS label (in flow, aligned to the reading start)
  const lab = await txt('Display name', 'Footnote', s === 'Error' ? 'Color:Label/Error' : 'Color:Label/Secondary', 'Label');
  const labRow = alignedText(c, lab, 'Label Row'); labRow.setBoundVariable('visible', V('OS:Platform/Is iOS'));
  // field
  const field = AL('HORIZONTAL', 'Field', { counterAxisAlignItems: 'CENTER' }); c.appendChild(field);
  field.layoutSizingHorizontal = 'FILL'; field.counterAxisSizingMode = 'FIXED'; field.resize(343, 44);
  bind(field, { height: 'Component Specific:Text Field/Height', itemSpacing: 'OS:Spacing/Stack Gap' }); padX(field, 'Component Specific:Text Field/Padding X'); radius(field, 'Component Specific:Text Field/Radius');
  fill(field, 'Component Specific:Text Field/Fill'); stroke(field, STROKE[s], s === 'Focused' ? 'Component Specific:Text Field/Border Focused' : 'Component Specific:Text Field/Border'); field.strokeAlign = 'INSIDE';
  // one content row per direction (icons are hidden only by their properties, so a row is never empty)
  await dirRows(field, 'Field Content', {}, async (r, dir) => {
    r.layoutSizingHorizontal = 'FILL'; bind(r, { itemSpacing: 'OS:Spacing/Stack Gap' });
    const lead = await iconInst('Person', 'Color:Icon/Secondary', 'Leading Icon'), trail = await iconInst('Close', 'Color:Icon/Secondary', 'Trailing Icon');
    const t = rtlText(await txt('Abdul', 'Body', 'Color:Label/Primary', 'Input Text'), dir);
    for (const n of dir === LTR ? [lead, t, trail] : [trail, t, lead]) r.appendChild(n);
    t.layoutSizingHorizontal = 'FILL';
  });
  // Android floating label: a full-width absolute row per direction, the label box hugs the reading start
  for (const dir of [LTR, RTL]) {
    const fr = dirBox(dir === LTR ? 'Floating Label LTR' : 'Floating Label RTL', dir, { counterAxisAlignItems: 'MIN' });
    field.appendChild(fr); fr.layoutPositioning = 'ABSOLUTE'; fr.resize(343, 16); fr.x = 0; fr.y = -8; fr.constraints = { horizontal: 'STRETCH', vertical: 'MIN' };
    fr.primaryAxisSizingMode = 'FIXED'; fr.counterAxisSizingMode = 'AUTO';
    bind(fr, dir === LTR ? { paddingLeft: 'Component Specific:Text Field/Label Inset' } : { paddingRight: 'Component Specific:Text Field/Label Inset' });
    const box = AL('HORIZONTAL', 'Floating Label', {}); fill(box, 'OS:Surface/Screen'); padX(box, 'Component Specific:Text Field/Label Padding');
    box.setBoundVariable('visible', V('OS:Platform/Is Android'));
    box.appendChild(await txt('Display name', 'Caption', LAB[s], 'Floating Label Text'));
    if (dir === RTL) { const sp = blank('Spacer'); fr.appendChild(sp); sp.layoutSizingHorizontal = 'FILL'; }
    fr.appendChild(box);
    if (dir === LTR) { const sp = blank('Spacer'); fr.appendChild(sp); sp.layoutSizingHorizontal = 'FILL'; }
  }
  const help = await txt(s === 'Error' ? 'Name is required' : 'Shown on your profile', 'Footnote', s === 'Error' ? 'Color:Label/Error' : 'Color:Label/Secondary', 'Helper Text');
  alignedText(c, help, 'Helper Row');
  comps.push(c);
}
const set = combine(comps, 'Text Field', root, 2);
const P = {};
P.label = set.addComponentProperty('Label', 'TEXT', 'Display name');
P.value = set.addComponentProperty('Value', 'TEXT', 'Abdul');
P.help = set.addComponentProperty('Helper Text', 'TEXT', 'Shown on your profile');
P.showHelp = set.addComponentProperty('Show Helper Text', 'BOOLEAN', true);
P.lead = set.addComponentProperty('Leading Icon', 'BOOLEAN', false);
P.leadIcon = set.addComponentProperty('Leading Icon Swap', 'INSTANCE_SWAP', (await ICON('Person')).id, { preferredValues: await ICON_PREFERRED() });
P.trail = set.addComponentProperty('Trailing Icon', 'BOOLEAN', true);
P.trailIcon = set.addComponentProperty('Trailing Icon Swap', 'INSTANCE_SWAP', (await ICON('Close')).id, { preferredValues: await ICON_PREFERRED() });
for (const c of set.children) {
  for (const n of c.findAll(n => n.name === 'Label' || n.name === 'Floating Label Text')) n.componentPropertyReferences = { characters: P.label };
  for (const n of c.findAll(n => n.name === 'Input Text')) n.componentPropertyReferences = { characters: P.value };
  const h = c.findOne(n => n.name === 'Helper Text'); if (!c.name.includes('Error')) h.componentPropertyReferences = { characters: P.help, visible: P.showHelp }; else h.componentPropertyReferences = { visible: P.showHelp };
  for (const n of c.findAll(n => n.name === 'Leading Icon' && n.type === 'INSTANCE')) n.componentPropertyReferences = { visible: P.lead, mainComponent: P.leadIcon };
  for (const n of c.findAll(n => n.name === 'Trailing Icon' && n.type === 'INSTANCE')) n.componentPropertyReferences = { visible: P.trail, mainComponent: P.trailIcon };
}
describe(set, 'Single-line text entry in forms and settings (names, email, search terms).',
  'Always set Label (it shows above the field on iOS and on the border on Android: never use placeholder as the label). Helper Text explains format; Error state replaces it with the error message. Trailing Close clears the value. Use Select for 7+ fixed options, Radio for 2-6. RTL (Language AR) mirrors icons and aligns text to the right automatically.',
  'Height 44 iOS / 56 Android (meets touch targets). Label and helper text use Label/Secondary (4.5:1+). Error is shown by text and border color, not color alone. Android floating label background follows Surface/Screen; place the field on that surface.');
await preview(root, set, async (f) => { const w = AL('VERTICAL', 'Instances', { itemSpacing: 16 }); f.appendChild(w); for (const c of set.children) w.appendChild(c.createInstance()); });
return { set: set.id };
