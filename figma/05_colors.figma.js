const p = await page('➜ Colors'); clearPage(p);
const root = AL('VERTICAL', 'Colors', { itemSpacing: 32, paddingTop: 48, paddingLeft: 48, paddingRight: 48, paddingBottom: 48 });
fill(root, 'Color:Background/Primary'); modes(root, { Color: 'Light' });
root.appendChild(await txt('Colors', 'Large Title', 'Color:Label/Primary', 'Page Title'));
const d = await txt('Semantic colors are shared by iOS and Android and alias Primitives only. Each swatch is bound to its variable; the Dark frame only switches the Color mode.', 'Body', 'Color:Label/Secondary', 'Page Description');
root.appendChild(d); d.resize(1200, d.height); d.textAutoResize = 'HEIGHT';
const sem = _vars.filter(v => v.variableCollectionId === COL('Color').id);
const groups = [...new Set(sem.map(v => v.name.split('/')[0]))];
const row = AL('HORIZONTAL', 'Modes', { itemSpacing: 24 }); root.appendChild(row);
for (const m of ['Light', 'Dark']) {
  const col = AL('VERTICAL', m, { itemSpacing: 20, paddingTop: 24, paddingLeft: 24, paddingRight: 24, paddingBottom: 24 });
  fill(col, 'Color:Background/Primary'); stroke(col, 'Color:Border/Default', 1); bind(col, { topLeftRadius: 'OS:Radius/Card', topRightRadius: 'OS:Radius/Card', bottomLeftRadius: 'OS:Radius/Card', bottomRightRadius: 'OS:Radius/Card' });
  modes(col, { Color: m }); row.appendChild(col);
  col.appendChild(await txt(m, 'Headline', 'Color:Label/Primary', 'Mode Label'));
  for (const g of groups) {
    const gr = AL('VERTICAL', g, { itemSpacing: 8 }); col.appendChild(gr);
    gr.appendChild(await txt(g, 'Footnote', 'Color:Label/Secondary', 'Group Label'));
    const wrap = AL('HORIZONTAL', 'Swatches', { itemSpacing: 12, layoutWrap: 'WRAP', counterAxisSpacing: 12 });
    gr.appendChild(wrap); wrap.primaryAxisSizingMode = 'FIXED'; wrap.resize(560, 10); wrap.counterAxisSizingMode = 'AUTO';
    for (const v of sem.filter(x => x.name.split('/')[0] === g)) {
      const sw = AL('VERTICAL', v.name, { itemSpacing: 6 }); wrap.appendChild(sw);
      const chip = figma.createRectangle(); chip.name = 'Swatch'; chip.resize(128, 48); chip.cornerRadius = 8;
      fill(chip, 'Color:' + v.name); stroke(chip, 'Color:Border/Default', 1); sw.appendChild(chip);
      if (g === 'Shadow') chip.effects = [];
      sw.appendChild(await txt(v.name.split('/').slice(1).join('/'), 'Caption', 'Color:Label/Primary', 'Token Name'));
    }
  }
}
return { id: root.id };
