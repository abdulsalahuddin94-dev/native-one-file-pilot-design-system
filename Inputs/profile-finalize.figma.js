// Final scoped adjustments captured after completion.
await DS.ready();
const a=await DS.comp('Avatar');DS.fill(a.findOne(n=>n.type==='TEXT'),'Label/Primary');
const c=await DS.comp('Pattern/Profile Screen');
const app=c.children.find(n=>n.type==='INSTANCE');for(const t of app.findAll(n=>n.type==='TEXT'&&n.name==='Back Label'))DS.fill(t,'Label/Primary');
for(const name of ['➜ Avatar','➜ Profile Header']){
const p=figma.root.children.find(p=>p.name===name);const before=figma.root.children.findIndex(p=>p.name==='⭐Pilot Screens');figma.root.insertChild(before,p);
}
const p=await PF.page('➜ Platform Preview');
if(p.findOne(n=>n.name==='Profile Header mode previews'))throw new Error('Header previews already exist');
const board=DS.frame('VERTICAL','Profile Header mode previews',{gap:'Spacing/Section Gap'});
board.x=Math.max(0,...p.children.filter(n=>n.id!==board.id).map(n=>n.x+n.width))+96;board.y=96;
for(const lang of ['EN','AR']){
const row=DS.frame('HORIZONTAL',lang+' Profile Header modes',{parent:board,w:'HUG',h:'HUG',gap:'Spacing/Section Gap'});
for(const os of ['iOS','Android'])for(const color of ['Light','Dark']){
const f=DS.frame('VERTICAL',os+' / '+color+' / '+lang,{parent:row,w:'HUG',h:'HUG',gap:'Spacing/Stack Gap'});await PF.modes(f,os,color,lang);DS.fill(f,'Surface/Screen');
await DS.text(os+' · '+color+' · '+lang,'Footnote','Label/Secondary','Mode label',f);
const h=await DS.instance('Profile Header');f.appendChild(h);
if(lang==='AR'){DS.props(h,{'Display name':'عبدالرحمن صلاح'});DS.props(h.findOne(n=>n.type==='INSTANCE'&&n.name==='Avatar'),{Initials:'ع ص'});DS.props(h.findOne(n=>n.type==='INSTANCE'&&n.name==='Button'),{Label:'تعديل الملف الشخصي'});}
}
}
return {board:board.id,w:board.width,h:board.height};
