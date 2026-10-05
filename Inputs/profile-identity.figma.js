await PF.page('➜ Profile');const c=DS.find('Pattern/Profile Screen','COMPONENT');const content=c.findOne(n=>n.name==='Profile content');
if(content.findOne(n=>n.name==='Profile identity'))throw new Error('Already built');
const h=await DS.instance('Profile Header');h.name='Profile identity';content.appendChild(h);PF.fill(h);h.layoutSizingVertical='HUG';
return {id:h.id,w:h.width,h:h.height};
