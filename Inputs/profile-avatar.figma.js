const p=await PF.page('➜ Avatar');
if(p.findOne(n=>n.type==='COMPONENT'&&n.name==='Avatar')) throw new Error('Avatar already exists');
const c=PF.comp('Avatar');c.resize(64,64);c.primaryAxisSizingMode='FIXED';c.primaryAxisAlignItems='CENTER';c.counterAxisAlignItems='CENTER';
DS.size(c,'Number/64','Number/64');DS.radius(c,'Radius/Full');DS.fill(c,'Fill/Accent Subtle');
const t=await DS.text('AS','Title','Label/Accent','Initials',c);PF.textProp(c,t,'Initials','AS');
c.description='Purpose: identity initials when an account photo is unavailable. Usage: use inside Profile Header; set Initials to the account initials. Accessibility: decorative when the adjacent name already identifies the account. OS, Color and Language are inherited variable modes. Fixed 64 token size; no platform or theme variants.';
c.x=96;c.y=96;
return {id:c.id,name:c.name,bounds:{w:c.width,h:c.height},properties:c.componentPropertyDefinitions};
