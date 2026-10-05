const out = { renamed: 0 };
for (const p of figma.root.children) {
  await p.loadAsync();
  for (const n of p.findAll(n => n.name === 'Platform Preview' && n.type === 'FRAME')) { n.name = 'Preview (instances)'; out.renamed++;
    const t = n.findOne(x => x.type === 'TEXT' && x.name === 'Section Title'); if (t) { await figma.loadFontAsync(t.fontName); t.characters = 'Preview (instances, not components): the same component placed in frames that only change the OS and Color modes'; }
    for (const f of n.findAll(x => x.type === 'FRAME' && /^(iOS|Android) (Light|Dark)$/.test(x.name))) { f.name = 'Preview · ' + f.name.replace(' ', ' · '); out.renamed++; } }
  for (const n of p.findAll(n => n.type === 'FRAME' && n.name === 'Text' && n.parent && n.parent.name === 'Row')) { n.name = 'Text Content'; out.renamed++; }
  for (const n of p.findAll(n => n.type === 'FRAME' && n.name === 'Platform Preview')) { n.name = 'Preview (instances)'; out.renamed++; }
}
const s = figma.root.children.find(x => x.name === '➜ Settings'); const mm = s.findOne(n => n.name === 'Mode Matrix'); if (mm) { mm.name = 'Preview (instances): Mode Matrix'; out.renamed++; }
return out;
