const comp = async (pageName, name) => { const p = figma.root.children.find(x => x.name === pageName); await p.loadAsync(); const n = p.findOne(x => (x.type === 'COMPONENT' || x.type === 'COMPONENT_SET') && x.name === name); if (!n) throw new Error(name); return n; };
const variant = (set, name) => set.children.find(c => c.name === name);
const prop = (inst, start) => Object.keys(inst.componentProperties).find(k => k.split('#')[0] === start);
const setP = (inst, map) => { const o = {}; for (const [k, v] of Object.entries(map)) { const key = prop(inst, k); if (!key) throw new Error('prop ' + k + ' on ' + inst.name); o[key] = v; } inst.setProperties(o); return inst; };
const TAB = await comp('➜ Top App Bar', 'Top App Bar'), TF = await comp('➜ Text Field', 'Text Field'), SC = await comp('➜ Segmented Control', 'Segmented Control');
const LI = await comp('➜ List Item', 'List Item'), BTN = await comp('➜ Button', 'Button');
const root = await docRoot('➜ Settings', 'Settings Screen', 'Pattern. Built once as the "Pattern/Settings Screen" component from DS instances only, then shown in frames that change only the OS, Color and Language modes. Arabic frames override texts only: the layout mirrors through the Language mode (Direction/Is LTR|RTL), with no direction variants.');
// ---- the screen, built once
const s = figma.createComponent(); s.name = 'Pattern/Settings Screen';
s.layoutMode = 'VERTICAL'; s.resize(375, 812); s.primaryAxisSizingMode = 'FIXED'; s.counterAxisSizingMode = 'FIXED'; s.clipsContent = true;
fill(s, 'OS:Surface/Screen');
const bar = TAB.createInstance(); bar.name = 'Top App Bar'; s.appendChild(bar); bar.layoutSizingHorizontal = 'FILL';
setP(bar.children[0], { 'Title': 'Settings', 'Show Back': false, 'Show Action': false, 'Large Title': true, 'Show Inline Title': false });
const body = AL('VERTICAL', 'Content', {}); s.appendChild(body); body.layoutSizingHorizontal = 'FILL';
bind(body, { itemSpacing: 'OS:Spacing/Section Gap', paddingTop: 'OS:Spacing/Stack Gap', paddingBottom: 'OS:Spacing/Section Gap' });
const pad = AL('VERTICAL', 'Profile Section', {}); body.appendChild(pad); pad.layoutSizingHorizontal = 'FILL';
padX(pad, 'OS:Spacing/Screen Margin'); bind(pad, { itemSpacing: 'OS:Spacing/Section Gap' });
const tf = variant(TF, 'State=Default').createInstance(); tf.name = 'Display Name Field'; pad.appendChild(tf); tf.layoutSizingHorizontal = 'FILL';
setP(tf, { 'Label': 'Display name', 'Value': 'Abdul', 'Helper Text': 'Shown on your profile', 'Leading Icon': true });
const sc = SC.createInstance(); sc.name = 'Appearance Control'; pad.appendChild(sc); sc.layoutSizingHorizontal = 'FILL';
const segLabels = ['Light', 'Dark', 'Auto'];
for (const row of sc.children) for (const seg of row.children) { const k = +seg.name.split(' ').pop(); if (k <= 3) setP(seg, { 'Label': segLabels[k - 1] }); }
const group = async (title, rows) => {
  const g = AL('VERTICAL', title + ' Section', {}); body.appendChild(g); g.layoutSizingHorizontal = 'FILL'; bind(g, { itemSpacing: 'OS:Spacing/Stack Gap' });
  const h = alignedText(g, await txt(title, 'Footnote', 'Color:Label/Secondary', 'Section Title'), 'Section Header'); padX(h, 'Component Specific:List Item/Padding X');
  const wrap = AL('VERTICAL', 'List Group Inset', {}); g.appendChild(wrap); wrap.layoutSizingHorizontal = 'FILL'; padX(wrap, 'Component Specific:List Group/Inset');
  const list = AL('VERTICAL', 'List Group', { clipsContent: true }); wrap.appendChild(list); list.layoutSizingHorizontal = 'FILL'; radius(list, 'Component Specific:List Group/Radius');
  for (const [i, r] of rows.entries()) {
    const it = variant(LI, 'Trailing=' + r.t).createInstance(); it.name = r.title; list.appendChild(it); it.layoutSizingHorizontal = 'FILL';
    const p = { 'Title': r.title, 'Leading Icon Swap': (await ICON(r.icon)).id, 'Show Separator': i < rows.length - 1 };
    if (r.v) p['Value'] = r.v;
    setP(it, p);
    if (r.off) for (const tg of it.findAll(n => n.name === 'Toggle' && n.type === 'INSTANCE')) setP(tg, { 'Value': 'Off' });
  }
};
await group('Preferences', [{ t: 'Toggle', title: 'Notifications', icon: 'Notifications' }, { t: 'Toggle', title: 'Dark mode', icon: 'Moon', off: true }, { t: 'Value', title: 'Language', icon: 'Globe', v: 'English' }]);
await group('Account', [{ t: 'Chevron', title: 'Profile', icon: 'Person' }, { t: 'Chevron', title: 'Privacy', icon: 'Lock' }]);
const bw = AL('VERTICAL', 'Actions', {}); body.appendChild(bw); bw.layoutSizingHorizontal = 'FILL'; padX(bw, 'OS:Spacing/Screen Margin');
const btn = variant(BTN, 'Variant=Primary, State=Default').createInstance(); btn.name = 'Save Button'; bw.appendChild(btn); btn.layoutSizingHorizontal = 'FILL';
setP(btn, { 'Label': 'Save changes' });
describe(s, 'Reference Settings screen for the one-file native method: the same screen renders as iOS or Android through the OS mode.', 'Build screens from DS instances only. Set OS, Color and Language modes on the screen frame; never detach to fake a platform.', 'Touch targets and contrast come from the components.');
root.appendChild(s);
// ---- side by side
const row = AL('HORIZONTAL', 'Mode Matrix', { itemSpacing: 32 }); root.appendChild(row);
const AR = { 'Settings': 'الإعدادات', 'Display name': 'الاسم المعروض', 'Abdul': 'عبدالرحمن', 'Shown on your profile': 'يظهر في ملفك الشخصي', 'Light': 'فاتح', 'Dark': 'داكن', 'Auto': 'تلقائي', 'Preferences': 'التفضيلات', 'Notifications': 'الإشعارات', 'Dark mode': 'الوضع الداكن', 'Language': 'اللغة', 'English': 'العربية', 'Account': 'الحساب', 'Profile': 'الملف الشخصي', 'Privacy': 'الخصوصية', 'Save changes': 'حفظ التغييرات' };
for (const [os, m, lang] of [['iOS', 'Light', 'EN'], ['Android', 'Light', 'EN'], ['iOS', 'Dark', 'EN'], ['Android', 'Dark', 'EN'], ['iOS', 'Light', 'AR'], ['Android', 'Light', 'AR']]) {
  const label = os + ' · ' + m + ' · ' + lang;
  const col = AL('VERTICAL', label, { itemSpacing: 12 }); row.appendChild(col);
  col.appendChild(await txt(label, 'Headline', 'Color:Label/Primary', 'Frame Label'));
  const i = s.createInstance(); i.name = 'Settings Screen'; col.appendChild(i); modes(i, { OS: os, Color: m, Language: lang });
  if (lang === 'AR') for (const t of i.findAll(n => n.type === 'TEXT')) if (AR[t.characters]) t.characters = AR[t.characters];
}
return { screen: s.id };
