await PF.page('➜ Profile');const c=DS.find('Pattern/Profile Screen','COMPONENT');const content=c.findOne(n=>n.name==='Profile content');
if(content.findOne(n=>n.name==='Account section'))throw new Error('Already built');
const s=DS.frame('VERTICAL','Account section',{parent:content,w:'FILL',h:'HUG',gap:'Spacing/Stack Gap'});
const titleWrap=DS.frame('VERTICAL','Account heading inset',{parent:s,w:'FILL',h:'HUG',pad:['Spacing/Screen Margin','Number/0']});
const title=await PF.text('Account','Headline','Account heading',titleWrap);PF.textProp(c,title,'Account section title','Account');
title.textAutoResize='HEIGHT';title.resize(titleWrap.width,title.height);title.layoutSizingHorizontal='FILL';
const inset=DS.frame('VERTICAL','Account group inset',{parent:s,w:'FILL',h:'HUG',pad:['List Group/Inset','Number/0']});
const group=DS.frame('VERTICAL','Account navigation group',{parent:inset,w:'FILL',h:'HUG',radius:'List Group/Radius'});group.clipsContent=true;
for(const [key,label,icon] of [['Security','Security','Lock'],['Notifications','Notifications','Notifications'],['Language','Language','Globe']]){
const row=await DS.instance('List Item',{Trailing:'Chevron'});row.name=key+' row';group.appendChild(row);PF.fill(row);
DS.props(row,{Title:label,'Leading Icon':true,'Leading Icon Swap':await DS.comp('Icon/'+icon),'Supporting Text':'','Show Supporting Text':false,'Show Separator':key!=='Language'});
}
return {section:s.id,w:s.width,h:s.height,rows:group.children.map(n=>({id:n.id,name:n.name,w:n.width,h:n.height}))};
