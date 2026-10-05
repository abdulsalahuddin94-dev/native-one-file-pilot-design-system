await PF.page('➜ Profile');const c=DS.find('Pattern/Profile Screen','COMPONENT');const content=c.findOne(n=>n.name==='Profile content');
if(content.findOne(n=>n.name==='Sign out action'))throw new Error('Already built');
const wrap=DS.frame('VERTICAL','Sign out action',{parent:content,w:'FILL',h:'HUG',pad:['Spacing/Screen Margin','Number/0']});
const b=await DS.instance('Button',{Variant:'Secondary',State:'Default'});b.name='Sign out';wrap.appendChild(b);PF.fill(b);DS.props(b,{Label:'Sign out','Leading Icon':false});
for(const n of c.findAll(n=>n.type==='INSTANCE'&&['Profile identity','Name row','Email row','Phone row','Security row','Notifications row','Language row','Sign out'].includes(n.name)))n.isExposedInstance=true;
return {id:b.id,w:b.width,h:b.height,contentHeight:content.height};
