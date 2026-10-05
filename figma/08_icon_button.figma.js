const root = await docRoot('➜ Icon Button', 'Icon Button', 'Atom. A single icon as a button. Size from Height/Icon Button (iOS 44, Android 48 = the minimum touch target on each platform), radius from Radius/Full. Same anatomy on both platforms.');
const FILL = { Standard: [null, 'Color:Fill/Secondary'], Filled: ['Color:Fill/Accent', 'Color:Fill/Accent Pressed'] };
const ICONC = { Standard: 'Color:Icon/Primary', Filled: 'Color:Icon/On Accent' };
const comps = [];
for (const v of ['Standard', 'Filled']) for (const s of ['Default', 'Pressed', 'Disabled']) {
  const c = figma.createComponent(); c.name = `Variant=${v}, State=${s}`;
  c.layoutMode = 'HORIZONTAL'; c.primaryAxisAlignItems = 'CENTER'; c.counterAxisAlignItems = 'CENTER';
  c.primaryAxisSizingMode = 'FIXED'; c.counterAxisSizingMode = 'FIXED'; c.resize(44, 44);
  bind(c, { width: 'Component Specific:Icon Button/Size', height: 'Component Specific:Icon Button/Size' }); radius(c, 'OS:Radius/Full');
  fill(c, FILL[v][s === 'Pressed' ? 1 : 0]);
  if (s === 'Disabled') bind(c, { opacity: 'OS:State/Disabled Opacity' });
  c.appendChild(await iconInst('Settings', ICONC[v], 'Icon'));
  comps.push(c);
}
const set = combine(comps, 'Icon Button', root, 3);
const kIcon = set.addComponentProperty('Icon', 'INSTANCE_SWAP', (await ICON('Settings')).id, { preferredValues: await ICON_PREFERRED() });
for (const c of set.children) c.findOne(n => n.name === 'Icon').componentPropertyReferences = { mainComponent: kIcon };
describe(set, 'Compact action shown only as an icon (toolbar and top bar actions, close, search).',
  'Use only for icons whose meaning is universal (search, close, settings, back); otherwise use Button with a label. Standard in bars, Filled for one prominent floating action. Swap the icon through the Icon property, never detach.',
  'Size equals the platform touch target (44 iOS / 48 Android). Needs an accessibility label in code (the icon has no text). Disabled uses State/Disabled Opacity (0.4 iOS / 0.38 Android).');
await preview(root, set, async (f) => { const r = AL('HORIZONTAL', 'Instances', { itemSpacing: 8, layoutWrap: 'WRAP' }); f.appendChild(r); for (const c of set.children) r.appendChild(c.createInstance()); });
return { set: set.id };
