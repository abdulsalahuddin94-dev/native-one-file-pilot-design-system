// read-only
// Binding and property-coverage check for component sets (used by ds-auditor; safe for any agent).
// Run with figma-console `figma_execute` (paste the whole file). Reads only; guard_figma.py denies write
// APIs in scripts that start with "// read-only".
// Reports, per component set:
//   - propertyCoverage: TEXT / BOOLEAN / INSTANCE_SWAP properties that some variants do not reference
//     (cloned variants silently lose componentPropertyReferences; trial finding 31)
//   - unbound: fills/strokes without a color variable, padding/gap/radius without a variable,
//     text without a text style, effects without an effect style
// Set SCOPE to a page name, a component set name, or 'all' (every page; slower).
const SCOPE = 'all';

const PAD = ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'itemSpacing', 'counterAxisSpacing'];
const RAD = ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius'];

// Nested instances are not entered: their own component sets are checked on their own.
function walk(node, fn, root = node) {
  fn(node);
  if (node !== root && node.type === 'INSTANCE') return;
  if ('children' in node) for (const c of node.children) walk(c, fn, root);
}

function unboundIn(variant) {
  const issues = [];
  walk(variant, (n) => {
    const bv = n.boundVariables || {};
    for (const key of ['fills', 'strokes']) {
      const paints = n[key];
      if (!Array.isArray(paints)) continue;
      paints.forEach((p, i) => {
        if (p.visible === false || p.type !== 'SOLID') return;
        const bound = p.boundVariables && p.boundVariables.color;
        if (!bound) issues.push(n.name + ': raw ' + key.slice(0, -1) + ' #' + i);
      });
    }
    if (n.layoutMode && n.layoutMode !== 'NONE') {
      for (const k of PAD) if (n[k] > 0 && !bv[k]) issues.push(n.name + ': ' + k + ' ' + n[k] + ' unbound');
    }
    if ('topLeftRadius' in n) {
      for (const k of RAD) if (n[k] > 0 && !bv[k]) { issues.push(n.name + ': radius ' + n[k] + ' unbound'); break; }
    }
    if (n.type === 'TEXT' && !n.textStyleId) issues.push(n.name + ': text without a text style');
    if (Array.isArray(n.effects) && n.effects.length && !n.effectStyleId) issues.push(n.name + ': effect without a style');
  });
  return issues;
}

function coverage(set) {
  const defs = set.componentPropertyDefinitions || {};
  const keys = Object.keys(defs).filter((k) => defs[k].type !== 'VARIANT');
  const missing = {};
  for (const variant of set.children) {
    const used = new Set();
    walk(variant, (n) => {
      const r = n.componentPropertyReferences || {};
      for (const v of Object.values(r)) used.add(v);
    });
    for (const k of keys) {
      if (!used.has(k)) (missing[k.split('#')[0]] = missing[k.split('#')[0]] || []).push(variant.name);
    }
  }
  return missing;
}


await DS.ready(); const components=[];
for(const name of ['Avatar','Profile Header','Pattern/Profile Screen']){
const c=await DS.comp(name);const props=c.componentPropertyDefinitions; const used=new Set();
walk(c,n=>{for(const v of Object.values(n.componentPropertyReferences||{}))used.add(v)});
components.push({name,id:c.id,unbound:unboundIn(c),unwired:Object.keys(props).filter(k=>props[k].type!=='VARIANT'&&!used.has(k)),exposed:c.findAll(n=>n.type==='INSTANCE'&&n.isExposedInstance).length});
} return {components};
