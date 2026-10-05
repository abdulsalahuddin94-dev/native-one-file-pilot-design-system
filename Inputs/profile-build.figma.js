// Approved Profile build, Codex, 2026-10-05. Executed in small phases.
await DS.ready();
if (figma.root.name !== 'Native One File Pilot Design System') throw new Error('Wrong file');
const fonts=await figma.listAvailableFontsAsync();
for (const f of fonts.filter(f=>['SF Pro','Roboto','Noto Sans Arabic','Inter'].includes(f.fontName.family))) await figma.loadFontAsync(f.fontName);
globalThis.PF = {
  page:async(name)=>{let p=figma.root.children.find(p=>p.name===name);if(!p){p=figma.createPage();p.name=name;}await figma.setCurrentPageAsync(p);return p;},
  comp:(name)=>{const c=figma.createComponent();c.name=name;c.layoutMode='VERTICAL';c.fills=[];c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='FIXED';return c;},
  textProp:(c,t,label,value)=>{const p=c.addComponentProperty(label,'TEXT',value);t.componentPropertyReferences={...t.componentPropertyReferences,characters:p};return p;},
  modes:async(n,os,color,lang)=>{for(const c of await figma.variables.getLocalVariableCollectionsAsync()){const v={OS:os,Color:color,Language:lang}[c.name];if(v)n.setExplicitVariableModeForCollection(c,c.modes.find(m=>m.name===v).modeId);}},
  fonts:async(n)=>{for(const t of n.findAllWithCriteria({types:['TEXT']}))for(const s of t.getStyledTextSegments(['fontName']))await figma.loadFontAsync(s.fontName);},
  fill:(n)=>{n.layoutSizingHorizontal='FILL';return n;},
  text:async(chars,style,name,parent)=>{const t=await DS.text(chars,style,'Label/Primary',name,parent);return t;}
};
return {helpers:'PF installed',fonts:fonts.filter(f=>['SF Pro','Roboto','Noto Sans Arabic'].includes(f.fontName.family)).length};
