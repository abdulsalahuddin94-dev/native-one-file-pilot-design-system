// Pilot prelude: prepended to every build script (run.sh). Names only, never raw values.
if (!figma.root.name.startsWith('Native One File Pilot')) throw new Error('Wrong file: ' + figma.root.name);
const _vars = await figma.variables.getLocalVariablesAsync();
const _cols = await figma.variables.getLocalVariableCollectionsAsync();
const COL = n => _cols.find(c => c.name === n);
const V = (path) => { const [c, n] = path.includes(':') ? path.split(':') : [null, path];
  const x = _vars.filter(y => y.name === n && (!c || y.variableCollectionId === COL(c).id));
  if (x.length !== 1) throw new Error('var ' + path + ' matches ' + x.length); return x[0]; };
const TS = {}; for (const s of await figma.getLocalTextStylesAsync()) TS[s.name] = s;
const ES = {}; for (const s of await figma.getLocalEffectStylesAsync()) ES[s.name] = s;
for (const s of ['Regular','Medium','Semibold','Bold']) await figma.loadFontAsync({ family: 'SF Pro', style: s });
for (const f of ['Roboto','Noto Sans Arabic']) for (const s of ['Regular','Medium','SemiBold','Bold']) await figma.loadFontAsync({ family: f, style: s });
const paint = (varPath) => figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', V(varPath));
const fill = (n, p) => { n.fills = p ? [paint(p)] : []; return n; };
const stroke = (n, p, w) => { n.strokes = [paint(p)]; if (typeof w === 'string') n.setBoundVariable('strokeWeight', V(w)); else n.strokeWeight = w || 1; return n; };
const bind = (n, map) => { for (const [k, p] of Object.entries(map)) n.setBoundVariable(k, V(p)); return n; };
const modes = (n, m) => { for (const [c, name] of Object.entries(m)) { const col = COL(c); n.setExplicitVariableModeForCollection(col, col.modes.find(x => x.name === name).modeId); } return n; };
const txt = async (chars, style, color, name) => { const t = figma.createText(); await t.setTextStyleIdAsync(TS[style].id); t.characters = chars; fill(t, color); t.name = name || chars; return t; };
const AL = (dir, name, o = {}) => { const f = figma.createFrame(); f.name = name; f.layoutMode = dir; f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO'; f.fills = []; f.clipsContent = false; Object.assign(f, o); return f; };
const page = async (name) => { const p = figma.root.children.find(x => x.name === name); await figma.setCurrentPageAsync(p); return p; };
// Sections are Abdul's own work on a page: never removed by a rebuild.
const clearPage = (p) => { for (const c of [...p.children]) if (c.type !== 'SECTION') c.remove(); };
// ---- component helpers ----
const docRoot = async (pageName, title, desc) => {
  const p = await page(pageName); clearPage(p);
  const root = AL('VERTICAL', title, { itemSpacing: 32, paddingTop: 48, paddingLeft: 48, paddingRight: 48, paddingBottom: 48 });
  fill(root, 'Color:Background/Primary'); p.appendChild(root);
  root.appendChild(await txt(title, 'Large Title', 'Color:Label/Primary', 'Page Title'));
  const d = await txt(desc, 'Body', 'Color:Label/Secondary', 'Page Description'); root.appendChild(d); d.resize(1100, d.height); d.textAutoResize = 'HEIGHT';
  return root;
};
let _icons = null;
const ICONS = async () => { if (!_icons) { const p = figma.root.children.find(x => x.name === '➜ Icons'); await p.loadAsync(); _icons = p.findAllWithCriteria({ types: ['COMPONENT'] }).filter(n => n.name.startsWith('Icon/')); } return _icons; };
const ICON = async (name) => { const c = (await ICONS()).find(n => n.name === 'Icon/' + name); if (!c) throw new Error('Icon ' + name); return c; };
const ICON_PREFERRED = async () => (await ICONS()).map(n => ({ type: 'COMPONENT', key: n.key }));
const tintIcon = (inst, colorVar) => { for (const v of inst.findAll(n => n.type === 'VECTOR' || n.type === 'BOOLEAN_OPERATION')) fill(v, colorVar); return inst; };
const iconInst = async (name, colorVar, layerName) => { const i = (await ICON(name)).createInstance(); i.name = layerName || 'Icon'; if (colorVar) tintIcon(i, colorVar); return i; };
const radius = (n, varPath) => bind(n, { topLeftRadius: varPath, topRightRadius: varPath, bottomLeftRadius: varPath, bottomRightRadius: varPath });
const padX = (n, varPath) => bind(n, { paddingLeft: varPath, paddingRight: varPath });
const padY = (n, varPath) => bind(n, { paddingTop: varPath, paddingBottom: varPath });
const combine = (comps, name, root, cols) => {
  for (const c of comps) sealDirs(c);
  const set = figma.combineAsVariants(comps, root); set.name = name;
  set.layoutMode = 'HORIZONTAL'; set.layoutWrap = 'WRAP'; set.itemSpacing = 24; set.counterAxisSpacing = 24;
  set.paddingTop = set.paddingBottom = set.paddingLeft = set.paddingRight = 24; set.primaryAxisSizingMode = 'FIXED'; set.counterAxisSizingMode = 'AUTO';
  set.fills = []; stroke(set, 'Color:Border/Default', 1); set.dashPattern = [6, 4]; set.cornerRadius = 12;
  const w = Math.max(...comps.map(c => c.width)); set.resize(48 + cols * w + (cols - 1) * 24 + 2, 100); set.counterAxisSizingMode = 'AUTO';
  return set;
};
// Component pages show only the main component/set (Abdul, 2026-10-05); all mode demos live on ⭐Setup > ➜ Platform Preview.
const preview = async () => null;
const _previewOld = async (root, set, build) => {
  const sec = AL('VERTICAL', 'Preview (instances)', { itemSpacing: 16 }); root.appendChild(sec);
  sec.appendChild(await txt('Preview (instances, not components): the same component placed in frames that only change the OS and Color modes', 'Headline', 'Color:Label/Primary', 'Section Title'));
  const row = AL('HORIZONTAL', 'Modes', { itemSpacing: 24 }); sec.appendChild(row);
  for (const os of ['iOS', 'Android']) for (const m of ['Light', 'Dark']) {
    const f = AL('VERTICAL', 'Preview · ' + os + ' · ' + m, { itemSpacing: 16, paddingTop: 20, paddingLeft: 20, paddingRight: 20, paddingBottom: 20 });
    fill(f, 'OS:Surface/Screen'); stroke(f, 'Color:Border/Default', 1); f.cornerRadius = 12; modes(f, { OS: os, Color: m }); row.appendChild(f);
    f.appendChild(await txt(os + ' · ' + m, 'Caption', 'Color:Label/Secondary', 'Preview Label'));
    if (build) await build(f, os, m);
    else { const w = AL('VERTICAL', 'Instances', { itemSpacing: 12 }); f.appendChild(w); for (const c of set.children) { const i = c.createInstance(); w.appendChild(i); } }
  }
  return sec;
};
const describe = (n, purpose, rules, a11y) => { n.description = `Purpose: ${purpose}\nUsage Rules: ${rules}\nAccessibility: ${a11y}`; };
// ---- direction (RTL) helpers: Figma cannot bind layout direction or text alignment, so edge elements get an
// LTR wrapper and an RTL wrapper (visibility bound to Language:Direction/Is LTR|RTL) and text is aligned by spacers.
const LTR = 'Language:Direction/Is LTR', RTL = 'Language:Direction/Is RTL';
// A frame hidden before its children are added never computes its hug size (it stays 100x100 when shown by a mode
// change), so dirBox only records the direction; sealDirs (called by combine) binds it once the content is in.
const dirBox = (name, dirVar, o = {}) => { const w = AL('HORIZONTAL', name, Object.assign({ counterAxisAlignItems: 'CENTER' }, o)); w.setSharedPluginData('pilot', 'dir', dirVar); return w; };
const sealDirs = (node) => { for (const n of [node, ...(node.findAll ? node.findAll(x => !!x.getSharedPluginData('pilot', 'dir')) : [])]) { const d = n.getSharedPluginData('pilot', 'dir'); if (d) { n.setBoundVariable('visible', V(d)); n.setSharedPluginData('pilot', 'dir', ''); } } return node; };
// empty auto layout frame used as a spacer or inset (auto layout so the audit has no exceptions)
const blank = (name) => { const f = figma.createFrame(); f.name = name || 'Spacer'; f.fills = []; f.layoutMode = 'HORIZONTAL'; f.primaryAxisSizingMode = 'FIXED'; f.counterAxisSizingMode = 'FIXED'; f.resize(1, 1); return f; };
const addSpacer = (parent, dirVar) => { const s = blank(); s.name = dirVar === RTL ? 'Spacer RTL' : 'Spacer LTR'; s.fills = []; s.resize(1, 1);
  s.setBoundVariable('visible', V(dirVar)); parent.appendChild(s); s.layoutSizingHorizontal = 'FILL'; return s; };
const alignedText = (parent, t, name) => { const row = AL('HORIZONTAL', name, {}); parent.appendChild(row); row.layoutSizingHorizontal = 'FILL';
  addSpacer(row, RTL); row.appendChild(t); addSpacer(row, LTR); return row; };
// Figma keeps a hug frame's size when all its children are hidden, so never wrap a single toggled element. Where the
// order flips with direction, build two sibling rows (LTR, RTL) bound to Direction/Is LTR|RTL; elements inside bind
// one condition directly; RTL rows reverse the order and right-align their text statically.
const dirRows = async (parent, name, o, build) => {
  const rows = [];
  for (const dir of [LTR, RTL]) {
    const r = AL('HORIZONTAL', name + (dir === LTR ? ' LTR' : ' RTL'), Object.assign({ counterAxisAlignItems: 'CENTER' }, o || {}));
    parent.appendChild(r); await build(r, dir); r.setBoundVariable('visible', V(dir)); rows.push(r);
  }
  return rows;
};
const rtlText = (t, dir) => { if (dir === RTL) t.textAlignHorizontal = 'RIGHT'; return t; };
