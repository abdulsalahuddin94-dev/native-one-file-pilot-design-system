const root = await docRoot('➜ Toggle', 'Toggle', 'Atom. iOS switch and Material 3 switch in one component. Track and thumb sizes, thumb inset, track outline and thumb colors are OS tokens (iOS 51x31, thumb 27; Android 52x32, thumb 16 off / 24 on, 2px outline when off). Variants are only Value and State.');
const comps = [];
for (const val of ['On', 'Off']) for (const s of ['Default', 'Disabled']) {
  const on = val === 'On';
  const c = figma.createComponent(); c.name = `Value=${val}, State=${s}`;
  c.layoutMode = 'HORIZONTAL'; c.counterAxisAlignItems = 'CENTER';
  c.primaryAxisSizingMode = 'FIXED'; c.counterAxisSizingMode = 'FIXED'; c.resize(52, 32);
  bind(c, { width: 'Component Specific:Toggle/Track Width', height: 'Component Specific:Toggle/Track Height' }); radius(c, 'OS:Radius/Full');
  padX(c, on ? 'Component Specific:Toggle/Thumb Inset On' : 'Component Specific:Toggle/Thumb Inset Off');
  fill(c, on ? 'Color:Fill/Accent' : 'Color:Fill/Track Off');
  if (!on) { stroke(c, 'Component Specific:Toggle/Track Border Color', 'Component Specific:Toggle/Track Border'); c.strokeAlign = 'INSIDE'; }
  if (s === 'Disabled') bind(c, { opacity: 'OS:State/Disabled Opacity' });
  // Thumb side follows reading direction: On = end side (right in LTR, left in RTL), Off = start side.
  addSpacer(c, on ? LTR : RTL);
  const t = figma.createEllipse(); t.name = 'Thumb'; t.resize(24, 24); c.appendChild(t);
  addSpacer(c, on ? RTL : LTR);
  bind(t, { width: on ? 'Component Specific:Toggle/Thumb Size On' : 'Component Specific:Toggle/Thumb Size Off', height: on ? 'Component Specific:Toggle/Thumb Size On' : 'Component Specific:Toggle/Thumb Size Off' });
  fill(t, on ? 'Component Specific:Toggle/Thumb On' : 'Component Specific:Toggle/Thumb Off');
  comps.push(c);
}
const set = combine(comps, 'Toggle', root, 2);
describe(set, 'Turns a single setting on or off with immediate effect.',
  'Use in List Item trailing for settings that apply at once; use Checkbox for choices confirmed later or for multi-select. Never pair with a Save button. Label lives in the List Item title, not inside the toggle.',
  'Track meets the touch target only inside a List Item (44 iOS / 48 Android row). The yellow On track against white is 1.4:1, below the 3:1 non-text contrast guideline: state is also shown by thumb position, and Android adds a dark thumb (Fill/On Accent). Disabled uses State/Disabled Opacity.');
await preview(root, set, async (f) => { const r = AL('HORIZONTAL', 'Instances', { itemSpacing: 16, counterAxisAlignItems: 'CENTER' }); f.appendChild(r); for (const c of set.children) r.appendChild(c.createInstance()); });
return { set: set.id };
