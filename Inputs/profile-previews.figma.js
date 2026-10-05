const p=await PF.page('➜ Profile');const c=DS.find('Pattern/Profile Screen','COMPONENT');await PF.fonts(c);
if(p.findOne(n=>n.name==='Profile mode matrix'))throw new Error('Matrix already exists');
const board=DS.frame('VERTICAL','Profile mode matrix',{gap:'Spacing/Section Gap'});board.x=600;board.y=160;
const previewIds=[];
for(const lang of ['EN','AR']){
const row=DS.frame('HORIZONTAL',lang+' previews',{parent:board,gap:'Spacing/Section Gap',w:'HUG',h:'HUG'});
for(const os of ['iOS','Android'])for(const color of ['Light','Dark']){
const card=DS.frame('VERTICAL',os+' / '+color+' / '+lang,{parent:row,gap:'Spacing/Stack Gap',w:'HUG',h:'HUG'});
await PF.modes(card,os,color,lang);DS.fill(card,'Surface/Screen');
const label=await DS.text(os+' · '+color+' · '+lang,'Footnote','Label/Secondary','Mode label',card);
const i=c.createInstance();card.appendChild(i);i.name='Profile / '+os+' / '+color+' / '+lang;
if(lang==='AR'){
DS.props(i,{'Personal section title':'المعلومات الشخصية','Account section title':'الحساب'});
const priv=i.findOne(n=>n.type==='INSTANCE'&&n.name==='Top App Bar Platform');DS.props(priv,{Title:'الملف الشخصي','Back Label':'رجوع'});
const h=i.findOne(n=>n.type==='INSTANCE'&&n.name==='Profile identity');DS.props(h,{'Display name':'عبدالرحمن صلاح'});
DS.props(h.findOne(n=>n.type==='INSTANCE'&&n.name==='Avatar'),{Initials:'ع ص'});
DS.props(h.findOne(n=>n.type==='INSTANCE'&&n.name==='Button'),{Label:'تعديل الملف الشخصي'});
for(const [name,title,value] of [['Name row','الاسم الكامل','عبدالرحمن صلاح'],['Email row','البريد الإلكتروني','abdul@example.com'],['Phone row','رقم الهاتف','+20 100 123 4567'],['Security row','الأمان'],['Notifications row','الإشعارات'],['Language row','اللغة']]){
const inst=i.findOne(n=>n.type==='INSTANCE'&&n.name===name);DS.props(inst,value?{Title:title,Value:value}:{Title:title});}
DS.props(i.findOne(n=>n.type==='INSTANCE'&&n.name==='Sign out'),{Label:'تسجيل الخروج'});
const headers=i.findAll(n=>n.type==='TEXT'&&['Personal information heading','Account heading'].includes(n.name));for(const t of headers)t.textAlignHorizontal='RIGHT';
}
previewIds.push({id:i.id,name:i.name,w:i.width,h:i.height});
}
}
figma.viewport.scrollAndZoomIntoView([board]);
return {board:board.id,w:board.width,h:board.height,previews:previewIds};
