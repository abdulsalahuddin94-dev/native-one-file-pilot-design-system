// read-only
// Pilot audit (all pages): unbound paints/spacing/radius, text without style, default layer names,
// frames without auto layout (outside icon glyphs), bindings straight to Primitives, local styles count.
const vars = await figma.variables.getLocalVariablesAsync();
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const colOf = Object.fromEntries(vars.map(v => [v.id, cols.find(c => c.id === v.variableCollectionId).name]));
const PAD = ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'itemSpacing'];
const RAD = ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius'];
const DEFAULT = /^(Frame|Rectangle|Ellipse|Group|Vector|Text|Line|Polygon|Star|Component)( \d+)?$/;
const out = { pages: {}, totals: { nodes: 0, components: 0, instances: 0, unboundPaint: 0, unboundSpacing: 0, unboundRadius: 0, textNoStyle: 0, defaultNames: 0, noAutoLayout: 0, primitiveBindings: 0 }, samples: [] };
const note = (k, n, why) => { out.totals[k]++; if (out.samples.length < 40) out.samples.push(k + ': ' + n.name + ' (' + n.id + ') ' + (why || '')); };
function walk(n, inComp, inGlyph) {
  out.totals.nodes++;
  if (n.type === 'COMPONENT') out.totals.components++;
  if (n.type === 'INSTANCE') { out.totals.instances++; }
  const glyph = inGlyph || n.name === 'SF Symbol' || n.name === 'Material Symbol';
  const bv = n.boundVariables || {};
  for (const ids of Object.values(bv)) for (const a of [].concat(ids)) if (a && a.id && colOf[a.id] === 'Primitives') note('primitiveBindings', n);
  const doc = !inComp; // doc frames on pages: only check component internals for values
  if (inComp && n.type !== 'INSTANCE') {
    for (const key of ['fills', 'strokes']) {
      const ps = n[key]; if (!Array.isArray(ps)) continue;
      ps.forEach(p => { if (p.type === 'SOLID' && p.visible !== false && !(p.boundVariables && p.boundVariables.color)) note('unboundPaint', n, key); });
    }
    if ('layoutMode' in n && n.layoutMode !== 'NONE') for (const k of PAD) if (n[k] && !bv[k]) note('unboundSpacing', n, k + '=' + n[k]);
    if ('topLeftRadius' in n && !glyph) for (const k of RAD) if (n[k] && !bv[k]) { note('unboundRadius', n, k + '=' + n[k]); break; }
    if (n.type === 'TEXT' && !n.textStyleId) note('textNoStyle', n);
    if ((n.type === 'FRAME' || n.type === 'COMPONENT') && n.layoutMode === 'NONE' && !glyph) note('noAutoLayout', n);
  }
  if (DEFAULT.test(n.name) && !glyph) note('defaultNames', n);
  if (n.type === 'INSTANCE') return; // nested components are audited at their source
  if ('children' in n) for (const c of n.children) walk(c, inComp || n.type === 'COMPONENT' || n.type === 'COMPONENT_SET', glyph);
}
for (const p of figma.root.children) {
  await p.loadAsync();
  const before = JSON.stringify(out.totals);
  for (const c of p.children) walk(c, false, false);
  out.pages[p.name] = p.children.length;
}
out.styles = { text: (await figma.getLocalTextStylesAsync()).length, effect: (await figma.getLocalEffectStylesAsync()).length, paint: (await figma.getLocalPaintStylesAsync()).length };
out.variables = Object.fromEntries(cols.map(c => [c.name, c.variableIds.length]));
return out;
