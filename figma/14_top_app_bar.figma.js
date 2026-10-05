const root = await docRoot('➜ Top App Bar', 'Top App Bar', 'Organism (Icon, Icon Button, text). The anatomy really differs: iOS Navigation Bar = text back button, centered title, optional large title row; Android Top App Bar = back arrow Icon Button, left title, 64 tall. Built as a private variant set "_Top App Bar Platform" (Platform=iOS|Android) and a published wrapper "Top App Bar" whose nested Platform property is bound to the string variable Platform/Name, so the right anatomy appears with the OS mode.');
const ib = await (async () => { const p = figma.root.children.find(x => x.name === '➜ Icon Button'); await p.loadAsync(); return p.findOne(n => n.type === 'COMPONENT' && n.name === 'Variant=Standard, State=Default'); })();
const ibIcon = (inst) => Object.keys(inst.componentProperties).find(k => k.startsWith('Icon'));
const mk = async (os) => {
  const c = figma.createComponent(); c.name = `Platform=${os}`;
  c.layoutMode = 'VERTICAL'; c.resize(375, 44); c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'FIXED'; fill(c, 'Component Specific:Top App Bar/Fill');
  const backIOS = async (dir) => { const b = AL('HORIZONTAL', 'Back Button', { counterAxisAlignItems: 'CENTER' }); bind(b, { itemSpacing: 'OS:Spacing/Tight' });
    const ic = await iconInst('Back', 'Color:Icon/Accent', 'Back Icon'), lb = await txt('Back', 'Body', 'Color:Label/Accent', 'Back Label');
    for (const n of dir === LTR ? [ic, lb] : [lb, ic]) b.appendChild(n); return b; };
  const action = (tint) => { const a = ib.createInstance(); a.name = 'Action'; if (tint) tintIcon(a, 'Color:Icon/Accent'); return a; };
  const backAndroid = async () => { const b = ib.createInstance(); b.name = 'Back Button'; b.setProperties({ [ibIcon(b)]: (await ICON('Back')).id }); return b; };
  // one bar per direction (Bar LTR / Bar RTL); Back and Action are hidden only by their properties
  await dirRows(c, 'Bar', {}, async (bar, dir) => {
    bar.layoutSizingHorizontal = 'FILL'; bar.counterAxisSizingMode = 'FIXED';
    bind(bar, { height: 'Component Specific:Top App Bar/Height' }); padX(bar, 'Component Specific:Top App Bar/Padding X');
    if (os === 'iOS') {
      // LTR: [Back][Title][Action]  RTL: [Action][Title][Back]; equal side containers keep the title centered
      const start = AL('HORIZONTAL', 'Start', { counterAxisAlignItems: 'CENTER' }), end = AL('HORIZONTAL', 'End', { counterAxisAlignItems: 'CENTER', primaryAxisAlignItems: 'MAX' });
      bar.appendChild(start); bar.appendChild(await txt('Title', 'Headline', 'Color:Label/Primary', 'Title')); bar.appendChild(end);
      start.layoutSizingHorizontal = 'FILL'; end.layoutSizingHorizontal = 'FILL';
      if (dir === LTR) { start.appendChild(await backIOS(LTR)); end.appendChild(action(true)); } else { start.appendChild(action(true)); end.appendChild(await backIOS(RTL)); }
    } else {
      // LTR: [Back][Title...][Action]  RTL: [Action][...Title][Back]
      const tw = AL('HORIZONTAL', 'Title Container', { counterAxisAlignItems: 'CENTER' });
      bind(tw, dir === LTR ? { paddingLeft: 'Component Specific:Top App Bar/Title Inset' } : { paddingRight: 'Component Specific:Top App Bar/Title Inset' });
      const t = rtlText(await txt('Title', 'Title', 'Color:Label/Primary', 'Title'), dir); tw.appendChild(t);
      for (const n of dir === LTR ? [await backAndroid(), tw, action()] : [action(), tw, await backAndroid()]) bar.appendChild(n);
      tw.layoutSizingHorizontal = 'FILL'; t.layoutSizingHorizontal = 'FILL';
    }
  });
  if (os === 'iOS') {
    const lt = AL('VERTICAL', 'Large Title Row', {}); c.appendChild(lt); lt.layoutSizingHorizontal = 'FILL';
    padX(lt, 'OS:Spacing/Screen Margin'); bind(lt, { paddingBottom: 'OS:Spacing/Stack Gap' });
    alignedText(lt, await txt('Title', 'Large Title', 'Color:Label/Primary', 'Large Title'), 'Large Title Text');
  }
  return c;
};
const priv = combine([await mk('iOS'), await mk('Android')], '_Top App Bar Platform', root, 2);
const P = {
  title: priv.addComponentProperty('Title', 'TEXT', 'Title'),
  back: priv.addComponentProperty('Show Back', 'BOOLEAN', true),
  backLabel: priv.addComponentProperty('Back Label', 'TEXT', 'Back'),
  action: priv.addComponentProperty('Show Action', 'BOOLEAN', true),
  large: priv.addComponentProperty('Large Title', 'BOOLEAN', false),
  inline: priv.addComponentProperty('Show Inline Title', 'BOOLEAN', true),
};
for (const c of priv.children) {
  for (const n of c.findAll(n => n.name === 'Title' || n.name === 'Large Title')) n.componentPropertyReferences = { characters: P.title };
  if (c.name === 'Platform=iOS') for (const n of c.findAll(n => n.name === 'Title')) n.componentPropertyReferences = { characters: P.title, visible: P.inline };
  for (const n of c.findAll(n => n.name === 'Back Button')) n.componentPropertyReferences = { visible: P.back };
  for (const n of c.findAll(n => n.name === 'Back Label')) n.componentPropertyReferences = { characters: P.backLabel };
  for (const a of c.findAll(n => n.name === 'Action' && n.type === 'INSTANCE')) { a.componentPropertyReferences = { visible: P.action }; a.isExposedInstance = true; }
  const lt = c.findOne(n => n.name === 'Large Title Row'); if (lt) lt.componentPropertyReferences = { visible: P.large };
}
describe(priv, 'Private: platform anatomies of Top App Bar. Do not use directly.', 'Use the Top App Bar wrapper; it picks the Platform variant from the OS mode.', 'See Top App Bar.');
// ---- wrapper
const w = figma.createComponent(); w.name = 'Top App Bar';
w.layoutMode = 'VERTICAL'; w.resize(375, 44); w.primaryAxisSizingMode = 'AUTO'; w.counterAxisSizingMode = 'FIXED'; w.fills = [];
const inner = priv.children.find(c => c.name === 'Platform=iOS').createInstance(); inner.name = 'Top App Bar Platform';
w.appendChild(inner); inner.layoutSizingHorizontal = 'FILL';
let bound = null, err = null;
try {
  const key = Object.keys(inner.componentProperties).find(k => k === 'Platform');
  inner.setProperties({ [key]: { type: 'VARIABLE_ALIAS', id: V('OS:Platform/Name').id } });
  bound = inner.componentProperties[key].boundVariables || null;
} catch (e) { err = e.message; }
inner.isExposedInstance = true;
root.appendChild(w);
describe(w, 'Top of every screen: title, back navigation and up to one action.',
  'Always use this wrapper (never the private set). Platform anatomy comes from the OS mode: iOS centered title with text back button and optional Large Title; Android left title with back arrow. Title 1-3 words. Show Action only for the screen\'s main secondary action.',
  'Back and Action targets are 44 iOS / 48 Android. Title uses Headline (iOS) / Title Large (Android) on Surface/Top Bar (contrast 15:1+). Back Label is announced as "Back" on iOS.');
await preview(root);
return { private: priv.id, wrapper: w.id, bound, err };
