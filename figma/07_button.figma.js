const root = await docRoot('➜ Button', 'Button', 'Atom. One component for iOS and Android: height, radius, padding and label style come from OS tokens (iOS 50 tall, 12 radius, Headline label; Android 40 tall, full radius, Label Large). No platform variant: the anatomy is the same.');
const FILLS = { Primary: ['Color:Fill/Accent', 'Color:Fill/Accent Pressed', 'Color:Fill/Disabled'], Secondary: ['Color:Fill/Secondary', 'Color:Fill/Secondary Pressed', 'Color:Fill/Disabled'], Text: [null, 'Color:Fill/Secondary', null] };
const LABEL = { Primary: 'Color:Label/On Accent', Secondary: 'Color:Label/Primary', Text: 'Color:Label/Accent' };
const ICONC = { Primary: 'Color:Icon/On Accent', Secondary: 'Color:Icon/Primary', Text: 'Color:Icon/Accent' };
const comps = [];
for (const variant of ['Primary', 'Secondary', 'Text']) for (const [si, state] of ['Default', 'Pressed', 'Disabled'].entries()) {
  const c = figma.createComponent(); c.name = `Variant=${variant}, State=${state}`;
  c.layoutMode = 'HORIZONTAL'; c.primaryAxisAlignItems = 'CENTER'; c.counterAxisAlignItems = 'CENTER';
  c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'FIXED';
  bind(c, { height: 'Component Specific:Button/Height', itemSpacing: 'OS:Spacing/Stack Gap' }); padX(c, 'Component Specific:Button/Padding X'); radius(c, 'Component Specific:Button/Radius');
  fill(c, FILLS[variant][si]);
  const dis = state === 'Disabled';
  await dirRows(c, 'Content', {}, async (r, dir) => {
    bind(r, { itemSpacing: 'OS:Spacing/Stack Gap' });
    const ic = await iconInst('Check', dis ? 'Color:Icon/Disabled' : ICONC[variant], 'Leading Icon');
    const lb = await txt('Button', 'Button Label', dis ? 'Color:Label/Disabled' : LABEL[variant], 'Button Label');
    for (const n of dir === LTR ? [ic, lb] : [lb, ic]) r.appendChild(n);
  });
  comps.push(c);
}
const set = combine(comps, 'Button', root, 3);
const kLabel = set.addComponentProperty('Label', 'TEXT', 'Button');
const kShow = set.addComponentProperty('Leading Icon', 'BOOLEAN', false);
const kIcon = set.addComponentProperty('Icon', 'INSTANCE_SWAP', (await ICON('Check')).id, { preferredValues: await ICON_PREFERRED() });
for (const c of set.children) {
  for (const n of c.findAll(n => n.name === 'Button Label')) n.componentPropertyReferences = { characters: kLabel };
  for (const n of c.findAll(n => n.name === 'Leading Icon')) n.componentPropertyReferences = { visible: kShow, mainComponent: kIcon };
}
describe(set, 'Main action on a screen (Primary), alternative actions (Secondary), low emphasis or inline actions (Text).',
  'One Primary per screen. Label is a verb, sentence case, 1-3 words. Leading Icon only when it adds meaning. Use Text for actions in bars and dialogs. Platform look (height, radius, label style) comes from the OS mode, never from a separate component.',
  'Touch target at least 44x44 (iOS) / 48x48 (Android): the 40px Android button needs 4px extra hit area. Primary label on the yellow fill uses Label/On Accent (14.7:1); Text label uses Label/Accent (4.7:1 on white). Disabled is not announced as actionable.');
await preview(root, set);
return { set: set.id, variants: set.children.length };
