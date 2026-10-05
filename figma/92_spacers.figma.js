// One-time: give the existing empty spacer / inset frames auto layout (new builds get it from blank()).
let n = 0;
for (const p of figma.root.children) { await p.loadAsync();
  for (const f of p.findAll(x => x.type === 'FRAME' && x.layoutMode === 'NONE' && x.children.length === 0 && /^(Spacer|Inset)/.test(x.name))) {
    if (f.parent && f.parent.type === 'INSTANCE') continue;
    let a = f.parent, inInst = false; while (a && a.type !== 'PAGE') { if (a.type === 'INSTANCE') inInst = true; a = a.parent; } if (inInst) continue;
    const w = f.width, h = f.height, sh = f.layoutSizingHorizontal;
    f.layoutMode = 'HORIZONTAL'; f.primaryAxisSizingMode = 'FIXED'; f.counterAxisSizingMode = 'FIXED'; f.resize(w, h);
    if (sh === 'FILL') f.layoutSizingHorizontal = 'FILL'; n++;
  } }
return { converted: n };
