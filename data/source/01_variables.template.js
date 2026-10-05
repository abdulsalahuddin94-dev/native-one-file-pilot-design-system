// Pilot variables: Primitives, Color (Light/Dark), Language (EN/AR), OS (iOS/Android). Idempotent: updates by name.
const SPEC = __SPEC__;
if (!figma.root.name.startsWith('Native One File Pilot')) throw new Error('Wrong file: ' + figma.root.name);
const hex = (h, a) => { h = h.replace('#', ''); return { r: parseInt(h.slice(0, 2), 16) / 255, g: parseInt(h.slice(2, 4), 16) / 255, b: parseInt(h.slice(4, 6), 16) / 255, a: a === undefined ? 1 : a }; };
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const all = await figma.variables.getLocalVariablesAsync();
const C = {}, V = {};
// pass 1: collections, modes, variables
for (const c of SPEC.collections) {
  let col = cols.find(x => x.name === c.name);
  if (!col) col = figma.variables.createVariableCollection(c.name);
  c.modes.forEach((m, i) => {
    if (col.modes[i]) { if (col.modes[i].name !== m) col.renameMode(col.modes[i].modeId, m); }
    else col.addMode(m);
  });
  C[c.name] = col;
  for (const v of c.vars) {
    let vv = all.find(x => x.name === v.name && x.variableCollectionId === col.id);
    if (!vv) vv = figma.variables.createVariable(v.name, col, v.type);
    V[c.name + ':' + v.name] = vv;
  }
}
// pass 2: values, scopes, code syntax
let n = 0; const errors = [];
for (const c of SPEC.collections) {
  const col = C[c.name];
  for (const v of c.vars) {
    const vv = V[c.name + ':' + v.name];
    for (const m of col.modes) {
      let val = v.modes[m.name];
      try {
        if (typeof val === 'string' && val.startsWith('@')) {
          const t = V[val.slice(1)];
          if (!t) throw new Error('alias target missing ' + val);
          vv.setValueForMode(m.modeId, { type: 'VARIABLE_ALIAS', id: t.id });
        } else if (v.type === 'COLOR') vv.setValueForMode(m.modeId, hex(val, v.alpha));
        else vv.setValueForMode(m.modeId, val);
      } catch (e) { errors.push(v.name + ' ' + m.name + ': ' + e.message); }
    }
    try { vv.scopes = v.scopes; } catch (e) { if (v.scopes.length) errors.push(v.name + " scopes: " + e.message); }
    for (const [p, s] of Object.entries(v.code || {})) if (s && s !== '-') vv.setVariableCodeSyntax(p, s);
    n++;
  }
}
return { file: figma.root.name, variables: n, collections: Object.fromEntries(Object.entries(C).map(([k, c]) => [k, { id: c.id, modes: c.modes.map(m => m.name), count: c.variableIds.length }])), errors };
