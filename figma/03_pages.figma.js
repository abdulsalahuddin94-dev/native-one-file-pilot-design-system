if (!figma.root.name.startsWith('Native One File Pilot')) throw new Error('Wrong file');
const PAGES = ['Cover','⭐Setup','➜ Colors','➜ Typography','➜ Platform Tokens','➜ Icons','➜ Platform Preview','⭐Navigation','➜ Button','➜ Icon Button','➜ Segmented Control','➜ Top App Bar','⭐Form Elements','➜ Toggle','➜ Checkbox','➜ Text Field','⭐Data Display','➜ List Item','⭐Pilot Screens','➜ Settings'];
const first = figma.root.children[0];
if (first.name === 'Page 1' && first.children.length === 0) first.name = 'Cover';
const out = [];
PAGES.forEach((n, i) => {
  let p = figma.root.children.find(x => x.name === n);
  if (!p) p = figma.createPage(), p.name = n;
  figma.root.insertChild(i, p);
  out.push(n + '=' + p.id);
});
return out;
