// read-only. audit-design-system drift checks on screens and previews: detached copies, overrides with raw values,
// instances of missing (deleted) main components, instance count per DS component.
const compNames = new Set(); const out = { detached: [], rawOverrides: [], missingMain: [], instances: 0 };
for (const p of figma.root.children) { await p.loadAsync(); for (const c of p.findAllWithCriteria({ types: ['COMPONENT', 'COMPONENT_SET'] })) compNames.add(c.name); }
for (const pn of ['➜ Settings', '➜ Platform Preview']) {
  const p = figma.root.children.find(x => x.name === pn);
  for (const i of p.findAllWithCriteria({ types: ['INSTANCE'] })) { out.instances++;
    const mc = await i.getMainComponentAsync(); if (!mc || mc.removed) out.missingMain.push(pn + ': ' + i.name);
    for (const o of i.overrides || []) for (const f of o.overriddenFields) if (['fills', 'strokes'].includes(f)) {
      const n = await figma.getNodeByIdAsync(o.id); const ps = n && n[f]; if (Array.isArray(ps) && ps.some(x => x.type === 'SOLID' && !(x.boundVariables && x.boundVariables.color))) out.rawOverrides.push(pn + ': ' + n.name); } }
  for (const f of p.findAll(n => n.type === 'FRAME' && compNames.has(n.name))) { let a = f.parent, inI = false; while (a && a.type !== 'PAGE') { if (a.type === 'INSTANCE' || a.type === 'COMPONENT') inI = true; a = a.parent; } if (!inI) out.detached.push(pn + ': ' + f.name); }
}
return out;
