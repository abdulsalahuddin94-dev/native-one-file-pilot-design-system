const r = [];
for (const p of figma.root.children) { await p.loadAsync();
  for (const s of p.findAllWithCriteria({ types: ['COMPONENT_SET'] })) r.push(s.name + ' (' + s.children.length + ' variants: ' + Object.keys(s.componentPropertyDefinitions).filter(k => s.componentPropertyDefinitions[k].type === 'VARIANT').join(',') + ')');
  for (const c of p.findAllWithCriteria({ types: ['COMPONENT'] })) if (c.parent.type !== 'COMPONENT_SET') r.push(c.name); }
return r;
