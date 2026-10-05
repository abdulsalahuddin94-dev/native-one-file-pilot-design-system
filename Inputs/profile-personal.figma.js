await PF.page('➜ Profile');const c=DS.find('Pattern/Profile Screen','COMPONENT');const content=c.findOne(n=>n.name==='Profile content');
if(content.findOne(n=>n.name==='Personal information section'))throw new Error('Already built');
const s=DS.frame('VERTICAL','Personal information section',{parent:content,w:'FILL',h:'HUG',gap:'Spacing/Stack Gap'});
const titleWrap=DS.frame('VERTICAL','Personal heading inset',{parent:s,w:'FILL',h:'HUG',pad:['Spacing/Screen Margin','Number/0']});
const title=await PF.text('Personal information','Headline','Personal information heading',titleWrap);PF.textProp(c,title,'Personal section title','Personal information');
title.textAutoResize='HEIGHT';title.resize(titleWrap.width,title.height);title.layoutSizingHorizontal='FILL';
const inset=DS.frame('VERTICAL','Personal group inset',{parent:s,w:'FILL',h:'HUG',pad:['List Group/Inset','Number/0']});
const group=DS.frame('VERTICAL','Personal information group',{parent:inset,w:'FILL',h:'HUG',radius:'List Group/Radius'});group.clipsContent=true;
for(const [key,label,value] of [['Name','Full name','Abdul Salah'],['Email','Email','abdul@example.com'],['Phone','Phone number','+20 100 123 4567']]){
 const row=await DS.instance('List Item',{Trailing:'Value'});row.name=key+' row';group.appendChild(row);PF.fill(row);
 DS.props(row,{Title:label,Value:value,'Leading Icon':false,'Supporting Text':'','Show Supporting Text':false,'Show Separator':key!=='Phone'});
}
return {section:s.id,group:group.id,w:s.width,h:s.height,rows:group.children.map(n=>({id:n.id,name:n.name,w:n.width,h:n.height}))};
