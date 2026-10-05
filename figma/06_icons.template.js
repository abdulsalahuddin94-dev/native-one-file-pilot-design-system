const ICON_DATA = __ICONS__;
const p = await page('➜ Icons'); clearPage(p);
const root = AL('VERTICAL', 'Icons', { itemSpacing: 32, paddingTop: 48, paddingLeft: 48, paddingRight: 48, paddingBottom: 48 });
fill(root, 'Color:Background/Primary');
root.appendChild(await txt('Icons', 'Large Title', 'Color:Label/Primary', 'Page Title'));
const d = await txt('One Icon component per meaning. Each holds an SF Symbol-style layer (Framework7, visible on iOS) and a Material Symbol layer (visible on Android); visibility is bound to Platform/Is iOS and Platform/Is Android. Size is bound to Size/Icon (22 on iOS, 24 on Android): SF glyphs fill their box, Material glyphs keep a 2px box padding, so both read about 20px.', 'Body', 'Color:Label/Secondary', 'Page Description');
root.appendChild(d); d.resize(1100, d.height); d.textAutoResize = 'HEIGHT';
const set = AL('HORIZONTAL', 'Icon Components', { itemSpacing: 24, paddingTop: 24, paddingLeft: 24, paddingRight: 24, paddingBottom: 24 });
root.appendChild(set);
const ids = {};
const glyph = (svg, name, visVar) => {
  const g = figma.createNodeFromSvg(svg); g.name = name; g.fills = [];
  for (const n of g.findAll(x => 'fills' in x && x.type !== 'FRAME')) { fill(n, 'Color:Icon/Primary'); n.constraints = { horizontal: 'SCALE', vertical: 'SCALE' }; }
  return g;
};
for (const [name, ic] of Object.entries(ICON_DATA)) {
  const c = figma.createComponent(); c.name = 'Icon/' + name; c.fills = [];
  c.layoutMode = 'HORIZONTAL'; c.primaryAxisSizingMode = 'FIXED'; c.counterAxisSizingMode = 'FIXED'; c.resize(24, 24);
  bind(c, { width: 'Component Specific:Icon/Size', height: 'Component Specific:Icon/Size' });
  // Each glyph is stored at its own platform size (SF 22, Material 24) and its visibility is bound BEFORE it joins the
  // auto layout, so the hidden one never shares (and distorts) the other's space.
  // Directional icons (chevron, back) hold an LTR and an RTL glyph inside each platform layer (nesting = AND of two bindings).
  const pair = (svgL, svgR, name, size) => {
    if (!svgR) { const g = glyph(svgL, name); g.rescale(size / g.width); return g; }
    const box = figma.createFrame(); box.name = name; box.fills = []; box.layoutMode = 'HORIZONTAL'; box.resize(size, size);
    box.primaryAxisSizingMode = 'FIXED'; box.counterAxisSizingMode = 'FIXED';
    for (const [svg, dir, nm] of [[svgL, LTR, 'LTR Glyph'], [svgR, RTL, 'RTL Glyph']]) {
      const g = glyph(svg, nm); g.rescale(size / g.width); g.setBoundVariable('visible', V(dir));
      box.appendChild(g); g.layoutSizingHorizontal = 'FILL'; g.layoutSizingVertical = 'FILL';
    }
    return box;
  };
  const sf = pair(ic.ios, ic.ios_rtl, 'SF Symbol', 22);
  const md = pair(ic.android, ic.android_rtl, 'Material Symbol', 24);
  for (const [g, v] of [[sf, 'OS:Platform/Is iOS'], [md, 'OS:Platform/Is Android']]) {
    g.setBoundVariable('visible', V(v)); c.appendChild(g); g.layoutSizingHorizontal = 'FILL'; g.layoutSizingVertical = 'FILL';
  }
  c.description = `Purpose: ${name} icon, one meaning for both platforms.\nUsage Rules: use as an instance (swap through Icon properties). Color comes from Icon tokens (Icon/Primary by default); override only with another Icon token. Size follows Size/Icon (iOS 22, Android 24).\nSources: iOS layer ${ic.ios_id} (SF Symbols style), Android layer ${ic.android_id}.${ic.ios_rtl ? ' Directional: holds an RTL glyph per platform that shows when Language is AR (Direction/Is RTL).' : ''}\nAccessibility: decorative unless it is the only content of a control; then the control carries the label. Minimum touch target comes from the parent control (44 iOS / 48 Android).`;
  set.appendChild(c); ids[name] = c.id;
}
return { ids, root: root.id };
