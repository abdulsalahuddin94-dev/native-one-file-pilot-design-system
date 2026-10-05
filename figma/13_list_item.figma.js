const root = await docRoot('➜ List Item', 'List Item', 'Molecule (Icon, Toggle, Checkbox, text). One row for both platforms: height 44 iOS / 56 Android, padding and type from Component Specific tokens. iOS-only parts (disclosure chevron, inset separator) are bound to Platform/Is iOS. RTL: the row exists as Row LTR and Row RTL (Direction/Is LTR|RTL) with the parts in reverse order and the text right-aligned; the chevron icon mirrors itself. Trailing is a variant because the trailing anatomy changes.');
const pg = async (name) => { const p = figma.root.children.find(x => x.name === name); await p.loadAsync(); return p; };
const tog = (await pg('➜ Toggle')).findOne(n => n.type === 'COMPONENT' && n.name === 'Value=On, State=Default');
const chk = (await pg('➜ Checkbox')).findOne(n => n.type === 'COMPONENT' && n.name === 'Value=Checked, State=Default');
const chevron = async () => { const i = await iconInst('Chevron Right', 'Color:Icon/Secondary', 'Chevron'); i.setBoundVariable('visible', V('OS:Platform/Is iOS')); return i; };
// trailing parts in reading order (LTR); the RTL row reverses them
const trailing = async (tr) => {
  if (tr === 'Value') return [await txt('English', 'Body', 'Color:Label/Secondary', 'Value'), await chevron()];
  if (tr === 'Chevron') return [await chevron()];
  if (tr === 'Toggle') { const i = tog.createInstance(); i.name = 'Toggle'; return [i]; }
  if (tr === 'Checkbox') { const i = chk.createInstance(); i.name = 'Checkbox'; return [i]; }
  return [];
};
const comps = [];
for (const tr of ['Chevron', 'Value', 'Toggle', 'Checkbox', 'None']) {
  const c = figma.createComponent(); c.name = `Trailing=${tr}`;
  c.layoutMode = 'VERTICAL'; c.resize(375, 44); c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'FIXED';
  fill(c, 'Component Specific:List Item/Fill');
  // one row per direction (Row LTR / Row RTL): the text column is always visible, so a row never collapses
  await dirRows(c, 'Row', {}, async (row, dir) => {
    row.layoutSizingHorizontal = 'FILL';
    bind(row, { minHeight: 'Component Specific:List Item/Min Height', itemSpacing: 'OS:Spacing/Inline Gap' }); padX(row, 'Component Specific:List Item/Padding X'); padY(row, 'Component Specific:List Item/Padding Y');
    const lead = await iconInst('Settings', 'Color:Icon/Primary', 'Leading Icon');
    const tb = AL('VERTICAL', 'Text Content', {}); bind(tb, { itemSpacing: 'OS:Spacing/Tight' });
    const parts = await trailing(tr);
    for (const n of dir === LTR ? [lead, tb, ...parts] : [...parts.reverse(), tb, lead]) row.appendChild(n);
    tb.layoutSizingHorizontal = 'FILL';
    for (const t of [await txt('Title', 'Body', 'Color:Label/Primary', 'Title'), await txt('Supporting text', 'Subhead', 'Color:Label/Secondary', 'Supporting Text')]) {
      tb.appendChild(rtlText(t, dir)); t.layoutSizingHorizontal = 'FILL'; t.textAutoResize = 'HEIGHT'; }
  });
  // separator inset on the reading start side (iOS only)
  const sep = AL('HORIZONTAL', 'Separator Container', {}); c.appendChild(sep); sep.layoutSizingHorizontal = 'FILL';
  sep.setBoundVariable('visible', V('OS:Platform/Is iOS'));
  const inset = (dir) => { const f = blank(dir === LTR ? 'Inset LTR' : 'Inset RTL'); f.resize(16, 1); bind(f, { width: 'Component Specific:List Item/Padding X' }); f.setBoundVariable('visible', V(dir)); return f; };
  sep.appendChild(inset(LTR));
  const line = figma.createRectangle(); line.name = 'Separator'; line.resize(300, 1); sep.appendChild(line); line.layoutSizingHorizontal = 'FILL'; fill(line, 'Color:Separator/Default');
  sep.appendChild(inset(RTL));
  comps.push(c);
}
const set = combine(comps, 'List Item', root, 1);
const P = {
  title: set.addComponentProperty('Title', 'TEXT', 'Title'),
  sup: set.addComponentProperty('Supporting Text', 'TEXT', 'Supporting text'),
  showSup: set.addComponentProperty('Show Supporting Text', 'BOOLEAN', false),
  value: set.addComponentProperty('Value', 'TEXT', 'English'),
  lead: set.addComponentProperty('Leading Icon', 'BOOLEAN', true),
  leadIcon: set.addComponentProperty('Leading Icon Swap', 'INSTANCE_SWAP', (await ICON('Settings')).id, { preferredValues: await ICON_PREFERRED() }),
  sep: set.addComponentProperty('Show Separator', 'BOOLEAN', true),
};
for (const c of set.children) {
  for (const n of c.findAll(n => n.name === 'Title')) n.componentPropertyReferences = { characters: P.title };
  for (const n of c.findAll(n => n.name === 'Supporting Text')) n.componentPropertyReferences = { characters: P.sup, visible: P.showSup };
  for (const v of c.findAll(n => n.name === 'Value' && n.type === 'TEXT')) v.componentPropertyReferences = { characters: P.value };
  for (const n of c.findAll(n => n.name === 'Leading Icon' && n.type === 'INSTANCE')) n.componentPropertyReferences = { visible: P.lead, mainComponent: P.leadIcon };
  c.findOne(n => n.name === 'Separator').componentPropertyReferences = { visible: P.sep };
  for (const n of c.findAll(n => n.type === 'INSTANCE' && (n.name === 'Toggle' || n.name === 'Checkbox'))) n.isExposedInstance = true;
}
describe(set, 'One row in a list or settings group: navigates (Chevron, Value), toggles a setting (Toggle) or selects (Checkbox).',
  'Stack rows in a group with no gap; turn Show Separator off on the last row of a group. Chevron/Value rows open a new screen (chevron shows on iOS only, Android uses the whole row). Toggle rows apply at once. Title 1 line, Supporting Text up to 2 lines. In RTL the row mirrors automatically; the exposed Toggle/Checkbox exist once per direction (set both when overriding).',
  'Whole row is the touch target (44 iOS / 56 Android). Toggle and Checkbox take their label from Title. Title Label/Primary, supporting and value text Label/Secondary (4.5:1+).');
await preview(root, set);
return { set: set.id };
