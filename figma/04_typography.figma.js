const p = await page('➜ Typography'); clearPage(p);
const root = AL('VERTICAL', 'Typography', { itemSpacing: 32, paddingTop: 48, paddingLeft: 48, paddingRight: 48, paddingBottom: 48 });
fill(root, 'Color:Background/Primary');
root.appendChild(await txt('Typography', 'Large Title', 'Color:Label/Primary', 'Page Title'));
const intro = await txt('One set of text styles. Each style binds family, size, line height and weight to OS tokens; OS tokens alias the Language collection. Columns only change the OS and Language modes.', 'Body', 'Color:Label/Secondary', 'Page Description');
root.appendChild(intro); intro.resize(1200, intro.height); intro.textAutoResize = 'HEIGHT';
const row = AL('HORIZONTAL', 'Mode Columns', { itemSpacing: 24 }); root.appendChild(row);
const ROLES = ['Large Title','Title','Headline','Body','Subhead','Footnote','Caption','Button Label'];
for (const [os, lang] of [['iOS','EN'],['Android','EN'],['iOS','AR'],['Android','AR']]) {
  const col = AL('VERTICAL', os + ' ' + lang, { itemSpacing: 16, paddingTop: 24, paddingLeft: 24, paddingRight: 24, paddingBottom: 24 });
  fill(col, 'Color:Surface/Container'); col.cornerRadius = 12; row.appendChild(col);
  modes(col, { OS: os, Language: lang });
  col.appendChild(await txt(os + ' · ' + lang, 'Caption', 'Color:Label/Accent', 'Column Label'));
  for (const r of ROLES) {
    const item = AL('VERTICAL', r, { itemSpacing: 2 }); col.appendChild(item);
    item.appendChild(await txt(lang === 'AR' ? 'الإعدادات العامة' : 'General Settings', r, 'Color:Label/Primary', 'Sample'));
    item.appendChild(await txt(r, 'Caption', 'Color:Label/Tertiary', 'Style Name'));
  }
}
root.x = 0; root.y = 0;
return { id: root.id };
