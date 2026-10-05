// ⭐Setup > ➜ Platform Preview: every component as INSTANCES in frames that only change the OS, Color and Language modes.
// Component pages show only the main component/set (Abdul, 2026-10-05). Nothing here is a component.
const comp = async (pageName, name) => { const p = figma.root.children.find(x => x.name === pageName); await p.loadAsync(); const n = p.findOne(x => (x.type === 'COMPONENT' || x.type === 'COMPONENT_SET') && x.name === name); if (!n) throw new Error(name); return n; };
const v = (set, name) => { const c = set.children.find(c => c.name === name); if (!c) throw new Error(set.name + ' ' + name); return c; };
const root = await docRoot('➜ Platform Preview', 'Platform Preview', 'Instances only, never components. Each component of the file is placed once per frame; the frames change only the OS (iOS / Android), Color (Light / Dark) and Language (EN / AR) modes. There are no platform, Light/Dark or direction variants and no hard-coded colors: everything you see changes through variables.');
const AR = { 'Button': 'زر', 'Title': 'العنوان', 'Day': 'يوم', 'Week': 'أسبوع', 'Month': 'شهر', 'Year': 'سنة', 'Display name': 'الاسم المعروض', 'Abdul': 'عبدالرحمن', 'Shown on your profile': 'يظهر في ملفك الشخصي', 'Supporting text': 'نص توضيحي', 'English': 'العربية', 'Back': 'رجوع' };
const ITEMS = [
  ['Button', await comp('➜ Button', 'Button'), ['Variant=Primary, State=Default', 'Variant=Secondary, State=Default', 'Variant=Text, State=Default']],
  ['Icon Button', await comp('➜ Icon Button', 'Icon Button'), ['Variant=Standard, State=Default', 'Variant=Filled, State=Default']],
  ['Toggle', await comp('➜ Toggle', 'Toggle'), ['Value=On, State=Default', 'Value=Off, State=Default']],
  ['Checkbox', await comp('➜ Checkbox', 'Checkbox'), ['Value=Checked, State=Default', 'Value=Unchecked, State=Default']],
  ['Segmented Control', await comp('➜ Segmented Control', 'Segmented Control'), null],
  ['Text Field', await comp('➜ Text Field', 'Text Field'), ['State=Default', 'State=Focused']],
  ['List Item', await comp('➜ List Item', 'List Item'), ['Trailing=Chevron', 'Trailing=Value', 'Trailing=Toggle']],
  ['Top App Bar', await comp('➜ Top App Bar', 'Top App Bar'), null],
];
const MODES = [['iOS', 'Light', 'EN'], ['Android', 'Light', 'EN'], ['iOS', 'Dark', 'EN'], ['Android', 'Dark', 'EN'], ['iOS', 'Light', 'AR'], ['Android', 'Light', 'AR']];
const wide = new Set(['Segmented Control', 'Text Field', 'List Item', 'Top App Bar']);
for (const [name, set, variants] of ITEMS) {
  const sec = AL('VERTICAL', name + ' Preview', { itemSpacing: 12 }); root.appendChild(sec);
  sec.appendChild(await txt(name, 'Title', 'Color:Label/Primary', 'Section Title'));
  const row = AL('HORIZONTAL', 'Mode Frames', { itemSpacing: 24 }); sec.appendChild(row);
  for (const [os, m, lang] of MODES) {
    const f = AL('VERTICAL', os + ' · ' + m + ' · ' + lang, { itemSpacing: 12, paddingTop: 16, paddingBottom: 16, paddingLeft: 16, paddingRight: 16, counterAxisSizingMode: 'FIXED' });
    f.resize(wide.has(name) ? 375 : 260, 100); f.counterAxisSizingMode = 'FIXED'; f.primaryAxisSizingMode = 'AUTO';
    fill(f, 'OS:Surface/Screen'); stroke(f, 'Color:Border/Default', 1); f.cornerRadius = 12; modes(f, { OS: os, Color: m, Language: lang }); row.appendChild(f);
    f.appendChild(await txt(os + ' · ' + m + ' · ' + lang, 'Caption', 'Color:Label/Secondary', 'Frame Label'));
    const list = AL('VERTICAL', 'Instances', { itemSpacing: 12, counterAxisAlignItems: lang === 'AR' ? 'MAX' : 'MIN' }); f.appendChild(list); list.layoutSizingHorizontal = 'FILL';
    const srcs = variants ? variants.map(n => v(set, n)) : [set];
    for (const s of srcs) { const i = s.createInstance(); list.appendChild(i); if (wide.has(name)) i.layoutSizingHorizontal = 'FILL';
      if (lang === 'AR') for (const t of i.findAll(n => n.type === 'TEXT')) if (AR[t.characters]) t.characters = AR[t.characters]; }
  }
}
// confirm: no Light/Dark or platform variants, no raw colors on component pages
const bad = { variantProps: [], rawFills: 0 };
for (const p of figma.root.children) { await p.loadAsync();
  for (const s of p.findAllWithCriteria({ types: ['COMPONENT_SET'] })) for (const k of Object.keys(s.componentPropertyDefinitions)) if (/mode|theme|light|dark|platform|os|direction|rtl/i.test(k) && s.name !== '_Top App Bar Platform') bad.variantProps.push(s.name + ':' + k);
  for (const n of p.findAll(n => 'fills' in n && Array.isArray(n.fills))) for (const f of n.fills) if (f.type === 'SOLID' && f.visible !== false && !(f.boundVariables && f.boundVariables.color) && !(n.type === 'FRAME' && f.opacity === 0)) bad.rawFills++;
}
return bad;
